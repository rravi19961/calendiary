import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cmwlvapbnlkpviwwexmq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtd2x2YXBibmxrcHZpd3dleG1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MjkzMTMsImV4cCI6MjA1MTUwNTMxM30.xtW4EQVIG_bsoyliNcf5aXTgW15GD2VJ2E2rdQJoAKI";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      flowType: 'pkce'
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    }
  }
);