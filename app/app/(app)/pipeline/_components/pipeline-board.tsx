'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition, useState } from 'react';
import { transitionStage } from '@/lib/contacts/actions';
import { fullName, humanPlan } from '@/lib/format';
import type { PipelineCard } from '@/lib/contacts/queries';
import type { PipelineStage } from '@/types/database.types';

const STAGES: { value: PipelineStage; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'requested', label: 'Requested' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export function PipelineBoard({
  cards,
  agentNames,
  canWrite,
  userId,
  isAdmin,
  todayInAppTz,
}: {
  cards: PipelineCard[];
  agentNames: Record<string, string>;
  canWrite: boolean;
  userId: string;
  isAdmin: boolean;
  /** Pre-computed YYYY-MM-DD "today" in APP_TZ (matches the follow-ups page). */
  todayInAppTz: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [dragId, setDragId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function canMoveCard(card: PipelineCard): boolean {
    if (!canWrite) return false;
    if (isAdmin) return true;
    return card.assigned_to === null || card.assigned_to === userId;
  }

  function handleDrop(toStage: PipelineStage, contactId: string) {
    const card = cards.find((c) => c.id === contactId);
    if (!card || card.stage === toStage || !canMoveCard(card)) return;
    startTransition(async () => {
      setError(null);
      try {
        await transitionStage(contactId, toStage);
      } catch (e) {
        setError((e as Error).message ?? 'Could not move card.');
      } finally {
        router.refresh();
      }
    });
  }

  const byStage = STAGES.reduce(
    (acc, s) => {
      acc[s.value] = cards.filter((c) => c.stage === s.value);
      return acc;
    },
    {} as Record<PipelineStage, PipelineCard[]>,
  );

  const today = todayInAppTz;

  return (
    <>
    {error && (
      <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
    )}
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-4 ${pending ? 'opacity-70' : ''}`}>
      {STAGES.map((col) => (
        <div
          key={col.value}
          className="flex min-h-[12rem] flex-col rounded-xl border border-slate-200 bg-surface-muted"
          onDragOver={(e) => {
            if (canWrite) e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/contact-id') || dragId;
            if (id) handleDrop(col.value, id);
            setDragId(null);
          }}
        >
          <div className="border-b border-slate-200 bg-white px-3 py-3">
            <div className="text-base font-semibold text-brand-900">{col.label}</div>
            <div className="text-sm text-slate-500">{byStage[col.value].length} contacts</div>
          </div>
          <div className="flex-1 space-y-2 p-2">
            {byStage[col.value].map((card) => {
              const movable = canMoveCard(card);
              const overdue =
                card.follow_up_status === 'pending' &&
                card.follow_up_date &&
                card.follow_up_date < today;
              return (
                <div
                  key={card.id}
                  draggable={movable && !pending}
                  onDragStart={(e) => {
                    if (!movable) return;
                    e.dataTransfer.setData('text/contact-id', card.id);
                    setDragId(card.id);
                  }}
                  onDragEnd={() => setDragId(null)}
                  className={
                    movable
                      ? 'cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-shadow duration-200 hover:shadow-md active:cursor-grabbing'
                      : 'rounded-lg border border-slate-200 bg-white p-3 shadow-sm opacity-90'
                  }
                >
                  <Link href={`/contacts/${card.id}`} className="block text-base font-semibold text-brand-900 hover:text-brand-700 hover:underline">
                    {fullName(card)}
                  </Link>
                  <div className="mt-1 text-xs text-slate-500">{humanPlan(card.plan_type)}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span
                      className={
                        card.contact_type === 'client'
                          ? 'rounded bg-green-50 px-1.5 py-0.5 text-[10px] text-green-700'
                          : 'rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-700'
                      }
                    >
                      {card.contact_type}
                    </span>
                    {overdue && (
                      <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] text-red-700">Overdue</span>
                    )}
                  </div>
                  {card.assigned_to && (
                    <div className="mt-1 text-[10px] text-slate-400">
                      {agentNames[card.assigned_to] ?? 'Assigned'}
                    </div>
                  )}
                  {movable && canWrite && (
                    <div className="mt-2 flex flex-wrap gap-1 border-t border-slate-100 pt-2">
                      {STAGES.filter((s) => s.value !== card.stage).map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          disabled={pending}
                          onClick={() => handleDrop(s.value, card.id)}
                          className="min-h-[36px] rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 transition-colors duration-200 hover:border-brand-200 hover:bg-surface-muted disabled:opacity-50"
                          title={`Move to ${s.label}`}
                        >
                          → {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {byStage[col.value].length === 0 && (
              <div className="py-6 text-center text-xs text-slate-400">Drop cards here</div>
            )}
          </div>
        </div>
      ))}
    </div>
    </>
  );
}
