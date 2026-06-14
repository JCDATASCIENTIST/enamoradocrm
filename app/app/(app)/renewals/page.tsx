import Link from 'next/link';
import { requireProfile } from '@/lib/auth/session';
import { listRenewals, type RenewalBucket } from '@/lib/renewals/queries';
import { formatDate, humanPlan } from '@/lib/format';
import { renewalContactLabel } from '@/lib/renewals/queries';

interface PageProps {
  searchParams: { tab?: RenewalBucket };
}

const TABS: { value: RenewalBucket; label: string }[] = [
  { value: 'overdue', label: 'Overdue' },
  { value: 'due', label: 'Due (7 days)' },
  { value: 'upcoming', label: 'Upcoming (30 days)' },
];

export default async function RenewalsPage({ searchParams }: PageProps) {
  await requireProfile();
  const tab = (searchParams.tab as RenewalBucket | undefined) ?? 'due';
  const rows = await listRenewals(tab);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold text-slate-900">Renewals</h1>
      <p className="mt-1 text-sm text-slate-500">Client renewal dates from contact records.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.value}
            href={`/renewals?tab=${t.value}`}
            className={
              tab === t.value
                ? 'inline-flex min-h-[44px] items-center rounded-lg bg-accent-600 px-4 py-2 text-base font-semibold text-white shadow-sm transition-colors duration-200'
                : 'inline-flex min-h-[44px] items-center rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-700 transition-colors duration-200 hover:border-brand-200 hover:bg-surface-muted'
            }
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-base">
          <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Renewal date</th>
              <th className="px-4 py-3">Days</th>
              <th className="px-4 py-3">Carrier / Plan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id} className="transition-colors duration-200 hover:bg-surface-muted">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/contacts/${r.id}`} className="font-semibold text-brand-700 hover:underline">
                    {renewalContactLabel(r)}
                  </Link>
                </td>
                <td className="px-4 py-3">{formatDate(r.renewal_date)}</td>
                <td className="px-4 py-3">{r.days_until_renewal}d</td>
                <td className="px-4 py-3 text-slate-600">
                  {r.carrier ?? '—'} · {humanPlan(r.plan_type)}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                  No renewals in this bucket.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
