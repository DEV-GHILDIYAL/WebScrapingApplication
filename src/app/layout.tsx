import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'ScrapeFlow — Enterprise Web Scraping Platform',
    template: '%s | ScrapeFlow',
  },
  description:
    'Configure, schedule, and manage web scraping jobs through an intuitive UI. No code required. Built for teams that need reliable, scalable data extraction.',
  keywords: [
    'web scraping',
    'data extraction',
    'scraping platform',
    'SaaS',
    'enterprise',
    'no-code scraping',
  ],
  authors: [{ name: 'ScrapeFlow' }],
  openGraph: {
    title: 'ScrapeFlow — Enterprise Web Scraping Platform',
    description:
      'Configure, schedule, and manage web scraping jobs. No code required.',
    type: 'website',
    locale: 'en_US',
    siteName: 'ScrapeFlow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScrapeFlow — Enterprise Web Scraping Platform',
    description:
      'Configure, schedule, and manage web scraping jobs. No code required.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
