import Link from 'next/link';
import { requireProfile } from '@/lib/auth/session';
import { listContacts, listAgentsForAssignment, type ContactFilters } from '@/lib/contacts/queries';
import { ContactsFilters } from './_components/contacts-filters';
import { Button } from '@/components/ui/button';
import { fullName, ageFromDob, formatDate, humanPlan, humanStage } from '@/lib/format';
import type { ContactType, PipelineStage, PlanType, FollowUpStatus } from '@/types/database.types';

interface PageProps {
  searchParams: {
    search?: string;
    contact_type?: string;
    stage?: string;
    plan_type?: string;
    medicaid_level?: string;
    assigned_to?: string;
    follow_up_status?: string;
    minAge?: string;
    maxAge?: string;
    page?: string;
  };
}

export default async function ContactsPage({ searchParams }: PageProps) {
  const profile = await requireProfile();
  const agents = await listAgentsForAssignment();

  const filters: ContactFilters = {
    search: searchParams.search,
    contact_type: (searchParams.contact_type as ContactType | 'all' | undefined),
    stage: (searchParams.stage as PipelineStage | 'all' | undefined),
    plan_type: (searchParams.plan_type as PlanType | 'all' | undefined),
    medicaid_level: searchParams.medicaid_level,
    assigned_to: searchParams.assigned_to,
    follow_up_status: (searchParams.follow_up_status as FollowUpStatus | 'all' | 'overdue' | undefined),
    minAge: searchParams.minAge ? Number(searchParams.minAge) : undefined,
    maxAge: searchParams.maxAge ? Number(searchParams.maxAge) : undefined,
  };
  const page = searchParams.page ? Math.max(1, Number(searchParams.page)) : 1;

  const { rows, total, pageSize } = await listContacts(filters, page);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const agentLookup = new Map(agents.map((a) => [a.id, a.full_name ?? a.email]));

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Clients & Prospects</h1>
          <p className="mt-1 text-sm text-slate-500">
            {total} total · showing page {page} of {totalPages}
          </p>
        </div>
        {profile.role !== 'read_only' && (
          <div className="flex items-center gap-2">
            <Link href="/contacts/import">
              <Button variant="ghost">Import CSV</Button>
            </Link>
            <Link href="/contacts/new">
              <Button>+ New contact</Button>
            </Link>
          </div>
        )}
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <ContactsFilters agents={agents} />
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Stage</th>
              <th className="px-4 py-2">Plan</th>
              <th className="px-4 py-2">Age</th>
              <th className="px-4 py-2">Assigned</th>
              <th className="px-4 py-2">Follow-up</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((c) => {
              const age = ageFromDob(c.date_of_birth);
              const followLabel = c.follow_up_date
                ? `${formatDate(c.follow_up_date)} · ${c.follow_up_status ?? 'pending'}`
                : '—';
              return (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2 font-medium text-slate-900">
                    <Link href={`/contacts/${c.id}`} className="hover:underline">
                      {fullName(c)}
                    </Link>
                    {c.primary_phone && <div className="text-xs text-slate-500">{c.primary_phone}</div>}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        c.contact_type === 'client'
                          ? 'inline-flex rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700'
                          : 'inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700'
                      }
                    >
                      {c.contact_type}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-slate-600">{humanStage(c.stage)}</td>
                  <td className="px-4 py-2 text-slate-600">{humanPlan(c.plan_type)}</td>
                  <td className="px-4 py-2 text-slate-600">{age ?? '—'}</td>
                  <td className="px-4 py-2 text-slate-600">
                    {c.assigned_to ? agentLookup.get(c.assigned_to) ?? '—' : '—'}
                  </td>
                  <td className="px-4 py-2 text-slate-600">{followLabel}</td>
                  <td className="px-4 py-2 text-right">
                    <Link href={`/contacts/${c.id}`} className="text-brand-600 hover:underline">
                      Open
                    </Link>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                  No contacts match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-between text-sm text-slate-500">
          <PaginationLink searchParams={searchParams} page={page - 1} disabled={page <= 1}>
            ← Previous
          </PaginationLink>
          <span>
            Page {page} of {totalPages}
          </span>
          <PaginationLink searchParams={searchParams} page={page + 1} disabled={page >= totalPages}>
            Next →
          </PaginationLink>
        </div>
      )}
    </div>
  );
}

function PaginationLink({
  searchParams,
  page,
  disabled,
  children,
}: {
  searchParams: Record<string, string | undefined>;
  page: number;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) return <span className="opacity-40">{children}</span>;
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (v != null && k !== 'page') usp.set(k, v);
  }
  usp.set('page', String(page));
  return (
    <Link href={`/contacts?${usp.toString()}`} className="text-brand-600 hover:underline">
      {children}
    </Link>
  );
}
