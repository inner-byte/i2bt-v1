'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        setLoading(true);
        // Add your authentication check logic here
        // For now, we'll just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Add your login logic here
      // For now, we'll just simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: '1',
        name: 'Test User',
        email: email,
      });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // Add your logout logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      // Add your signup logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: '1',
        name: name,
        email: email,
      });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
