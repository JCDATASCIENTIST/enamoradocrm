import type { Metadata } from 'next';
import { DM_Sans, Fraunces } from 'next/font/google';
import './globals.css';

const sans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://enamoradoinsurancecompany.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
