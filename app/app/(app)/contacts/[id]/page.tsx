import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireProfile } from '@/lib/auth/session';
import { getContact } from '@/lib/contacts/queries';
import { listEnrollmentsForContact } from '@/lib/enrollments/queries';
import { listCommissionsForContact } from '@/lib/commissions/queries';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { fullName, ageFromDob, formatDate, humanPlan, humanStage } from '@/lib/format';
import { GENDERS, labelFor } from '@/lib/constants';
import { AddNoteForm } from './_components/notes-panel';
import { NoteRow } from './_components/note-row';
import { StageControls } from './_components/stage-controls';
import { DeleteContactButton } from './_components/delete-contact-button';
import { EnrollmentForm } from '../../enrollments/_components/enrollment-form';
import { PrintButton } from '@/components/print-button';

export default async function ContactDetailPage({ params }: { params: { id: string } }) {
  const profile = await requireProfile();
  const contact = await getContact(params.id);
  if (!contact) notFound();

  const supabase = createClient();
  const noteAuthorIds = new Set<string>();

  const [{ data: notes }, { data: history }, { data: assignedProfile }, enrollments, commissions] =
    await Promise.all([
      supabase
        .from('notes')
        .select('id, body, category, created_at, created_by')
        .eq('contact_id', contact.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('pipeline_history')
        .select('id, from_stage, to_stage, changed_at, note')
        .eq('contact_id', contact.id)
        .order('changed_at', { ascending: false })
        .limit(20),
      contact.assigned_to
        ? supabase.from('profiles').select('full_name, email').eq('id', contact.assigned_to).maybeSingle()
        : Promise.resolve({ data: null }),
      listEnrollmentsForContact(contact.id),
      listCommissionsForContact(contact.id),
    ]);

  for (const n of notes ?? []) {
    if (n.created_by) noteAuthorIds.add(n.created_by);
  }
  const { data: noteAuthors } =
    noteAuthorIds.size > 0
      ? await supabase.from('profiles').select('id, full_name, email').in('id', [...noteAuthorIds])
      : { data: [] };
  const authorLookup = new Map(
    (noteAuthors ?? []).map((p) => [p.id, p.full_name ?? p.email]),
  );

  const canWrite = profile.role !== 'read_only';
  const isAdmin = profile.role === 'admin';
  const age = ageFromDob(contact.date_of_birth);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-2 text-sm text-slate-500">
        <Link href="/contacts" className="hover:underline">
          ← All contacts
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-slate-900">{fullName(contact)}</h1>
            <span
              className={
                contact.contact_type === 'client'
                  ? 'inline-flex rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700'
                  : 'inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700'
              }
            >
              {contact.contact_type}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {age != null && <>Age {age} · </>}
            {humanPlan(contact.plan_type)} · Stage: {humanStage(contact.stage)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/contacts/${contact.id}/print`}>
            <PrintButton label="Print" />
          </Link>
          {canWrite && (
            <Link href={`/contacts/${contact.id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
          )}
          {isAdmin && <DeleteContactButton contactId={contact.id} />}
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Pipeline</h2>
        <StageControls
          contactId={contact.id}
          currentStage={contact.stage}
          isClient={contact.contact_type === 'client'}
          canWrite={canWrite}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title="Demographic">
          <Pair label="Preferred name" value={contact.preferred_name} />
          <Pair label="Date of birth" value={formatDate(contact.date_of_birth)} />
          <Pair label="Gender" value={labelFor(GENDERS, contact.gender)} />
          <Pair label="Language" value={contact.language_preference} />
        </Card>

        <Card title="Contact">
          <Pair label="Primary phone" value={contact.primary_phone} />
          <Pair label="Secondary phone" value={contact.secondary_phone} />
          <Pair label="Email" value={contact.email} />
          <Pair label="Preferred method" value={contact.preferred_contact_method} />
          <Pair
            label="Address"
            value={
              [contact.address_line_1, contact.address_line_2, contact.city, contact.state, contact.zip]
                .filter(Boolean)
                .join(', ') || null
            }
          />
        </Card>

        <Card title="Plan & Insurance">
          <Pair label="Carrier" value={contact.carrier} />
          <Pair label="Plan name" value={contact.plan_name} />
          <Pair label="Plan type" value={humanPlan(contact.plan_type)} />
          <Pair label="Medicaid level" value={contact.medicaid_level} />
          <Pair label="Effective date" value={formatDate(contact.effective_date)} />
          <Pair label="Renewal date" value={formatDate(contact.renewal_date)} />
          <Pair label="Member ID (last 4)" value={contact.member_id_last4} />
        </Card>

        <Card title="Assignment & Follow-up">
          <Pair
            label="Assigned to"
            value={assignedProfile?.full_name ?? assignedProfile?.email ?? null}
          />
          <Pair label="Follow-up date" value={formatDate(contact.follow_up_date)} />
          <Pair label="Follow-up status" value={contact.follow_up_status} />
        </Card>

        <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Notes & Activity</h2>
          <AddNoteForm contactId={contact.id} canWrite={canWrite} />
          <div className="mt-4 divide-y divide-slate-100">
            {(notes ?? []).map((n) => (
              <NoteRow
                key={n.id}
                note={n}
                contactId={contact.id}
                authorName={n.created_by ? authorLookup.get(n.created_by) ?? null : null}
                isAdmin={isAdmin}
              />
            ))}
            {(!notes || notes.length === 0) && (
              <div className="py-6 text-center text-sm text-slate-500">No notes yet.</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">
              Enrollments
              {enrollments.total > 0 && (
                <span className="ml-2 text-xs font-normal text-slate-500">
                  {enrollments.total}
                  {enrollments.total > enrollments.rows.length &&
                    ` (showing ${enrollments.rows.length})`}
                </span>
              )}
            </h2>
            {enrollments.total > enrollments.rows.length && (
              <Link href="/enrollments" className="text-xs text-brand-600 hover:underline">
                See all →
              </Link>
            )}
          </div>
          {enrollments.rows.length === 0 ? (
            <p className="text-sm text-slate-500">No enrollments logged yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {enrollments.rows.map((e) => (
                <li key={e.id} className="py-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize text-slate-800">
                      {e.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatDate(e.started_at.slice(0, 10))}
                      {e.completed_at && ` · done`}
                    </span>
                  </div>
                  {e.external_ref && (
                    <div className="text-xs text-slate-500">Ref: {e.external_ref}</div>
                  )}
                  {e.description && (
                    <div className="mt-0.5 whitespace-pre-wrap text-slate-600">{e.description}</div>
                  )}
                </li>
              ))}
            </ul>
          )}
          {canWrite && (
            <div className="mt-4 border-t border-slate-100 pt-3">
              <EnrollmentForm contactId={contact.id} contacts={[]} />
            </div>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">
              Commissions
              {commissions.total > 0 && (
                <span className="ml-2 text-xs font-normal text-slate-500">
                  {commissions.total}
                  {commissions.total > commissions.rows.length &&
                    ` (showing ${commissions.rows.length})`}
                </span>
              )}
            </h2>
            <div className="flex items-center gap-3">
              {commissions.total > commissions.rows.length && (
                <Link href="/commissions" className="text-xs text-brand-600 hover:underline">
                  See all →
                </Link>
              )}
              {canWrite && (
                <Link
                  href={`/commissions/new?contact_id=${contact.id}`}
                  className="text-xs text-brand-600 hover:underline"
                >
                  + New
                </Link>
              )}
            </div>
          </div>
          {commissions.rows.length === 0 ? (
            <p className="text-sm text-slate-500">No commissions logged yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {commissions.rows.map((c) => (
                <li key={c.id} className="py-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">
                      {c.carrier ?? '—'} · <span className="capitalize">{c.status}</span>
                    </span>
                    <span className="text-slate-700">
                      {c.amount != null ? `$${Number(c.amount).toFixed(2)}` : '—'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatDate(c.payment_date ?? c.created_at.slice(0, 10))}
                    {c.policy_number && ` · ${c.policy_number}`}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Stage history</h2>
        <ol className="space-y-2 text-sm">
          {(history ?? []).map((h) => (
            <li key={h.id} className="flex items-center justify-between">
              <span className="text-slate-700">
                {h.from_stage ? humanStage(h.from_stage) : '—'} → {humanStage(h.to_stage)}
              </span>
              <span className="text-xs text-slate-500">{new Date(h.changed_at).toLocaleString()}</span>
            </li>
          ))}
          {(!history || history.length === 0) && (
            <li className="text-slate-500">No stage transitions yet.</li>
          )}
        </ol>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-700">{title}</h2>
      <dl className="space-y-2 text-sm">{children}</dl>
    </div>
  );
}

function Pair({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right text-slate-900">{value || '—'}</dd>
    </div>
  );
}
