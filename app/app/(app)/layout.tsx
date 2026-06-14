import Link from 'next/link';
import Image from 'next/image';
import { requireProfile } from '@/lib/auth/session';
import { logout } from '@/lib/auth/actions';
import { MobileNav } from './_components/mobile-nav';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();

  const navItems: { href: string; label: string }[] = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/contacts', label: 'Clients & Prospects' },
    { href: '/pipeline', label: 'Pipeline' },
    { href: '/follow-ups', label: 'Follow-ups' },
    { href: '/birthdays', label: 'Birthdays' },
    { href: '/renewals', label: 'Renewals' },
    { href: '/commissions', label: 'Commissions' },
    { href: '/enrollments', label: 'Enrollments' },
  ];
  if (profile.role === 'admin') {
    navItems.push({ href: '/admin/users', label: 'Users' });
    navItems.push({ href: '/admin/audit', label: 'Audit Log' });
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="border-b border-slate-200 p-4">
          <Link href="/dashboard" className="block">
            <Image
              src="/enamorado-logo.jpg"
              alt="Enamorado Insurance"
              width={1417}
              height={1417}
              priority
              className="h-auto w-40"
            />
          </Link>
          <div className="mt-1 text-xs text-slate-500">Insurance CRM · Path B (no PHI)</div>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-3">
          <div className="mb-2 text-xs text-slate-500">
            Signed in as <span className="font-medium text-slate-700">{profile.full_name ?? profile.email}</span>
            <div className="text-[10px] uppercase tracking-wide text-slate-400">{profile.role}</div>
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
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileNav
          navItems={navItems}
          userLabel={profile.full_name ?? profile.email}
          role={profile.role}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
