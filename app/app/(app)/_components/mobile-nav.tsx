'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { logout } from '@/lib/auth/actions';

interface NavItem {
  href: string;
  label: string;
}

// Top bar + slide-down menu shown only below the `md` breakpoint, so agents on
// phones can navigate and sign out (the desktop sidebar is hidden on mobile).
export function MobileNav({
  navItems,
  userLabel,
  role,
}: {
  navItems: NavItem[];
  userLabel: string;
  role: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 bg-white md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center">
          <Image
            src="/enamorado-logo.jpg"
            alt="Enamorado Insurance"
            width={1417}
            height={1417}
            priority
            className="h-11 w-auto"
          />
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100"
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <nav className="space-y-1 px-2 pb-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-base text-slate-700 transition-colors duration-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-600/30"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-slate-200 px-3 pt-3">
            <div className="mb-2 text-xs text-slate-500">
              Signed in as <span className="font-medium text-slate-700">{userLabel}</span>
              <div className="text-[10px] uppercase tracking-wide text-slate-400">{role}</div>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="w-full rounded-md px-3 py-1.5 text-left text-sm text-slate-600 hover:bg-slate-100"
              >
                Sign out
              </button>
            </form>
          </div>
        </nav>
      )}
    </div>
  );
}
