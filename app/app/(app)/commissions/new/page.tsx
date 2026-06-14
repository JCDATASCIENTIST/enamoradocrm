import Link from 'next/link';
import { requireProfile } from '@/lib/auth/session';
import { listAgentsForAssignment } from '@/lib/contacts/queries';
import { createClient } from '@/lib/supabase/server';
import { CommissionForm } from '../_components/commission-form';

interface PageProps {
  searchParams: { contact_id?: string };
}

export default async function NewCommissionPage({ searchParams }: PageProps) {
  await requireProfile();
  const agents = await listAgentsForAssignment();
  const supabase = createClient();
  const { data: contacts } = await supabase
    .from('contacts')
    .select('id, first_name, last_name, preferred_name')
    .order('last_name')
    .limit(500);

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/commissions" className="text-sm text-brand-600 hover:underline">
        ← Commissions
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">New commission</h1>
      <CommissionForm
        contacts={contacts ?? []}
        agents={agents}
        defaultContactId={searchParams.contact_id}
      />
    </div>
  );
}
