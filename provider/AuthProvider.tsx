import { getUserById } from "@/lib/api/users"; // ← import Twojej metody API
import { supabase } from "@/lib/supabase";
import React, { createContext, useContext, useEffect, useState } from "react";

type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
};

type AuthContextType = {
  isAuthenticated: boolean;
  userId: string | null;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    username: string
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userId: null,
  profile: null,
  signIn: async () => ({ error: undefined }),
  signUp: async () => ({ error: undefined }),
  signOut: async () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (id: string) => {
    try {
      const userData = await getUserById(id);
      setProfile(userData);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const id = data.session.user.id;
        setIsAuthenticated(true);
        setUserId(id);
        await fetchProfile(id);
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.session) {
        return { error: error?.message || "Authentication failed" };
      }

      const id = data.session.user.id;
      setUserId(id);
      setIsAuthenticated(true);
      await fetchProfile(id);

      return { error: undefined };
    } catch (err: any) {
      return { error: err.message || "Unknown error" };
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (error || !data.session) {
        return { error: error?.message || "Registration failed" };
      }

      const id = data.session.user.id;
      setUserId(id);
      setIsAuthenticated(true);
      await fetchProfile(id);

      return { error: undefined };
    } catch (err: any) {
      return { error: err.message || "Unknown error" };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserId(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userId,
        profile,
        signIn,
        signUp,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
