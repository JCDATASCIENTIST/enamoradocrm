import Link from 'next/link';
import { requireProfile } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { todayInAppTz, dateInAppTz } from '@/lib/format';

export default async function DashboardPage() {
  const profile = await requireProfile();
  const supabase = createClient();
  const today = todayInAppTz();
  const in7Str = dateInAppTz(7);

  const [
    { count: clientCount },
    { count: prospectCount },
    { count: followUpCount },
    { count: overdueRenewals },
    { count: pendingCommissions },
  ] = await Promise.all([
    supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('contact_type', 'client'),
    supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('contact_type', 'prospect'),
    supabase.from('follow_ups').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('contact_type', 'client')
      .not('renewal_date', 'is', null)
      .lt('renewal_date', today),
    supabase.from('commissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  const { count: dueRenewals } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('contact_type', 'client')
    .gte('renewal_date', today)
    .lte('renewal_date', in7Str);

  const cards = [
    { label: 'Clients', value: clientCount ?? 0, href: '/contacts?contact_type=client' },
    { label: 'Prospects', value: prospectCount ?? 0, href: '/contacts?contact_type=prospect' },
    { label: 'Pending follow-ups', value: followUpCount ?? 0, href: '/follow-ups' },
    { label: 'Renewals due (7d)', value: dueRenewals ?? 0, href: '/renewals?tab=due' },
    { label: 'Overdue renewals', value: overdueRenewals ?? 0, href: '/renewals?tab=overdue' },
    { label: 'Pending commissions', value: pendingCommissions ?? 0, href: '/commissions?status=pending' },
  ];

  const quickLinks = [
    { href: '/pipeline', label: 'Pipeline kanban' },
    { href: '/contacts', label: 'Clients & prospects' },
    { href: '/birthdays', label: 'Birthday report' },
    { href: '/commissions', label: 'Commissions' },
    { href: '/enrollments', label: 'Enrollments' },
  ];
  if (profile.role === 'admin') {
    quickLinks.push({ href: '/admin/users', label: 'Manage users' });
    quickLinks.push({ href: '/admin/audit', label: 'Audit log' });
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome back, {profile.full_name ?? profile.email}.
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {profile.role === 'admin'
            ? 'Admin view — full access to all records and settings.'
            : profile.role === 'agent'
              ? 'Agent view — edit contacts assigned to you or unassigned.'
              : 'Read-only view — browse all records.'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300"
          >
            <div className="text-xs uppercase tracking-wide text-slate-500">{card.label}</div>
            <div className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</div>
          </Link>
        ))}
      </div>

      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Quick links</h2>
        <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm text-brand-600 hover:underline">
                {link.label} →
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
