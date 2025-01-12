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
    const { message, date, userId } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch diary entries for context
    const { data: entries, error: entriesError } = await supabase
      .from('diary_entries')
      .select('content, title, rating')
      .eq('date', date)
      .eq('user_id', userId);

    if (entriesError) throw entriesError;

    const diaryContext = entries?.map(entry => 
      `Title: ${entry.title}\nContent: ${entry.content}\nMood: ${entry.rating}`
    ).join('\n\n');

    const systemPrompt = `You are the user's trusted friend and confidant, here to listen and support them through their daily journaling. Follow these guidelines:

- Greet them warmly like a close friend who's been looking forward to catching up
- Keep questions short, natural, and conversational
- Show you remember context from their previous entries
- Respond with genuine interest and empathy
- Offer subtle encouragement and support
- Help them explore their emotions without pushing
- Keep the conversation flowing naturally
- If they share challenges, be supportive while gently guiding toward positive perspectives

Current date: ${date}
Their previous entries today: ${diaryContext || 'No entries yet'}

Remember: You're their trusted friend, not a therapist or counselor. Keep it personal and genuine.`;

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    console.log('Sending request to OpenAI with message:', message);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat-with-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});