'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useRef, useEffect } from 'react';
import { addNote, type NoteState } from '@/lib/notes/actions';
import { Button } from '@/components/ui/button';

const initial: NoteState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? 'Adding…' : 'Add note'}
    </Button>
  );
}

export function AddNoteForm({ contactId, canWrite }: { contactId: string; canWrite: boolean }) {
  const bound = addNote.bind(null, contactId);
  const [state, formAction] = useFormState(bound, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  // Reset textarea after a successful submit (no error returned).
  useEffect(() => {
    if (!state.error && textRef.current) textRef.current.value = '';
  }, [state]);

  if (!canWrite) {
    return (
      <div className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
        Read-only users cannot add notes.
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-2">
      <div className="rounded-md bg-amber-50 px-2 py-1 text-[11px] text-amber-800">
        Path B reminder: no SSNs, full Medicare/Medicaid IDs, or clinical/diagnosis details in notes.
      </div>
      <textarea
        ref={textRef}
        name="body"
        required
        rows={3}
        placeholder="What happened? Call summary, follow-up, concern…"
        className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
      <div className="flex items-center justify-between gap-2">
        <select
          name="category"
          defaultValue=""
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs"
        >
          <option value="">Category…</option>
          <option value="call">Call</option>
          <option value="email">Email</option>
          <option value="meeting">Meeting</option>
          <option value="concern">Concern</option>
          <option value="follow-up">Follow-up</option>
          <option value="other">Other</option>
        </select>
        <SubmitButton />
      </div>
      {state.error && <div className="rounded-md bg-red-50 px-2 py-1 text-xs text-red-700">{state.error}</div>}
    </form>
  );
}
