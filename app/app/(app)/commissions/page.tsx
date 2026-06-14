import Link from 'next/link';
import { requireProfile } from '@/lib/auth/session';
import { listCommissions } from '@/lib/commissions/queries';
import { listAgentsForAssignment } from '@/lib/contacts/queries';
import { fullName } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Pager } from '@/components/ui/pager';
import type { CommissionStatus } from '@/types/database.types';

interface PageProps {
  searchParams: { status?: string; page?: string };
}

export default async function CommissionsPage({ searchParams }: PageProps) {
  const profile = await requireProfile();
  const status = (searchParams.status as CommissionStatus | 'all' | undefined) ?? 'all';
  const page = searchParams.page ? Math.max(1, Number(searchParams.page)) : 1;
  const [{ rows, total, pageSize }, agents] = await Promise.all([
    listCommissions({ status }, page),
    listAgentsForAssignment(),
  ]);
  const agentLookup = new Map(agents.map((a) => [a.id, a.full_name ?? a.email]));

  const totalPending = rows.filter((r) => r.status === 'pending').reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const totalPaid = rows.filter((r) => r.status === 'paid').reduce((s, r) => s + (Number(r.amount) || 0), 0);

  const buildHref = (p: number) => {
    const sp = new URLSearchParams();
    if (status && status !== 'all') sp.set('status', status);
    sp.set('page', String(p));
    return `/commissions?${sp.toString()}`;
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Commissions</h1>
          <p className="mt-1 text-sm text-slate-500">
            Pending: ${totalPending.toFixed(2)} · Paid: ${totalPaid.toFixed(2)}
          </p>
        </div>
        {profile.role !== 'read_only' && (
          <Link href="/commissions/new">
            <Button>+ New commission</Button>
          </Link>
        )}
      </div>

      <div className="mt-4 flex gap-2 text-sm">
        {(['all', 'pending', 'paid', 'cancelled'] as const).map((s) => (
          <Link
            key={s}
            href={s === 'all' ? '/commissions' : `/commissions?status=${s}`}
            className={
              status === s
                ? 'rounded-md bg-brand-600 px-3 py-1 text-white'
                : 'rounded-md border border-slate-300 px-3 py-1 text-slate-700 hover:bg-slate-50'
            }
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2">Contact</th>
              <th className="px-4 py-2">Carrier</th>
              <th className="px-4 py-2">Writing agent</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-2">
                  <Link href={`/commissions/${r.id}`} className="font-medium text-brand-600 hover:underline">
                    {r.contacts ? fullName(r.contacts) : r.contact_id.slice(0, 8)}
                  </Link>
                </td>
                <td className="px-4 py-2 text-slate-600">{r.carrier ?? '—'}</td>
                <td className="px-4 py-2 text-slate-600">
                  {r.writing_agent_id ? agentLookup.get(r.writing_agent_id) ?? '—' : '—'}
                </td>
                <td className="px-4 py-2 text-slate-900">{r.amount != null ? `$${Number(r.amount).toFixed(2)}` : '—'}</td>
                <td className="px-4 py-2 text-slate-600 capitalize">{r.status}</td>
                <td className="px-4 py-2 text-slate-600">{r.payment_date ?? '—'}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                  No commissions yet.
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
