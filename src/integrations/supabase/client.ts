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
      flowType: 'pkce',
      debug: process.env.NODE_ENV === 'development'
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      }
    },
    db: {
      schema: 'public'
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);

// Helper to get current session
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
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

// Helper to get auth header
export const getAuthHeaders = async () => {
  const session = await getSession();
  return session ? {
    Authorization: `Bearer ${session.access_token}`
  } : {};
};