import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireProfile } from '@/lib/auth/session';
import { getCommission } from '@/lib/commissions/queries';
import { listAgentsForAssignment } from '@/lib/contacts/queries';
import { CommissionForm } from '../_components/commission-form';

export default async function CommissionDetailPage({ params }: { params: { id: string } }) {
  const profile = await requireProfile();
  const commission = await getCommission(params.id);
  if (!commission) notFound();

  const agents = await listAgentsForAssignment();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/commissions" className="text-sm text-brand-600 hover:underline">
        ← Commissions
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">Commission</h1>
      <p className="text-sm text-slate-500">
        <Link href={`/contacts/${commission.contact_id}`} className="text-brand-600 hover:underline">
          View contact
        </Link>
      </p>
      {profile.role !== 'read_only' ? (
        <CommissionForm commission={commission} contacts={[]} agents={agents} />
      ) : (
        <dl className="mt-6 space-y-2 text-sm">
          <div>
            <dt className="text-slate-500">Amount</dt>
            <dd>{commission.amount != null ? `$${Number(commission.amount).toFixed(2)}` : '—'}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Status</dt>
            <dd>{commission.status}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
