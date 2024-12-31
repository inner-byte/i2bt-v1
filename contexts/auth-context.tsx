'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (
    email: string,
    password: string,
    redirect?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    redirect?: string
  ) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState<Error | null>(null);

  const user = session?.user as User | null;
  const loading = status === 'loading';

  const login = useCallback(
    async (email: string, password: string, redirect = '/dashboard') => {
      try {
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        toast.success('Successfully logged in!');
        router.push(redirect);
      } catch (err) {
        setError(err as Error);
        toast.error(err instanceof Error ? err.message : 'Failed to login');
        throw err;
      }
    },
    [router]
  );

  const signup = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      redirect = '/login'
    ) => {
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, name }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to register');
        }

        toast.success('Registration successful! Please log in.');
        router.push(redirect);
      } catch (err) {
        setError(err as Error);
        toast.error(err instanceof Error ? err.message : 'Failed to register');
        throw err;
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await signOut({ redirect: false });
      toast.success('Successfully logged out!');
      router.push('/');
    } catch (err) {
      setError(err as Error);
      toast.error('Failed to logout');
      throw err;
    }
  }, [router]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      toast.success('Password reset email sent!');
    } catch (err) {
      setError(err as Error);
      toast.error(err instanceof Error ? err.message : 'Failed to reset password');
      throw err;
    }
  }, []);

  const updatePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        const response = await fetch('/api/auth/reset-password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to update password');
        }

        toast.success('Password updated successfully!');
      } catch (err) {
        setError(err as Error);
        toast.error(
          err instanceof Error ? err.message : 'Failed to update password'
        );
        throw err;
      }
    },
    []
  );

  // Clear error when route changes
  useEffect(() => {
    setError(null);
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        signup,
        resetPassword,
        updatePassword,
      }}
    >
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
