'use client';

import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { SessionProvider } from 'next-auth/react';
import { Providers } from './providers';
import { Header } from '@/components/sections/header';
import { BottomNav } from '@/components/ui/bottom-nav';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <SessionProvider>
          <ThemeProvider>
            <Providers>
              <div className="relative">
                <Header />
                <main className="min-h-screen pt-16 pb-20 md:pb-0">
                  {children}
                </main>
                <BottomNav />
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    duration: 5000,
                    style: {
                      background: 'var(--background)',
                      color: 'var(--foreground)',
                      border: '1px solid var(--accent)',
                    },
                  }}
                />
              </div>
            </Providers>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
