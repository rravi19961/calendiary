import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    console.log('Received request for date:', date, 'userId:', userId);

    if (!date || !userId) {
      throw new Error('Date and userId are required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching diary entries...');
    // Fetch diary entries for the day
    const { data: diaryEntries, error: diaryError } = await supabase
      .from('diary_entries')
      .select('content, title, rating')
      .eq('user_id', userId)
      .eq('date', date);

    if (diaryError) {
      console.error('Error fetching diary entries:', diaryError);
      throw diaryError;
    }

    console.log('Fetching question responses...');
    // Fetch question responses for the day
    const { data: responses, error: responsesError } = await supabase
      .from('question_responses')
      .select(`
        question_choices (choice_text),
        other_text
      `)
      .eq('user_id', userId)
      .eq('date', date);

    if (responsesError) {
      console.error('Error fetching responses:', responsesError);
      throw responsesError;
    }

    // Prepare the content for summarization
    const diaryContent = diaryEntries?.map(entry => 
      `Entry: ${entry.title}\nContent: ${entry.content}\nMood Rating: ${entry.rating}`
    ).join('\n\n');

    const responsesContent = responses?.map(response => 
      response.question_choices?.choice_text || response.other_text
    ).join('\n');

    console.log('Preparing prompt for Gemini...');
    const prompt = `Please provide a concise summary of this person's day based on their diary entries and responses:

Diary Entries:
${diaryContent || 'No diary entries for this day.'}

Daily Responses:
${responsesContent || 'No responses for this day.'}

Please provide a brief, empathetic summary that captures the key moments and overall mood of the day. Keep it to 2-3 sentences.`;

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    console.log('Calling Gemini API...');
    // Call Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${geminiApiKey}`,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${errorText}`);
    }

    const result = await response.json();
    const summary = result.candidates[0].content.parts[0].text;
    console.log('Generated summary:', summary);

    return new Response(
      JSON.stringify({ summary }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-day-summary function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});