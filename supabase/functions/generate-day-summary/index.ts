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
      `Title: ${entry.title}\nContent: ${entry.content}\nMood Rating: ${entry.rating}`
    ).join('\n\n');

    // Prepare chat history content
    const chatContent = chatHistory?.map(msg => 
      `${msg.role}: ${msg.content}`
    ).join('\n');

    // Create the prompt for OpenAI
    const prompt = `Please provide a comprehensive summary of this person's day based on their diary entries and chat conversations. Focus on the main events, mood, and key activities. Keep it personal and empathetic.

${entries?.length > 0 ? `Diary Entries:\n${entriesContent}\n\n` : ''}
${chatHistory?.length > 0 ? `Chat History:\n${chatContent}` : ''}`;

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that creates empathetic and personal summaries of someone\'s day.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 250,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const summary = data.choices[0].message.content;

    // Save the new summary
    const { error: insertError } = await supabase
      .from('day_summaries')
      .insert([{
        user_id: userId,
        date,
        content: summary,
      }]);

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ summary }),
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