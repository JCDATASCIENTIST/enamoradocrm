'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
        active
          ? 'bg-brand-50 text-brand-800 ring-1 ring-brand-200'
          : 'text-slate-700 hover:bg-slate-100 hover:text-brand-800',
      )}
    >
      {label}
    </Link>
  );
}
