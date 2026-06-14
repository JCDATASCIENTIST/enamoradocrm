'use client';

import { useTransition } from 'react';
import { transitionStage, promoteToClient } from '@/lib/contacts/actions';
import { Button } from '@/components/ui/button';
import type { PipelineStage } from '@/types/database.types';

const STAGES: { value: PipelineStage; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'requested', label: 'Requested' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export function StageControls({
  contactId,
  currentStage,
  isClient,
  canWrite,
}: {
  contactId: string;
  currentStage: PipelineStage;
  isClient: boolean;
  canWrite: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function handleStage(to: PipelineStage) {
    if (to === currentStage) return;
    startTransition(() => transitionStage(contactId, to));
  }
  function handlePromote() {
    startTransition(() => promoteToClient(contactId));
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {STAGES.map((s) => (
        <button
          key={s.value}
          type="button"
          disabled={!canWrite || pending || s.value === currentStage}
          onClick={() => handleStage(s.value)}
          className={
            s.value === currentStage
              ? 'rounded-md bg-brand-600 px-3 py-1 text-xs font-medium text-white'
              : 'rounded-md border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50'
          }
        >
          {s.label}
        </button>
      ))}
      {!isClient && canWrite && (
        <Button size="sm" variant="secondary" onClick={handlePromote} disabled={pending}>
          Promote to client
        </Button>
      )}
    </div>
  );
}
