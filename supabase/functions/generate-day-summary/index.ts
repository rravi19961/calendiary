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

    // Fetch diary entries for the day
    const { data: entries, error: entriesError } = await supabase
      .from('diary_entries')
      .select('content, title, rating')
      .eq('date', date)
      .eq('user_id', userId);

    if (entriesError) throw entriesError;

    // Fetch chat responses for the day
    const { data: chatResponses, error: responsesError } = await supabase
      .from('question_responses')
      .select(`
        question_choices (
          choice_text
        ),
        other_text,
        daily_questions (
          question_text
        )
      `)
      .eq('date', date)
      .eq('user_id', userId);

    if (responsesError) throw responsesError;

    // If no data available, return empty summary
    if ((!entries || entries.length === 0) && (!chatResponses || chatResponses.length === 0)) {
      return new Response(
        JSON.stringify({ summary: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare diary entries content
    const entriesContent = entries?.map(entry => 
      `Title: ${entry.title}\nContent: ${entry.content}\nMood Rating: ${entry.rating}`
    ).join('\n\n');

    // Prepare chat responses content
    const chatContent = chatResponses?.map(response => {
      const questionText = response.daily_questions?.question_text || '';
      const answerText = response.question_choices?.choice_text || response.other_text || '';
      return `Question: ${questionText}\nAnswer: ${answerText}`;
    }).join('\n\n');

    // Create the prompt for OpenAI
    const prompt = `Please provide a comprehensive summary of this person's day based on their diary entries and chat responses. Focus on the main events, mood, and key activities. Keep it personal and empathetic.

${entries?.length > 0 ? `Diary Entries:\n${entriesContent}\n\n` : ''}
${chatResponses?.length > 0 ? `Chat Responses:\n${chatContent}` : ''}`;

    console.log('Sending request to OpenAI with prompt:', prompt);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey || openAIApiKey.trim() === '') {
      throw new Error('OpenAI API key is not configured or is empty');
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