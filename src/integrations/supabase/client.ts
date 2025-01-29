import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cmwlvapbnlkpviwwexmq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtd2x2YXBibmxrcHZpd3dleG1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MjkzMTMsImV4cCI6MjA1MTUwNTMxM30.xtW4EQVIG_bsoyliNcf5aXTgW15GD2VJ2E2rdQJoAKI";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  }
);

// Helper to get current session
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

// Helper to check if user is authenticated
export const isAuthenticated = async () => {
  const session = await getSession();
  return !!session?.user;
};

// Helper to get current user
export const getCurrentUser = async () => {
  const session = await getSession();
  return session?.user || null;
};