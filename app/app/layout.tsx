import type { Metadata } from 'next';
import { Figtree, Noto_Sans } from 'next/font/google';
import './globals.css';

const sans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const display = Figtree({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Enamorado Insurance CRM',
  description: 'Client and prospect management for Enamorado Insurance.',
  icons: { icon: '/enamorado-logo.jpg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
