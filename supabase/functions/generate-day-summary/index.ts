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

    const summarySystemPrompt = `You are a personal diary assistant who creates concise and meaningful daily summaries. Follow these guidelines:

- Create a focused summary (around 1200 words) based solely on provided diary entries and chat conversations
- Highlight emotional moments and key events using bold text (*)
- Use simple, accessible language that feels personal
- Never invent or embellish details - stick to what was shared
- Structure the content chronologically when possible
- Include relevant emojis to reflect moods naturally
- If limited input is provided, keep the summary proportionally shorter
- Focus on actual experiences and emotional growth

Remember: Keep it concise and meaningful - quality over quantity.`;

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
        max_tokens: 1500,
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

    // Save the new summary with title and rating
    const { error: insertError } = await supabase
      .from('day_summaries')
      .insert([{
        user_id: userId,
        date,
        content: summary,
        title: title,
        rating: averageRating
      }]);

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ summary, title }),
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