import { createClient } from '@/lib/supabase/server';
import type { AuditLogRow } from '@/types/database.types';

export interface AuditFilters {
  table_name?: string;
  action?: 'insert' | 'update' | 'delete';
  from?: string;
  to?: string;
}

const PAGE_SIZE = 50;

export async function listAuditLog(
  filters: AuditFilters = {},
  page = 1,
): Promise<{ rows: AuditLogRow[]; total: number; page: number; pageSize: number }> {
  const supabase = createClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from('audit_log')
    .select('*', { count: 'exact' })
    .order('occurred_at', { ascending: false })
    .range(from, to);

  if (filters.table_name) query = query.eq('table_name', filters.table_name);
  if (filters.action) query = query.eq('action', filters.action);
  if (filters.from) query = query.gte('occurred_at', filters.from);
  if (filters.to) query = query.lte('occurred_at', `${filters.to}T23:59:59.999Z`);

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    rows: (data ?? []) as AuditLogRow[],
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
  };
}
