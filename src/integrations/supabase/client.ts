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
      flowType: 'pkce',
      debug: process.env.NODE_ENV === 'development',
      // Add a default session handling
      onAuthStateChange: (event, session) => {
        if (event === 'SIGNED_OUT') {
          // Clear any cached data when user signs out
          localStorage.removeItem('supabase.auth.token');
        }
      }
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      // Add request handling
      fetch: (url, options = {}) => {
        // Get the current session token
        const session = supabase.auth.session();
        if (session?.access_token) {
          options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${session.access_token}`
          };
        }
        return fetch(url, options);
      }
    },
    // Add better error handling
    shouldThrowOnError: true,
    // Add request retries
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

// Add a helper to check if user is authenticated
export const isAuthenticated = () => {
  const session = supabase.auth.session();
  return !!session?.user?.id;
};

// Add a helper to get current user
export const getCurrentUser = () => {
  const session = supabase.auth.session();
  return session?.user || null;
};