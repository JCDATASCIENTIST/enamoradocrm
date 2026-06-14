'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireProfile } from '@/lib/auth/session';
import { listAgentsForAssignment } from '@/lib/contacts/queries';
import { checkShortIdField } from '@/lib/hipaa/phi-guard';
import { GENDERS, MEDICAID_LEVELS, US_STATES } from '@/lib/constants';
import type {
  Contact,
  ContactMethod,
  FollowUpStatus,
  PipelineStage,
  PlanType,
} from '@/types/database.types';

type ContactInsert = Partial<Contact> & { first_name: string; last_name: string };

export interface ImportResult {
  total: number;
  inserted: number;
  skipped: number;
  errors: { row: number; message: string }[];
}

export type ImportState = { error?: string; result?: ImportResult };

// Note: columns present in our CSV export but system-managed (id, display_name,
// age, created_at, updated_at) are simply never read below — no mapping needed.

const PLAN_TYPES = new Set([
  'medicare_advantage',
  'medicare_supplement',
  'part_d',
  'medicaid',
  'dual_eligible',
  'other',
]);
const CONTACT_METHODS = new Set(['phone', 'email', 'text', 'mail']);
const FOLLOW_STATUSES = new Set(['pending', 'completed', 'skipped']);
const STAGES = new Set(['new', 'requested', 'in_progress', 'done']);

// ---- CSV parsing (RFC 4180, handles quotes, escaped quotes, embedded newlines) ----

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;
  const s = text.replace(/^﻿/, ''); // strip BOM

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && s[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      field = '';
      row = [];
    } else {
      field += c;
    }
  }
  // flush trailing field/row if file doesn't end in newline
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  // drop fully-empty rows
  return rows.filter((r) => r.some((v) => v.trim() !== ''));
}

function normHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, '_');
}

function norm(v: string | undefined): string | null {
  const s = (v ?? '').trim();
  return s.length ? s : null;
}

function normEnum(v: string | null): string | null {
  if (!v) return null;
  return v.toLowerCase().replace(/[\s-]+/g, '_');
}

