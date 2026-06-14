import Link from 'next/link';
import { requireProfile } from '@/lib/auth/session';
import { getBirthdays, type BirthdayMode } from '@/lib/birthdays/queries';
import { PrintButton } from '@/components/print-button';
import { fullName, formatDate, humanPlan } from '@/lib/format';

interface PageProps {
  searchParams: { mode?: BirthdayMode; month?: string };
}

export default async function BirthdaysPrintPage({ searchParams }: PageProps) {
  await requireProfile();
  const mode: BirthdayMode = (searchParams.mode as BirthdayMode | undefined) ?? 'this_week';
  const month = searchParams.month ? Math.max(1, Math.min(12, Number(searchParams.month))) : undefined;
  const rows = await getBirthdays({ mode, month });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="no-print mb-4 flex justify-between">
        <Link href={`/birthdays?mode=${mode}${month ? `&month=${month}` : ''}`} className="text-sm text-brand-600 hover:underline">
          ← Back
        </Link>
        <PrintButton />
      </div>
      <h1 className="text-xl font-semibold">Birthday report</h1>
      <p className="text-sm text-slate-500">{rows.length} contacts · Printed {new Date().toLocaleString()}</p>
      <table className="mt-4 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-300 text-left text-xs uppercase text-slate-500">
            <th className="py-1 pr-2">Name</th>
            <th className="py-1 pr-2">Upcoming</th>
            <th className="py-1 pr-2">Turning</th>
            <th className="py-1 pr-2">Days</th>
            <th className="py-1 pr-2">Plan</th>
            <th className="py-1">Phone</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-slate-100">
              <td className="py-1 pr-2">{fullName(r)}</td>
              <td className="py-1 pr-2">{formatDate(r.upcoming_birthday)}</td>
              <td className="py-1 pr-2">{r.turning_age ?? '—'}</td>
              <td className="py-1 pr-2">{r.days_until === 0 ? 'today' : `+${r.days_until}d`}</td>
              <td className="py-1 pr-2">{humanPlan(r.plan_type)}</td>
              <td className="py-1">{r.primary_phone ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
