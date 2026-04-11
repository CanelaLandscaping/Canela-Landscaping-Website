import { supabase, isSupabaseConfigured } from './client';
import type { Session } from '@supabase/supabase-js';

export interface Lead {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  status: string;
  created_at: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  service: string;
  message: string;
}

/**
 * Authentication Queries
 */

export const signIn = async (email: string, password: string) => {
  if (!isSupabaseConfigured) throw new Error("Supabase is not configured.");
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
};

export const getSession = async () => {
  if (!isSupabaseConfigured) return { data: { session: null }, error: null };
  return await supabase.auth.getSession();
};

export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
  if (!isSupabaseConfigured) return { data: { subscription: { unsubscribe: () => {} } } };
  
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};

/**
 * Database Queries
 */

export const submitContactForm = async (formData: ContactFormData) => {
  if (!isSupabaseConfigured) {
    throw new Error("Our contact system is currently unavailable. Please call us directly.");
  }

  // 1. Save lead to DB
  const { error: dbError } = await supabase
    .from('contact_submissions')
    .insert([{
      ...formData,
      status: 'New'
    }]);

  if (dbError) throw dbError;

  // 2. Trigger notification edge function
  supabase.functions.invoke('send-contact-email', {
    body: formData
  }).catch(err => console.error("Email notification failed:", err));

  return true;
};

export const getLeads = async (): Promise<Lead[]> => {
  if (!isSupabaseConfigured) return [];
  
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as Lead[]) || [];
};
