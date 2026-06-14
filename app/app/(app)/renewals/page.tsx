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

      <div className="mt-4 flex gap-2">
        {TABS.map((t) => (
          <Link
            key={t.value}
            href={`/renewals?tab=${t.value}`}
            className={
              tab === t.value
                ? 'rounded-md bg-brand-600 px-3 py-1.5 text-sm text-white'
                : 'rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50'
            }
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2">Client</th>
              <th className="px-4 py-2">Renewal date</th>
              <th className="px-4 py-2">Days</th>
              <th className="px-4 py-2">Carrier / Plan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-2 font-medium">
                  <Link href={`/contacts/${r.id}`} className="text-brand-600 hover:underline">
                    {renewalContactLabel(r)}
                  </Link>
                </td>
                <td className="px-4 py-2">{formatDate(r.renewal_date)}</td>
                <td className="px-4 py-2">{r.days_until_renewal}d</td>
                <td className="px-4 py-2 text-slate-600">
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
