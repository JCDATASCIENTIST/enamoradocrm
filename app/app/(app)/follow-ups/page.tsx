import Link from 'next/link';
import { requireProfile } from '@/lib/auth/session';
import { getPendingFollowUps } from '@/lib/follow-ups/queries';
import { fullName, formatDate, ageFromDob, humanStage } from '@/lib/format';
import { FollowUpRowActions } from './_components/row-actions';
import type { Contact } from '@/types/database.types';

interface PageProps {
  searchParams: { assigned?: string };
}

export default async function FollowUpsPage({ searchParams }: PageProps) {
  const profile = await requireProfile();
  const showOnlyMine = searchParams.assigned === 'me';
  const canWrite = profile.role !== 'read_only';

  const buckets = await getPendingFollowUps({
    assignedTo: showOnlyMine ? 'me' : 'all',
    currentUserId: profile.id,
  });

  const total = buckets.overdue.length + buckets.today.length + buckets.thisWeek.length + buckets.later.length;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Follow-ups</h1>
          <p className="mt-1 text-sm text-slate-500">
            {total} pending · {buckets.overdue.length} overdue · {buckets.today.length} today
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <Link
            href="/follow-ups"
            className={
              !showOnlyMine
                ? 'rounded-md bg-brand-600 px-3 py-1.5 text-white'
                : 'rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-50'
            }
          >
            All
          </Link>
          <Link
            href="/follow-ups?assigned=me"
            className={
              showOnlyMine
                ? 'rounded-md bg-brand-600 px-3 py-1.5 text-white'
                : 'rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-50'
            }
          >
            Assigned to me
          </Link>
        </div>
      </div>

      <Bucket title="Overdue" tone="red" rows={buckets.overdue} canWrite={canWrite} />
      <Bucket title="Today" tone="amber" rows={buckets.today} canWrite={canWrite} />
      <Bucket title="This week" tone="blue" rows={buckets.thisWeek} canWrite={canWrite} />
      <Bucket title="Later" tone="slate" rows={buckets.later} canWrite={canWrite} />

      {total === 0 && (
        <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          No pending follow-ups. You're all caught up.
        </div>
      )}
    </div>
  );
}

const TONE_CLASSES: Record<string, string> = {
  red: 'bg-red-50 text-red-700 border-red-200',
  amber: 'bg-amber-50 text-amber-800 border-amber-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  slate: 'bg-slate-50 text-slate-700 border-slate-200',
};

function Bucket({
  title,
  tone,
  rows,
  canWrite,
}: {
  title: string;
  tone: 'red' | 'amber' | 'blue' | 'slate';
  rows: Contact[];
  canWrite: boolean;
}) {
  if (rows.length === 0) return null;
  return (
    <section className="mt-6">
      <div className="mb-2 flex items-center gap-2">
        <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${TONE_CLASSES[tone]}`}>
          {title}
        </span>
        <span className="text-xs text-slate-500">{rows.length}</span>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Due</th>
              <th className="px-4 py-2">Stage</th>
              <th className="px-4 py-2">Age</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-2 font-medium text-slate-900">
                  <Link href={`/contacts/${c.id}`} className="hover:underline">
                    {fullName(c)}
                  </Link>
                </td>
                <td className="px-4 py-2 text-slate-600">{formatDate(c.follow_up_date)}</td>
                <td className="px-4 py-2 text-slate-600">{humanStage(c.stage)}</td>
                <td className="px-4 py-2 text-slate-600">{ageFromDob(c.date_of_birth) ?? '—'}</td>
                <td className="px-4 py-2 text-slate-600">{c.primary_phone ?? '—'}</td>
                <td className="px-4 py-2 text-right">
                  <FollowUpRowActions contactId={c.id} canWrite={canWrite} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
