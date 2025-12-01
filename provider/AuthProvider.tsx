import { deleteUserAccount, getUserById } from "@/lib/api/users";
import { supabase } from "@/lib/supabase";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
};
export type SignUpInput = { email: string; password: string; username: string };
export type FieldErrors<T> = Partial<Record<keyof T, string>>;
export type AuthActionResult<E = unknown> =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: E };

type AuthContextType = {
  isAuthenticated: boolean;
  userId: string | null;
  profile: Profile | null;
  // loading flags
  loading: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
  lastError: string | null;
  // actions
  signIn: (email: string, password: string) => Promise<AuthActionResult>;
  signUp: (
    email: string,
    password: string,
    username: string
  ) => Promise<AuthActionResult<FieldErrors<SignUpInput>>>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<AuthActionResult>;
  refreshProfile: () => Promise<void>;
  deleteAccount: () => Promise<AuthActionResult>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userId: null,
  profile: null,
  loading: true,
  isSigningIn: false,
  isSigningUp: false,
  lastError: null,
  signIn: async () => ({ ok: false, error: "not implemented" }),
  signUp: async () => ({ ok: false, error: "not implemented" }),
  signOut: async () => {},
  requestPasswordReset: async () => ({ ok: false, error: "not implemented" }),
  refreshProfile: async () => {},
  deleteAccount: async () => ({ ok: false, error: "not implemented" }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const isAuthenticated = !!userId;
  const mounted = useRef(true);

  const fetchProfile = async (id: string) => {
    try {
      const userData = await getUserById(id);
      if (!mounted.current) return;
      setProfile(userData);
    } catch (err) {
      if (!mounted.current) return;
      console.error("Failed to fetch profile:", err);
      setLastError("Failed to fetch profile");
    }
  };

  useEffect(() => {
    mounted.current = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (session) {
        const id = session.user.id;
        setUserId(id);
        await fetchProfile(id);
      }
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted.current) return;
        if (session?.user?.id) {
          setUserId(session.user.id);
          await fetchProfile(session.user.id);
        } else {
          setUserId(null);
          setProfile(null);
        }
      }
    );

    return () => {
      mounted.current = false;
      sub?.subscription.unsubscribe();
    };
  }, []);

  const signIn: AuthContextType["signIn"] = async (email, password) => {
    setIsSigningIn(true);
    setLastError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error || !data.session) {
        const msg = error?.message || "Authentication failed";
        setLastError(msg);
        return { ok: false, error: msg };
      }
      const id = data.session.user.id;
      setUserId(id);
      await fetchProfile(id);
      return { ok: true };
    } catch (err: any) {
      const msg = err?.message || "Unknown error";
      setLastError(msg);
      return { ok: false, error: msg };
    } finally {
      setIsSigningIn(false);
    }
  };

  const signUp: AuthContextType["signUp"] = async (
    email,
    password,
    username
  ) => {
    setIsSigningUp(true);
    setLastError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const fieldErrors: FieldErrors<SignUpInput> = {};
    if (!email) fieldErrors.email = "Email is required";
    else if (!emailRegex.test(email))
      fieldErrors.email = "Invalid email address";
    if (!username) fieldErrors.username = "Username is required";
    else if (username.length < 3)
      fieldErrors.username = "Username must be at least 3 characters";
    if (!password) fieldErrors.password = "Password is required";
    else if (password.length < 6)
      fieldErrors.password = "Password must be at least 6 characters";

    if (Object.keys(fieldErrors).length) {
      setLastError("Validation failed");
      return { ok: false, error: "Validation failed", fieldErrors };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: "https://photospots.dev/en/confirmed",
        },
      });

      if (error) {
        const msg = error.message || "Registration failed";
        setLastError(msg);
        return { ok: false, error: msg };
      }

      return {
        ok: true,
        message:
          "Registration successful. Please check your email to confirm your account.",
      };
    } catch (err: any) {
      const msg = err?.message || "Unknown error";
      setLastError(msg);
      return { ok: false, error: msg };
    } finally {
      setIsSigningUp(false);
    }
  };

  const requestPasswordReset: AuthContextType["requestPasswordReset"] = async (
    email
  ) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message || "Unknown error" };
    }
  };

  const refreshProfile = async () => {
    if (userId) await fetchProfile(userId);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setProfile(null);
  };

  const deleteAccount: AuthContextType["deleteAccount"] = async () => {
    if (!userId) {
      return {
        ok: false,
        error: "You must be logged in to delete your account.",
      };
    }

    try {
      setLastError(null);

      await deleteUserAccount(userId);

      // wyloguj lokalnie i po stronie Supabase
      await supabase.auth.signOut();
      setUserId(null);
      setProfile(null);

      return { ok: true };
    } catch (err: any) {
      console.error("Failed to delete account:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete account. Please try again.";
      setLastError(msg);
      return { ok: false, error: msg };
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      userId,
      profile,
      loading,
      isSigningIn,
      isSigningUp,
      lastError,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
      refreshProfile,
      deleteAccount,
    }),
    [
      isAuthenticated,
      userId,
      profile,
      loading,
      isSigningIn,
      isSigningUp,
      lastError,
      deleteAccount,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
