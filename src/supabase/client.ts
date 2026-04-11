import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Strict check: Must be a valid HTTPS string and not the placeholder text
export const isSupabaseConfigured = 
  !!rawUrl && 
  rawUrl.startsWith('https://') && 
  !!rawKey && 
  rawUrl !== 'your_supabase_project_url';

if (!isSupabaseConfigured) {
  console.warn('Supabase credentials missing or invalid. Admin features will be disabled.');
}

// To prevent the Supabase client from throwing "Invalid supabaseUrl" on startup,
// we ensure it ALWAYS receives a string that passes its internal validation.
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'placeholder';

export const supabase = createClient(
  isSupabaseConfigured ? rawUrl! : fallbackUrl,
  isSupabaseConfigured ? rawKey! : fallbackKey
);
