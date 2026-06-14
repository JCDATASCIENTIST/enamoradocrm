'use client';

import { useTransition } from 'react';
import { markFollowUpComplete, markFollowUpSkipped, snoozeFollowUp } from '@/lib/follow-ups/actions';

export function FollowUpRowActions({ contactId, canWrite }: { contactId: string; canWrite: boolean }) {
  const [pending, startTransition] = useTransition();
  if (!canWrite) return <span className="text-xs text-slate-400">read-only</span>;

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => markFollowUpComplete(contactId))}
        className="rounded-md bg-green-50 px-2 py-1 text-green-700 hover:bg-green-100 disabled:opacity-50"
      >
        ✓ Complete
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => markFollowUpSkipped(contactId))}
        className="rounded-md bg-slate-100 px-2 py-1 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
      >
        Skip
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => snoozeFollowUp(contactId, 1))}
        className="rounded-md border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        +1d
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => snoozeFollowUp(contactId, 7))}
        className="rounded-md border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        +1w
      </button>
    </div>
  );
}
