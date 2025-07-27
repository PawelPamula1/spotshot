import { supabase } from "@/lib/supabase";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
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
  signIn: async () => ({ error: undefined }),
  signUp: async () => ({ error: undefined }),
  signOut: async () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
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

      setIsAuthenticated(true);
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

      setIsAuthenticated(true);
      return { error: undefined };
    } catch (err: any) {
      return { error: err.message || "Unknown error" };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, signIn, signUp, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
