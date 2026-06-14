import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireProfile } from '@/lib/auth/session';
import { getContact } from '@/lib/contacts/queries';
import { createClient } from '@/lib/supabase/server';
import { PrintButton } from '@/components/print-button';
import { fullName, ageFromDob, formatDate, humanPlan, humanStage } from '@/lib/format';

export default async function ContactPrintPage({ params }: { params: { id: string } }) {
  await requireProfile();
  const contact = await getContact(params.id);
  if (!contact) notFound();

  const supabase = createClient();
  const [{ data: notes }, { data: assignedProfile }] = await Promise.all([
    supabase
      .from('notes')
      .select('body, category, created_at')
      .eq('contact_id', contact.id)
      .order('created_at', { ascending: false })
      .limit(50),
    contact.assigned_to
      ? supabase.from('profiles').select('full_name, email').eq('id', contact.assigned_to).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const age = ageFromDob(contact.date_of_birth);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="no-print mb-4 flex justify-between">
        <Link href={`/contacts/${contact.id}`} className="text-sm text-brand-600 hover:underline">
          ← Back
        </Link>
        <PrintButton />
      </div>
      <h1 className="text-xl font-semibold">{fullName(contact)}</h1>
      <p className="text-sm text-slate-600">
        {contact.contact_type} · {humanStage(contact.stage)}
        {age != null && ` · Age ${age}`}
      </p>

      <section className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <h2 className="font-medium">Contact</h2>
          <p>{contact.primary_phone ?? '—'}</p>
          <p>{contact.email ?? '—'}</p>
        </div>
        <div>
          <h2 className="font-medium">Plan</h2>
          <p>{humanPlan(contact.plan_type)}</p>
          <p>{contact.carrier ?? '—'} · {contact.plan_name ?? '—'}</p>
          <p>Renewal: {formatDate(contact.renewal_date)}</p>
        </div>
        <div>
          <h2 className="font-medium">Assigned</h2>
          <p>{assignedProfile?.full_name ?? assignedProfile?.email ?? '—'}</p>
        </div>
        <div>
          <h2 className="font-medium">Follow-up</h2>
          <p>
            {formatDate(contact.follow_up_date)} · {contact.follow_up_status ?? '—'}
          </p>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-medium">Notes</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {(notes ?? []).map((n, i) => (
            <li key={i} className="border-b border-slate-100 pb-2">
              <div className="text-xs text-slate-500">
                {n.category ?? 'note'} · {new Date(n.created_at).toLocaleString()}
              </div>
              <div className="whitespace-pre-wrap">{n.body}</div>
            </li>
          ))}
          {(!notes || notes.length === 0) && <li className="text-slate-500">No notes.</li>}
        </ul>
      </section>
    </div>
  );
}
