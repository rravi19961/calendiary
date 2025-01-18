import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { date, userId } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Delete existing summary for the day if it exists
    const { error: deleteError } = await supabase
      .from('day_summaries')
      .delete()
      .eq('date', date)
      .eq('user_id', userId);

    if (deleteError) throw deleteError;

    // Fetch diary entries for the day
    const { data: entries, error: entriesError } = await supabase
      .from('diary_entries')
      .select('content, title, rating')
      .eq('date', date)
      .eq('user_id', userId);

    if (entriesError) throw entriesError;

    // Fetch chat history for the day
    const { data: chatHistory, error: chatError } = await supabase
      .from('chat_history')
      .select('content, role')
      .eq('date', date)
      .eq('user_id', userId);

    if (chatError) throw chatError;

    // If no data available, return empty summary
    if ((!entries || entries.length === 0) && (!chatHistory || chatHistory.length === 0)) {
      return new Response(
        JSON.stringify({ summary: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare diary entries content
    const entriesContent = entries?.map(entry => 
      `Title: ${entry.title}\nContent: ${entry.content}\nMood: ${entry.rating}`
    ).join('\n\n');

    // Prepare chat history content
    const chatContent = chatHistory?.map(msg => 
      `${msg.role}: ${msg.content}`
    ).join('\n');

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const summarySystemPrompt = `You are a personal diary assistant dedicated to creating clear and meaningful daily summaries. Follow these guidelines:

- **Summary Length**: Aim for 1600-1800 words. If provided input is limited, adjust the summary length proportionally without forcing it to meet the word count.

- **Language**: Use simple and accessible language. Avoid fancy or complex words to ensure the summary is easy to read and understand.

- **Content Accuracy**: Base the summary solely on the provided diary entries and chat conversations. Do not invent, embellish, or alter any details.

- **Input Integration**: Seamlessly incorporate both diary entries and chat Q&A inputs into the summary, ensuring a cohesive and comprehensive narrative of the day.

- **Focus Areas**:
  - Highlight actual events and emotions experienced during the day.
  - Emphasize positive aspects and opportunities for personal growth.

- **Mood Integration**: Naturally incorporate mood progression throughout the summary. Use emojis sparingly and only where they enhance the understanding or convey the emotion effectively.

- **Tone**: Maintain a warm, empathetic, and supportive tone throughout the summary.

- **Formatting**: Avoid using asterisks, bold text, italics, or any other special formatting unless specified for mood emojis.

- **Structure**: Organize the summary to flow logically through the day's events, ensuring it feels cohesive and reflective.

- **Authenticity**: Ensure the summary feels personal and genuine, aiding in meaningful reflection on real experiences.

**Remember**: Your goal is to help the user reflect on their actual experiences and emotions from the day in a clear and supportive manner. Do not mention or explain mood ratings. Focus on factual accuracy, simplicity, and a natural flow without unnecessary embellishments or formatting.

Avoid following the structure or style of the bad example provided. Ensure that the summary remains free from unwanted formatting, excessive emojis, and embellished language.`;

    // Generate the summary
    const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: summarySystemPrompt
          },
          { 
            role: 'user', 
            content: `Please provide a concise summary of this person's day based on their diary entries and chat conversations.

${entries?.length > 0 ? `Diary Entries:\n${entriesContent}\n\n` : ''}
${chatHistory?.length > 0 ? `Chat History:\n${chatContent}` : ''}`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!summaryResponse.ok) {
      const error = await summaryResponse.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error}`);
    }

    const summaryData = await summaryResponse.json();
    const summary = summaryData.choices[0].message.content;

    const titleSystemPrompt = `You are a personal diary assistant who creates meaningful titles. Follow these guidelines:

- Create exactly 6-8 words that capture the day's essence
- Use the day's overall mood and key events as inspiration
- Keep language simple yet engaging
- Focus on the most impactful or meaningful aspect of the day
- Avoid clichés and generic phrases
- Never use quotes in the title

Remember: The title should feel personal and reflect the actual content of their day.`;

    // Generate the title
    const titleResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: titleSystemPrompt
          },
          { 
            role: 'user', 
            content: `Create a title that captures the essence of this summary: ${summary}`
          }
        ],
        max_tokens: 50,
        temperature: 0.7,
      }),
    });

    if (!titleResponse.ok) {
      const error = await titleResponse.text();
      console.error('OpenAI API error for title generation:', error);
      throw new Error(`OpenAI API error: ${error}`);
    }

    const titleData = await titleResponse.json();
    const title = titleData.choices[0].message.content;

    // Calculate average rating from diary entries
    const ratings = entries?.map(entry => entry.rating).filter(rating => rating !== null) || [];
    const averageRating = ratings.length > 0 
      ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length)
      : 3; // Default to neutral if no ratings

    // Generate audio for the summary
    const audioResponse = await fetch(`${supabaseUrl}/functions/v1/text-to-speech`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: summary }),
    });

    if (!audioResponse.ok) {
      console.error('Error generating audio:', await audioResponse.text());
      throw new Error('Failed to generate audio');
    }

    const audioData = await audioResponse.json();
    
    // Convert base64 to Blob
    const byteCharacters = atob(audioData.audioContent);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const audioBlob = new Blob([byteNumbers], { type: 'audio/mp3' });

    // Upload audio to storage
    const audioFileName = `${userId}/${date}_summary.mp3`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('diary_images')
      .upload(audioFileName, audioBlob, {
        contentType: 'audio/mp3',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading audio:', uploadError);
      throw uploadError;
    }

    // Get public URL for the audio file
    const { data: { publicUrl: audioUrl } } = supabase
      .storage
      .from('diary_images')
      .getPublicUrl(audioFileName);

    // Save the new summary with audio URL
    const { error: insertError } = await supabase
      .from('day_summaries')
      .insert([{
        user_id: userId,
        date,
        content: summary,
        title: title,
        rating: averageRating,
        audio_url: audioUrl
      }]);

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ summary, title, audioUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-day-summary function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});