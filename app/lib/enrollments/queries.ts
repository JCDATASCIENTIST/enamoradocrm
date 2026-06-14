import { createClient } from '@/lib/supabase/server';
import type { EnrollmentActivity, EnrollmentStatus } from '@/types/database.types';

const DEFAULT_PAGE_SIZE = 25;

export async function listEnrollments(
  filters?: { status?: EnrollmentStatus | 'all' },
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
) {
  const supabase = createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  let query = supabase
    .from('enrollment_activities')
    .select('*, contacts(id, first_name, last_name, preferred_name)', { count: 'exact' })
    .order('started_at', { ascending: false })
    .range(from, to);

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  const { data, count, error } = await query;
  if (error) throw error;
  return {
    rows: (data ?? []) as (EnrollmentActivity & {
      contacts: { id: string; first_name: string; last_name: string; preferred_name: string | null } | null;
    })[],
    total: count ?? 0,
    page,
    pageSize,
  };
}
