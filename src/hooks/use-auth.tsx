
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { User } from "firebase/auth"; // We can still use the type for structure
import { usePathname, useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => void;
  signIn: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FAKE_USER_KEY = 'fake_user_for_demo';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { push } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(FAKE_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(FAKE_USER_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loading) return;

    const publicPaths = ['/login', '/register', '/'];
    const isPublicPath = publicPaths.includes(pathname);
    
    if (!user && !isPublicPath) {
      push('/login');
    } else if (user && isPublicPath && pathname !== '/') {
        push('/dashboard')
    }
  }, [user, loading, pathname, push]);

  const signOut = useCallback(() => {
    localStorage.removeItem(FAKE_USER_KEY);
    setUser(null);
    push('/login');
  }, [push]);
  
  const signIn = useCallback((newUser: User) => {
    localStorage.setItem(FAKE_USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
    push('/dashboard');
  }, [push]);

  const value = { user, loading, signOut, signIn };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
