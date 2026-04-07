import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/hooks/useAuth';
import { ToastProvider } from '@/components/ui';
import { AnalyticsTracker } from '@/components/layout/AnalyticsTracker';
import { Suspense } from 'react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ScrapeFlow | Enterprise Web Scraping SaaS',
  description: 'Scalable, professional web scraping for high-growth teams.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased text-slate-900 bg-white">
        <ToastProvider>
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
