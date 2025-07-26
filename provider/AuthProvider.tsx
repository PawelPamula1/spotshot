import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

// typy contextu
type AuthContextType = {
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

// domyślny context
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  signIn: async () => {},
  signOut: async () => {},
  loading: true,
});

// hook do używania w komponentach
export const useAuth = () => useContext(AuthContext);

// provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const TOKEN_KEY = "auth_token";

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to load token", error);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  const signIn = async () => {
    // symulacja logowania – zapisz "fake_token"
    await AsyncStorage.setItem(TOKEN_KEY, "fake_token");
    setIsAuthenticated(true);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