// Accept YYYY-MM-DD or M/D/YYYY (common spreadsheet export) → ISO date.
function normDate(v: string | null): string | null {
  if (!v) return null;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (iso) return v;
  const us = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(v);
  if (us) {
    const [, m, d, y] = us;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return null; // unrecognized → treated as not provided
}

// Map a free-text value to a known option code, else keep the raw value.
function toCode(v: string | null, options: { value: string; label: string }[]): string | null {
  if (!v) return null;
  const lc = v.trim().toLowerCase();
  const hit = options.find(
    (o) => o.value.toLowerCase() === lc || o.label.toLowerCase() === lc,
  );
  return hit ? hit.value : v;
}

export async function importContacts(_prev: ImportState, formData: FormData): Promise<ImportState> {
  const profile = await requireProfile();
  if (profile.role === 'read_only') return { error: 'Read-only users cannot import contacts.' };

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Please choose a CSV file to upload.' };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { error: 'File is too large (max 5 MB).' };
  }

  const text = await file.text();
  const grid = parseCsv(text);
  if (grid.length < 2) {
    return { error: 'The file has no data rows (expected a header row plus at least one record).' };
  }

  const headers = grid[0].map(normHeader);
  const idx = (name: string) => headers.indexOf(name);
  if (idx('first_name') === -1 || idx('last_name') === -1) {
    return { error: 'CSV must include "first_name" and "last_name" columns.' };
  }

  // Resolve assigned_to by agent name or email.
  const agents = await listAgentsForAssignment();
  const agentByName = new Map<string, string>();
  for (const a of agents) {
    if (a.full_name) agentByName.set(a.full_name.toLowerCase(), a.id);
    agentByName.set(a.email.toLowerCase(), a.id);
  }

  const cell = (r: string[], name: string): string | null => {
    const i = idx(name);
    return i === -1 ? null : norm(r[i]);
  };

  const errors: { row: number; message: string }[] = [];
  const toInsert: ContactInsert[] = [];

  for (let r = 1; r < grid.length; r++) {
    const line = grid[r];
    const rowNum = r + 1; // 1-based incl. header, matches spreadsheet row numbers

    const first_name = cell(line, 'first_name');
    const last_name = cell(line, 'last_name');
    if (!first_name || !last_name) {
      errors.push({ row: rowNum, message: 'Missing first_name or last_name.' });
      continue;
    }

    const member = cell(line, 'member_id_last4');
    if (member && !/^[0-9]{1,4}$/.test(member)) {
      errors.push({ row: rowNum, message: 'member_id_last4 must be up to 4 digits (Path B — no full IDs).' });
      continue;
    }

    const medicaid = cell(line, 'medicaid_level');
    const medicaidGuard = checkShortIdField(medicaid);
    if (!medicaidGuard.ok) {
      errors.push({ row: rowNum, message: `medicaid_level: ${medicaidGuard.reason}` });
      continue;
    }

    const contactType = normEnum(cell(line, 'contact_type'));
    const stage = normEnum(cell(line, 'stage'));
    const planType = normEnum(cell(line, 'plan_type'));
    const method = normEnum(cell(line, 'preferred_contact_method'));
    const followStatus = normEnum(cell(line, 'follow_up_status'));
    const assignedName = cell(line, 'assigned_to_name') ?? cell(line, 'assigned_to');

    toInsert.push({
      contact_type: contactType === 'client' ? 'client' : 'prospect',
      first_name,
      last_name,
      preferred_name: cell(line, 'preferred_name'),
      date_of_birth: normDate(cell(line, 'date_of_birth')),
      gender: toCode(cell(line, 'gender'), GENDERS),
      language_preference: cell(line, 'language_preference'),
      primary_phone: cell(line, 'primary_phone'),
      secondary_phone: cell(line, 'secondary_phone'),
      email: cell(line, 'email'),
      address_line_1: cell(line, 'address_line_1'),
      address_line_2: cell(line, 'address_line_2'),
      city: cell(line, 'city'),
      state: toCode(cell(line, 'state'), US_STATES),
      zip: cell(line, 'zip'),
      preferred_contact_method:
        method && CONTACT_METHODS.has(method) ? (method as ContactMethod) : null,
      carrier: cell(line, 'carrier'),
      plan_name: cell(line, 'plan_name'),
      plan_type: planType && PLAN_TYPES.has(planType) ? (planType as PlanType) : null,
      medicaid_level: toCode(medicaid, MEDICAID_LEVELS),
      effective_date: normDate(cell(line, 'effective_date')),
      renewal_date: normDate(cell(line, 'renewal_date')),
      member_id_last4: member,
      stage: (stage && STAGES.has(stage) ? stage : 'new') as PipelineStage,
      assigned_to: assignedName ? agentByName.get(assignedName.toLowerCase()) ?? null : null,
      follow_up_date: normDate(cell(line, 'follow_up_date')),
      follow_up_status:
        followStatus && FOLLOW_STATUSES.has(followStatus) ? (followStatus as FollowUpStatus) : null,
      created_by: profile.id,
      updated_by: profile.id,
    });
  }

  const total = grid.length - 1;
  let inserted = 0;

  if (toInsert.length) {
    const supabase = createClient();
    const CHUNK = 200;
    for (let i = 0; i < toInsert.length; i += CHUNK) {
      const batch = toInsert.slice(i, i + CHUNK);
      const { error, count } = await supabase
        .from('contacts')
        .insert(batch, { count: 'exact' });
      if (error) {
        return {
          error: `Imported ${inserted} of ${total} before a database error: ${error.message}`,
          result: { total, inserted, skipped: total - inserted, errors },
        };
      }
      inserted += count ?? batch.length;
    }
    revalidatePath('/contacts');
  }

  return {
    result: { total, inserted, skipped: total - inserted, errors },
  };
}
