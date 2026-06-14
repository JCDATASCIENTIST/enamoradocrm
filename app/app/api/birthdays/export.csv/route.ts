import { NextResponse, type NextRequest } from 'next/server';
import { requireProfile } from '@/lib/auth/session';
import { getBirthdays, type BirthdayMode } from '@/lib/birthdays/queries';
import { fullName } from '@/lib/format';

function csvEscape(value: unknown): string {
  if (value == null) return '';
  let s = String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
function csvRow(values: unknown[]): string {
  return values.map(csvEscape).join(',') + '\r\n';
}

export async function GET(request: NextRequest) {
  await requireProfile();
  const sp = request.nextUrl.searchParams;
  const mode = (sp.get('mode') as BirthdayMode | null) ?? 'this_week';
  const month = sp.get('month') ? Number(sp.get('month')) : undefined;

  const rows = await getBirthdays({ mode, month });
  const headers = [
    'id',
    'name',
    'date_of_birth',
    'upcoming_birthday',
    'turning_age',
    'days_until',
    'plan_type',
    'plan_name',
    'carrier',
    'primary_phone',
    'email',
    'stage',
    'contact_type',
  ];

  let csv = csvRow(headers);
  for (const r of rows) {
    csv += csvRow([
      r.id,
      fullName(r),
      r.date_of_birth,
      r.upcoming_birthday,
      r.turning_age,
      r.days_until,
      r.plan_type,
      r.plan_name,
      r.carrier,
      r.primary_phone,
      r.email,
      r.stage,
      r.contact_type,
    ]);
  }

  const filename = `birthdays-${mode}-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
