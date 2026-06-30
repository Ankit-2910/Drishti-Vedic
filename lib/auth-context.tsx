'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthUser {
  email: string;
  id?: string;
  isDemo?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isConfigured: boolean;
  sendMagicLink: (email: string) => Promise<{ ok: boolean; message: string; demo?: boolean; canDemo?: boolean }>;
  demoLogin: (email: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_KEY = 'drishti_demo_user';

// Detect if Supabase is actually configured (not placeholder)
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && !url.includes('placeholder');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    let mounted = true;

    async function init() {
      // Demo session check first
      try {
        const demoRaw = localStorage.getItem(DEMO_KEY);
        if (demoRaw) {
          const demo = JSON.parse(demoRaw);
          if (mounted) {
            setUser({ email: demo.email, isDemo: true });
            setLoading(false);
          }
          return;
        }
      } catch {}

      if (configured) {
        try {
          const { data } = await supabase.auth.getSession();
          if (mounted && data.session?.user) {
            setUser({
              email: data.session.user.email || '',
              id: data.session.user.id,
            });
          }
        } catch (e) {
          console.error('Auth session error:', e);
        }
      }
      if (mounted) setLoading(false);
    }

    init();

    // Listen for Supabase auth changes (magic link callback)
    let subscription: any;
    if (configured) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({ email: session.user.email || '', id: session.user.id });
        } else {
          // Don't clear demo users
          const demoRaw = localStorage.getItem(DEMO_KEY);
          if (!demoRaw) setUser(null);
        }
      });
      subscription = data.subscription;
    }

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, [configured]);

  async function sendMagicLink(email: string) {
    if (!configured) {
      // Demo mode — auto "login"
      return { ok: true, message: 'Demo mode: no email server configured. Use "Demo login" to continue instantly.', demo: true };
    }
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined,
        },
      });
      if (error) {
        // Real auth failed (misconfigured project, provider disabled, etc.)
        // Offer demo fallback so the user is never blocked.
        return { ok: false, message: error.message, canDemo: true };
      }
      return { ok: true, message: 'Magic link sent! Check your inbox.' };
    } catch (e) {
      return { ok: false, message: e instanceof Error ? e.message : 'Failed to send link', canDemo: true };
    }
  }

  function demoLogin(email: string) {
    const demo = { email, isDemo: true };
    try { localStorage.setItem(DEMO_KEY, JSON.stringify(demo)); } catch {}
    setUser(demo);
  }

  async function logout() {
    try { localStorage.removeItem(DEMO_KEY); } catch {}
    if (configured) {
      try { await supabase.auth.signOut(); } catch {}
    }
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, isConfigured: configured, sendMagicLink, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      loading: false,
      isConfigured: false,
      sendMagicLink: async () => ({ ok: false, message: 'Auth not available' }),
      demoLogin: () => {},
      logout: async () => {},
    };
  }
  return ctx;
}
