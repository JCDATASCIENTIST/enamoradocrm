import { notFound } from 'next/navigation';
import { requireProfile } from '@/lib/auth/session';
import { getContact, listAgentsForAssignment } from '@/lib/contacts/queries';
import { updateContact } from '@/lib/contacts/actions';
import { ContactForm } from '../../_components/contact-form';

export default async function EditContactPage({ params }: { params: { id: string } }) {
  const profile = await requireProfile();
  if (profile.role === 'read_only') notFound();

  const contact = await getContact(params.id);
  if (!contact) notFound();

  const agents = await listAgentsForAssignment();
  // Bind the contact id into the server action.
  const boundUpdate = updateContact.bind(null, contact.id);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Edit {contact.first_name} {contact.last_name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">Changes are logged to the audit trail.</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <ContactForm
          action={boundUpdate}
          agents={agents}
          defaultValues={contact}
          submitLabel="Save changes"
          cancelHref={`/contacts/${contact.id}`}
        />
      </div>
    </div>
  );
}
