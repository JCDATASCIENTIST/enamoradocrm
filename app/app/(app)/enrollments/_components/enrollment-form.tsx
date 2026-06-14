'use client';

import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { createEnrollment, type EnrollmentFormState } from '@/lib/enrollments/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { fullName } from '@/lib/format';

const initial: EnrollmentFormState = {};

interface ContactOption {
  id: string;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
}

export function EnrollmentForm({
  contactId,
  contacts = [],
}: {
  contactId?: string;
  contacts?: ContactOption[];
}) {
  const [state, formAction] = useFormState(createEnrollment, initial);

  useEffect(() => {
    if (!state.error && contactId) {
      const form = document.getElementById('enrollment-form') as HTMLFormElement | null;
      form?.reset();
    }
  }, [state, contactId]);

  return (
    <form
      id="enrollment-form"
      action={formAction}
      className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
    >
      <h2 className="text-sm font-semibold text-slate-800">Log enrollment</h2>
      {!contactId && (
        <label className="block text-sm">
          <span className="text-slate-600">Contact</span>
          <Select name="contact_id" required className="mt-1">
            <option value="">Select contact…</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {fullName(c)}
              </option>
            ))}
          </Select>
        </label>
      )}
      {contactId && <input type="hidden" name="contact_id" value={contactId} />}
      <label className="block text-sm">
        <span className="text-slate-600">Status</span>
        <Select name="status" defaultValue="started" className="mt-1">
          <option value="started">Started</option>
          <option value="in_progress">In progress</option>
          <option value="submitted">Submitted</option>
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-slate-600">External reference</span>
        <Input name="external_ref" className="mt-1" />
      </label>
      <label className="block text-sm">
        <span className="text-slate-600">Description</span>
        <textarea name="description" rows={2} className="mt-1 block w-full rounded-md border border-slate-300 px-2 py-1 text-sm" />
      </label>
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
      <Button type="submit" size="sm">
        Save
      </Button>
    </form>
  );
}
