import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { date, userId } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch diary entries for the day
    const { data: entries, error: entriesError } = await supabase
      .from('diary_entries')
      .select('content, title, rating')
      .eq('date', date)
      .eq('user_id', userId);

    if (entriesError) throw entriesError;

    // Fetch question responses for the day
    const { data: responses, error: responsesError } = await supabase
      .from('question_responses')
      .select(`
        other_text,
        question_choices (choice_text)
      `)
      .eq('date', date)
      .eq('user_id', userId);

    if (responsesError) throw responsesError;

    // Prepare the content for OpenAI
    const entriesContent = entries?.map(entry => 
      `Title: ${entry.title}\nContent: ${entry.content}\nMood Rating: ${entry.rating}`
    ).join('\n\n');

    const responsesContent = responses?.map(response => 
      response.question_choices?.choice_text || response.other_text
    ).join('\n');

    // Create the prompt for OpenAI
    const prompt = `Please provide a concise summary of this person's day based on their diary entries. Focus on the main events, mood, and key activities. Keep it personal and empathetic.

Diary Entries:
${entriesContent}`;

    console.log('Sending request to OpenAI with prompt:', prompt);

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that creates empathetic and personal summaries of someone\'s day.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 250,
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error}`);
    }

    const aiData = await openAIResponse.json();
    const summary = aiData.choices[0].message.content;

    console.log('Generated summary:', summary);

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