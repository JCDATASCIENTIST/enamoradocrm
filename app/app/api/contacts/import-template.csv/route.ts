import { NextResponse } from 'next/server';
import { requireProfile } from '@/lib/auth/session';

// A blank import template: the columns the importer understands, plus one
// example row. Matches the contacts export header names so an export can be
// edited and re-imported.
const HEADERS = [
  'contact_type',
  'first_name',
  'last_name',
  'preferred_name',
  'date_of_birth',
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
];

const EXAMPLE = [
  'prospect',
  'Maria',
  'Gomez',
  'Mari',
  '1955-04-12',
  'female',
  'Spanish',
  '305-555-0142',
  '',
  'maria@example.com',
  '123 Main St',
  '',
  'Miami',
  'FL',
  '33101',
  'phone',
  'Humana',
  'Gold Plus HMO',
  'medicare_advantage',
  'QMB',
  '2025-01-01',
  '2026-01-01',
  '4821',
  'new',
  '',
  '',
  'pending',
];

export async function GET() {
  await requireProfile();
  const csv = HEADERS.join(',') + '\r\n' + EXAMPLE.join(',') + '\r\n';
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="contacts-import-template.csv"',
      'Cache-Control': 'no-store',
    },
  });
}
