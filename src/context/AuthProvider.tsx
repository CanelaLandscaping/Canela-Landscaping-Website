import { useEffect, useState, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '../supabase/client';
import { getSession, onAuthStateChange, signOut as supabaseSignOut } from '../supabase/queries';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured); // Initialize based on config

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Check active sessions and sets the user
    getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }) as { data: { subscription: { unsubscribe: () => void } } };

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabaseSignOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
