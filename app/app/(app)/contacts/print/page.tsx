import Link from 'next/link';
import { requireProfile } from '@/lib/auth/session';
import { listContacts, listAgentsForAssignment, type ContactFilters } from '@/lib/contacts/queries';
import { PrintButton } from '@/components/print-button';
import { fullName, ageFromDob, formatDate, humanPlan, humanStage } from '@/lib/format';
import type { ContactType, PipelineStage, PlanType, FollowUpStatus } from '@/types/database.types';

interface PageProps {
  searchParams: Record<string, string | undefined>;
}

export default async function ContactsPrintPage({ searchParams }: PageProps) {
  await requireProfile();
  const agents = await listAgentsForAssignment();
  const agentLookup = new Map(agents.map((a) => [a.id, a.full_name ?? a.email]));

  const filters: ContactFilters = {
    search: searchParams.search,
    contact_type: searchParams.contact_type as ContactType | 'all' | undefined,
    stage: searchParams.stage as PipelineStage | 'all' | undefined,
    plan_type: searchParams.plan_type as PlanType | 'all' | undefined,
    medicaid_level: searchParams.medicaid_level,
    assigned_to: searchParams.assigned_to,
    follow_up_status: searchParams.follow_up_status as FollowUpStatus | 'all' | 'overdue' | undefined,
    minAge: searchParams.minAge ? Number(searchParams.minAge) : undefined,
    maxAge: searchParams.maxAge ? Number(searchParams.maxAge) : undefined,
  };

  const all: Awaited<ReturnType<typeof listContacts>>['rows'] = [];
  let page = 1;
  let total = Infinity;
  while ((page - 1) * 500 < total) {
    const result = await listContacts(filters, page, 500);
    total = result.total;
    all.push(...result.rows);
    if (result.rows.length < 500) break;
    page += 1;
  }

  const printedAt = new Date().toLocaleString();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="no-print mb-4 flex items-center justify-between">
        <Link href={`/contacts?${new URLSearchParams(searchParams as Record<string, string>).toString()}`} className="text-sm text-brand-600 hover:underline">
          ← Back to list
        </Link>
        <PrintButton />
      </div>
      <h1 className="text-xl font-semibold">Clients & Prospects — Print</h1>
      <p className="text-sm text-slate-500">
        {all.length} contacts · Printed {printedAt}
      </p>
      <table className="mt-4 w-full border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-300 text-left">
            <th className="py-1 pr-2">Name</th>
            <th className="py-1 pr-2">Type</th>
            <th className="py-1 pr-2">Stage</th>
            <th className="py-1 pr-2">Plan</th>
            <th className="py-1 pr-2">Age</th>
            <th className="py-1 pr-2">Assigned</th>
            <th className="py-1">Follow-up</th>
          </tr>
        </thead>
        <tbody>
          {all.map((c) => (
            <tr key={c.id} className="border-b border-slate-100">
              <td className="py-1 pr-2">{fullName(c)}</td>
              <td className="py-1 pr-2">{c.contact_type}</td>
              <td className="py-1 pr-2">{humanStage(c.stage)}</td>
              <td className="py-1 pr-2">{humanPlan(c.plan_type)}</td>
              <td className="py-1 pr-2">{ageFromDob(c.date_of_birth) ?? '—'}</td>
              <td className="py-1 pr-2">{c.assigned_to ? agentLookup.get(c.assigned_to) ?? '—' : '—'}</td>
              <td className="py-1">{c.follow_up_date ? formatDate(c.follow_up_date) : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
