import { NextResponse, type NextRequest } from 'next/server';
import { requireProfile } from '@/lib/auth/session';
import { listContacts, listAgentsForAssignment, type ContactFilters } from '@/lib/contacts/queries';
import { ageFromDob, fullName } from '@/lib/format';
import type { ContactType, PipelineStage, PlanType, FollowUpStatus } from '@/types/database.types';

// CSV-escape a single field per RFC 4180.
// Prefix leading =/+/-/@ with a single quote so spreadsheet apps don't treat them as formulas.
function csvEscape(value: unknown): string {
  if (value == null) return '';
  let s = String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function csvRow(values: unknown[]): string {
  return values.map(csvEscape).join(',') + '\r\n';
}

export async function GET(request: NextRequest) {
  // Enforces auth — anonymous downloads are blocked.
  await requireProfile();

  const sp = request.nextUrl.searchParams;
  const filters: ContactFilters = {
    search: sp.get('search') ?? undefined,
    contact_type: (sp.get('contact_type') as ContactType | 'all' | null) ?? undefined,
    stage: (sp.get('stage') as PipelineStage | 'all' | null) ?? undefined,
    plan_type: (sp.get('plan_type') as PlanType | 'all' | null) ?? undefined,
    medicaid_level: sp.get('medicaid_level') ?? undefined,
    assigned_to: sp.get('assigned_to') ?? undefined,
    follow_up_status: (sp.get('follow_up_status') as FollowUpStatus | 'all' | 'overdue' | null) ?? undefined,
    minAge: sp.get('minAge') ? Number(sp.get('minAge')) : undefined,
    maxAge: sp.get('maxAge') ? Number(sp.get('maxAge')) : undefined,
  };

  const agents = await listAgentsForAssignment();
  const agentLookup = new Map(agents.map((a) => [a.id, a.full_name ?? a.email]));

  // Pull in pages so we don't blow up memory on huge result sets.
  const pageSize = 500;
  const headers = [
    'id',
    'contact_type',
    'first_name',
    'last_name',
    'preferred_name',
    'display_name',
    'date_of_birth',
    'age',
    'gender',
    'language_preference',
    'primary_phone',
    'secondary_phone',
    'email',
    'address_line_1',
    'address_line_2',
    'city',
    'state',
    'zip',
    'preferred_contact_method',
    'carrier',
    'plan_name',
    'plan_type',
    'medicaid_level',
    'effective_date',
    'renewal_date',
    'member_id_last4',
    'stage',
    'assigned_to_name',
    'follow_up_date',
    'follow_up_status',
    'created_at',
    'updated_at',
  ];

  let csv = csvRow(headers);
  let page = 1;
  let total = Infinity;
  while ((page - 1) * pageSize < total) {
    const result = await listContacts(filters, page, pageSize);
    total = result.total;
    for (const c of result.rows) {
      csv += csvRow([
        c.id,
        c.contact_type,
        c.first_name,
        c.last_name,
        c.preferred_name,
        fullName(c),
        c.date_of_birth,
        ageFromDob(c.date_of_birth),
        c.gender,
        c.language_preference,
        c.primary_phone,
        c.secondary_phone,
        c.email,
        c.address_line_1,
        c.address_line_2,
        c.city,
        c.state,
        c.zip,
        c.preferred_contact_method,
        c.carrier,
        c.plan_name,
        c.plan_type,
        c.medicaid_level,
        c.effective_date,
        c.renewal_date,
        c.member_id_last4,
        c.stage,
        c.assigned_to ? agentLookup.get(c.assigned_to) ?? '' : '',
        c.follow_up_date,
        c.follow_up_status,
        c.created_at,
        c.updated_at,
      ]);
    }
    if (result.rows.length < pageSize) break;
    page += 1;
  }

  const filename = `contacts-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
