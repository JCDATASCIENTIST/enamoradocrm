import { createClient } from '@/lib/supabase/server';
import type { Commission, CommissionStatus } from '@/types/database.types';

const DEFAULT_PAGE_SIZE = 25;

export async function listCommissions(
  filters?: { status?: CommissionStatus | 'all' },
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
) {
  const supabase = createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  let query = supabase
    .from('commissions')
    .select('*, contacts(id, first_name, last_name, preferred_name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  const { data, count, error } = await query;
  if (error) throw error;
  return {
    rows: (data ?? []) as (Commission & {
      contacts: { id: string; first_name: string; last_name: string; preferred_name: string | null } | null;
    })[],
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function getCommission(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from('commissions').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as Commission | null;
}

/** Commissions attached to a single contact. Capped at 20 — the contact
 * detail page shows "see all" if more exist. */
export async function listCommissionsForContact(contactId: string, limit = 20) {
  const supabase = createClient();
  const { data, error, count } = await supabase
    .from('commissions')
    .select(
      'id, carrier, policy_number, amount, status, payment_date, notes, writing_agent_id, created_at, profiles:writing_agent_id(full_name, email)',
      { count: 'exact' },
    )
    .eq('contact_id', contactId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return { rows: data ?? [], total: count ?? 0 };
}
