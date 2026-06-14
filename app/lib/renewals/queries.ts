import { createClient } from '@/lib/supabase/server';
import type { Contact } from '@/types/database.types';
import { fullName, todayInAppTz, dateInAppTz } from '@/lib/format';

export type RenewalBucket = 'upcoming' | 'due' | 'overdue';

export interface RenewalRow extends Contact {
  days_until_renewal: number;
}

function daysUntil(dateStr: string): number {
  const today = todayInAppTz();
  const a = new Date(today + 'T12:00:00Z').getTime();
  const b = new Date(dateStr + 'T12:00:00Z').getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export async function listRenewals(bucket: RenewalBucket): Promise<RenewalRow[]> {
  const supabase = createClient();
  const today = todayInAppTz();
  const in7Str = dateInAppTz(7);
  const in30Str = dateInAppTz(30);

  let query = supabase
    .from('contacts')
    .select('*')
    .eq('contact_type', 'client')
    .not('renewal_date', 'is', null)
    .order('renewal_date', { ascending: true });

  if (bucket === 'overdue') {
    query = query.lt('renewal_date', today);
  } else if (bucket === 'due') {
    query = query.gte('renewal_date', today).lte('renewal_date', in7Str);
  } else {
    query = query.gt('renewal_date', in7Str).lte('renewal_date', in30Str);
  }

  const { data, error } = await query;
  if (error) throw error;

  return ((data ?? []) as Contact[]).map((c) => ({
    ...c,
    days_until_renewal: c.renewal_date ? daysUntil(c.renewal_date) : 0,
  }));
}

export function renewalContactLabel(c: RenewalRow) {
  return fullName(c);
}
