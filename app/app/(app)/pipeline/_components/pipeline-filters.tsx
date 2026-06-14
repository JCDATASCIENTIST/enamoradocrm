'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Select } from '@/components/ui/select';

interface AgentOption {
  id: string;
  full_name: string | null;
  email: string;
}

export function PipelineFilters({ agents }: { agents: AgentOption[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function push(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    startTransition(() => router.push(`/pipeline?${next.toString()}`));
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        defaultValue={params.get('contact_type') ?? 'all'}
        onChange={(e) => push('contact_type', e.target.value)}
        className="w-40"
      >
        <option value="all">All types</option>
        <option value="prospect">Prospects</option>
        <option value="client">Clients</option>
      </Select>
      <Select
        defaultValue={params.get('assigned_to') ?? 'all'}
        onChange={(e) => push('assigned_to', e.target.value)}
        className="w-48"
      >
        <option value="all">All assignees</option>
        <option value="unassigned">Unassigned</option>
        {agents.map((a) => (
          <option key={a.id} value={a.id}>
            {a.full_name ?? a.email}
          </option>
        ))}
      </Select>
      {pending && <span className="text-xs text-slate-500">Updating…</span>}
    </div>
  );
}
