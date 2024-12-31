'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        toast.error('Invalid verification link');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setIsVerified(true);
        toast.success('Email verified successfully');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Verification failed');
      } finally {
        setIsLoading(false);
      }
    }

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md space-y-8 glass-effect p-8 rounded-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {isLoading ? (
            <div className="space-y-4">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              <h2 className="text-xl font-semibold">Verifying your email...</h2>
              <p className="text-muted-foreground">Please wait while we verify your email address.</p>
            </div>
          ) : isVerified ? (
            <div className="space-y-4">
              <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold text-green-700">Email Verified!</h2>
              <p className="text-muted-foreground">
                Your email has been verified successfully. Redirecting to login...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-semibold text-red-700">Verification Failed</h2>
              <p className="text-muted-foreground">
                We couldn&apos;t verify your email. The link may be invalid or expired.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Back to Login
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
