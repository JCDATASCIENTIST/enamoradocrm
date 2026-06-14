import Link from 'next/link';
import { requireProfile } from '@/lib/auth/session';
import { getBirthdays, type BirthdayMode } from '@/lib/birthdays/queries';
import { fullName, formatDate, humanPlan } from '@/lib/format';
import { MonthPicker } from './_components/month-picker';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface PageProps {
  searchParams: { mode?: BirthdayMode; month?: string };
}

export default async function BirthdaysPage({ searchParams }: PageProps) {
  await requireProfile();

  const mode: BirthdayMode = (searchParams.mode as BirthdayMode | undefined) ?? 'this_week';
  const month = searchParams.month ? Math.max(1, Math.min(12, Number(searchParams.month))) : undefined;

  const rows = await getBirthdays({ mode, month });

  const modes: { value: BirthdayMode; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'this_week', label: 'This week' },
    { value: 'this_month', label: 'This month' },
    { value: 'month', label: 'Pick a month' },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Birthday report</h1>
          <p className="mt-1 text-sm text-slate-500">
            {rows.length} {rows.length === 1 ? 'contact' : 'contacts'} ·{' '}
            {mode === 'month' && month ? MONTHS[month - 1] : modes.find((m) => m.value === mode)?.label}
          </p>
        </div>
        <div className="flex gap-4">
          <a
            href={`/birthdays/print?mode=${mode}${month ? `&month=${month}` : ''}`}
            className="text-sm text-brand-600 hover:underline"
          >
            Print →
          </a>
          <a
            href={`/api/birthdays/export.csv?mode=${mode}${month ? `&month=${month}` : ''}`}
            className="text-sm text-brand-600 hover:underline"
          >
            Export CSV →
          </a>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {modes.map((m) => {
          const active = m.value === mode;
          const href =
            m.value === 'month'
              ? (`/birthdays?mode=month&month=${month ?? new Date().getMonth() + 1}` as const)
              : (`/birthdays?mode=${m.value}` as const);
          return (
            <Link
              key={m.value}
              href={href as `/birthdays?mode=${string}`}
              className={
                active
                  ? 'rounded-md bg-brand-600 px-3 py-1.5 text-sm text-white'
                  : 'rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50'
              }
            >
              {m.label}
            </Link>
          );
        })}
        {mode === 'month' && <MonthPicker currentMonth={month ?? new Date().getMonth() + 1} />}
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Upcoming birthday</th>
              <th className="px-4 py-2">Turning</th>
              <th className="px-4 py-2">Days</th>
              <th className="px-4 py-2">Plan</th>
              <th className="px-4 py-2">Phone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-2 font-medium text-slate-900">
                  <Link href={`/contacts/${r.id}`} className="hover:underline">
                    {fullName(r)}
                  </Link>
                </td>
                <td className="px-4 py-2 text-slate-700">{formatDate(r.upcoming_birthday)}</td>
                <td className="px-4 py-2 text-slate-700">{r.turning_age ?? '—'}</td>
                <td className="px-4 py-2 text-slate-600">{r.days_until === 0 ? 'today' : `+${r.days_until}d`}</td>
                <td className="px-4 py-2 text-slate-600">{humanPlan(r.plan_type)}</td>
                <td className="px-4 py-2 text-slate-600">{r.primary_phone ?? '—'}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                  No birthdays match this view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
