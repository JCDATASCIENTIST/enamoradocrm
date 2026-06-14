import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Enamorado Insurance CRM',
  description: 'Client and prospect management for Enamorado Insurance.',
  icons: { icon: '/enamorado-logo.jpg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
