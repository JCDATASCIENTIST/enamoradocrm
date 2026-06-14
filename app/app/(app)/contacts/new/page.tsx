import { notFound } from 'next/navigation';
import { requireProfile } from '@/lib/auth/session';
import { listAgentsForAssignment } from '@/lib/contacts/queries';
import { createContact } from '@/lib/contacts/actions';
import { ContactForm } from '../_components/contact-form';

export default async function NewContactPage() {
  const profile = await requireProfile();
  if (profile.role === 'read_only') notFound();
  const agents = await listAgentsForAssignment();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">New contact</h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a new prospect or client. Required fields are marked with *.
        </p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <ContactForm
          action={createContact}
          agents={agents}
          submitLabel="Create contact"
          cancelHref="/contacts"
        />
      </div>
    </div>
  );
}
