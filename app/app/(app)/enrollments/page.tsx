import Link from 'next/link';
import { requireProfile } from '@/lib/auth/session';
import { listEnrollments } from '@/lib/enrollments/queries';
import { fullName, formatDate } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';
import { Pager } from '@/components/ui/pager';
import { EnrollmentForm } from './_components/enrollment-form';
import type { EnrollmentStatus } from '@/types/database.types';

interface PageProps {
  searchParams: { status?: string; page?: string };
}

export default async function EnrollmentsPage({ searchParams }: PageProps) {
  const profile = await requireProfile();
  const status = (searchParams.status as EnrollmentStatus | 'all' | undefined) ?? 'all';
  const page = searchParams.page ? Math.max(1, Number(searchParams.page)) : 1;
  const { rows, total, pageSize } = await listEnrollments({ status }, page);
  const buildHref = (p: number) => {
    const sp = new URLSearchParams();
    if (status && status !== 'all') sp.set('status', status);
    sp.set('page', String(p));
    return `/enrollments?${sp.toString()}`;
  };
  const supabase = createClient();
  const { data: contacts } = await supabase
    .from('contacts')
    .select('id, first_name, last_name, preferred_name')
    .order('last_name')
    .limit(500);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold text-slate-900">Enrollment activity</h1>
      <p className="mt-1 text-sm text-slate-500">Log enrollment workflows per contact.</p>

      {profile.role !== 'read_only' && (
        <div className="mt-6">
          <EnrollmentForm contacts={contacts ?? []} />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {(['all', 'started', 'in_progress', 'submitted', 'approved', 'declined', 'cancelled'] as const).map(
          (s) => (
            <Link
              key={s}
              href={s === 'all' ? '/enrollments' : `/enrollments?status=${s}`}
              className={
                status === s
                  ? 'rounded-md bg-brand-600 px-3 py-1 text-white'
                  : 'rounded-md border border-slate-300 px-3 py-1 text-slate-700 hover:bg-slate-50'
              }
            >
              {s.replace(/_/g, ' ')}
            </Link>
          ),
        )}
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2">Contact</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Started</th>
              <th className="px-4 py-2">External ref</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-2 font-medium">
                  <Link href={`/contacts/${r.contact_id}`} className="text-brand-600 hover:underline">
                    {r.contacts ? fullName(r.contacts) : r.contact_id.slice(0, 8)}
                  </Link>
                </td>
                <td className="px-4 py-2">{r.status.replace(/_/g, ' ')}</td>
                <td className="px-4 py-2">{formatDate(r.started_at.slice(0, 10))}</td>
                <td className="px-4 py-2 text-slate-600">{r.external_ref ?? '—'}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                  No enrollment records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pager page={page} total={total} pageSize={pageSize} buildHref={buildHref} />
    </div>
  );
}
