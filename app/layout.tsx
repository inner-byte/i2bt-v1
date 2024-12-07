import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/auth-context';
import { Header } from '@/components/sections/header';
import { BottomNav } from '@/components/ui/bottom-nav';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: 'I2BT',
  description: 'Your project description',
  manifest: '/manifest.json',
  themeColor: '#ffffff',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <div className="relative">
              <Header />
              <main className="min-h-screen pt-16 pb-20 md:pb-0">
                {children}
              </main>
              <BottomNav />
              <Toaster
                position="bottom-center"
                toastOptions={{
                  className: 'bg-white dark:bg-gray-800 dark:text-white',
                  duration: 3000,
                }}
              />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
