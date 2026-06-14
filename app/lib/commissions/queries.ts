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
