'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MEDICAID_LEVELS } from '@/lib/constants';

interface AgentOption {
  id: string;
  full_name: string | null;
  email: string;
}

export function ContactsFilters({ agents }: { agents: AgentOption[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function pushFilter(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    next.delete('page'); // reset paging when filters change
    startTransition(() => router.push(`/contacts?${next.toString()}`));
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Input
        placeholder="Search name, email, phone…"
        defaultValue={params.get('search') ?? ''}
        onKeyDown={(e) => {
          if (e.key === 'Enter') pushFilter('search', (e.target as HTMLInputElement).value);
        }}
      />
      <Select
        defaultValue={params.get('contact_type') ?? 'all'}
        onChange={(e) => pushFilter('contact_type', e.target.value)}
      >
        <option value="all">All types</option>
        <option value="prospect">Prospects</option>
        <option value="client">Clients</option>
      </Select>
      <Select
        defaultValue={params.get('stage') ?? 'all'}
        onChange={(e) => pushFilter('stage', e.target.value)}
      >
        <option value="all">All stages</option>
        <option value="new">New</option>
        <option value="requested">Requested</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </Select>
      <Select
        defaultValue={params.get('medicaid_level') ?? 'all'}
        onChange={(e) => pushFilter('medicaid_level', e.target.value)}
      >
        <option value="all">All Medicaid levels</option>
        {MEDICAID_LEVELS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </Select>
      <Select
        defaultValue={params.get('plan_type') ?? 'all'}
        onChange={(e) => pushFilter('plan_type', e.target.value)}
      >
        <option value="all">All plans</option>
        <option value="medicare_advantage">Medicare Advantage</option>
        <option value="medicare_supplement">Medicare Supplement</option>
        <option value="part_d">Part D</option>
        <option value="medicaid">Medicaid</option>
        <option value="dual_eligible">Dual Eligible</option>
        <option value="other">Other</option>
      </Select>
      <Select
        defaultValue={params.get('assigned_to') ?? 'all'}
        onChange={(e) => pushFilter('assigned_to', e.target.value)}
      >
        <option value="all">All assignees</option>
        <option value="unassigned">Unassigned</option>
        {agents.map((a) => (
          <option key={a.id} value={a.id}>
            {a.full_name ?? a.email}
          </option>
        ))}
      </Select>
      <Select
        defaultValue={params.get('follow_up_status') ?? 'all'}
        onChange={(e) => pushFilter('follow_up_status', e.target.value)}
      >
        <option value="all">Any follow-up</option>
        <option value="pending">Pending</option>
        <option value="overdue">Overdue</option>
        <option value="completed">Completed</option>
        <option value="skipped">Skipped</option>
      </Select>
      <Input
        type="number"
        placeholder="Min age"
        defaultValue={params.get('minAge') ?? ''}
        onBlur={(e) => pushFilter('minAge', e.target.value)}
      />
      <Input
        type="number"
        placeholder="Max age"
        defaultValue={params.get('maxAge') ?? ''}
        onBlur={(e) => pushFilter('maxAge', e.target.value)}
      />
      {pending && <div className="text-xs text-slate-500 col-span-full">Updating…</div>}
      <div className="col-span-full flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => startTransition(() => router.push('/contacts'))}
        >
          Clear all filters
        </Button>
        <div className="flex gap-4">
          <a
            href={`/contacts/print?${params.toString()}`}
            className="text-sm text-brand-600 hover:underline"
          >
            Print view →
          </a>
          <a
            href={`/api/contacts/export.csv?${params.toString()}`}
            className="text-sm text-brand-600 hover:underline"
          >
            Export CSV →
          </a>
        </div>
      </div>
    </div>
  );
}
