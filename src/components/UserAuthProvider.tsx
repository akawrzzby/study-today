"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  homepage: string;
}

interface UserAuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string, homepage: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const UserAuthContext = createContext<UserAuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  signUp: async () => ({ error: "not initialized" }),
  signIn: async () => ({ error: "not initialized" }),
  signOut: async () => {},
});

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) {
      setProfile(data as UserProfile);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signUp = useCallback(async (email: string, password: string, username: string, homepage: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, homepage },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      // 确保 profile 存在
      await supabase.from("profiles").upsert({
        id: data.user.id,
        username,
        homepage: homepage || "",
      });
      fetchProfile(data.user.id);
    }

    return {};
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
    return {};
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  return (
    <UserAuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}