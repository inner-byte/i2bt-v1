import type { Metadata } from 'next';
import '@/app/globals.css';
import RootLayoutClient from './layout-client';

export const metadata: Metadata = {
  title: 'Computer Science Student Organization',
  description: 'A platform for computer science students to connect, learn, and grow together.',
  keywords: [
    'computer science',
    'students',
    'organization',
    'learning',
    'community',
    'coding',
    'programming',
    'education',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}
