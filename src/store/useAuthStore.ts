"use client";

import type { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

type AuthStore = {
  user: User | null;
  isReady: boolean;
  isConfigured: boolean;
  error: string;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isReady: false,
  isConfigured: Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ),
  error: "",
  initialize: async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      set({ isReady: true, isConfigured: false });
      return;
    }

    const { data } = await supabase.auth.getSession();
    set({
      user: data.session?.user ?? null,
      isReady: true,
      isConfigured: true,
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, isReady: true, error: "" });
    });
  },
  signIn: async (email, password) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) throw new Error("Supabase is not configured.");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      set({ error: error.message });
      throw error;
    }
    set({ error: "" });
  },
  signUp: async (email, password) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) throw new Error("Supabase is not configured.");

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      set({ error: error.message });
      throw error;
    }
    set({ error: "" });
  },
  signOut: async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
