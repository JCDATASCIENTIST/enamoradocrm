// Follow-ups operates against contacts.follow_up_date / follow_up_status
// (the single "next follow-up" per contact). The follow_ups table remains
// available for future history-style tracking.

import { createClient } from '@/lib/supabase/server';
import { todayInAppTz, dateInAppTz, APP_TZ } from '@/lib/format';
import type { Contact } from '@/types/database.types';

export interface FollowUpScope {
  /** Only contacts assigned to this user. Falsy = show all visible. */
  assignedTo?: string | 'me' | 'all';
  currentUserId?: string;
}

interface Buckets {
  overdue: Contact[];
  today: Contact[];
  thisWeek: Contact[];
  later: Contact[];
}

export async function getPendingFollowUps(scope: FollowUpScope = {}): Promise<Buckets> {
  const supabase = createClient();
  const today = todayInAppTz();
  // Weekday in APP_TZ — 0 = Sun … 6 = Sat. The end of "this week" is the
  // upcoming Saturday (so weekdayInTz=0 → +6d, weekdayInTz=6 → +0d).
  const dayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(
    new Intl.DateTimeFormat('en-US', { timeZone: APP_TZ, weekday: 'short' }).format(new Date()) as
      | 'Sun'
      | 'Mon'
      | 'Tue'
      | 'Wed'
      | 'Thu'
      | 'Fri'
      | 'Sat',
  );
  const weekEnd = dateInAppTz(6 - (dayIndex === -1 ? new Date().getDay() : dayIndex));

  let query = supabase
    .from('contacts')
    .select('*')
    .eq('follow_up_status', 'pending')
    .not('follow_up_date', 'is', null)
    .order('follow_up_date', { ascending: true });

  if (scope.assignedTo === 'me' && scope.currentUserId) {
    query = query.eq('assigned_to', scope.currentUserId);
  } else if (scope.assignedTo && scope.assignedTo !== 'all' && scope.assignedTo !== 'me') {
    query = query.eq('assigned_to', scope.assignedTo);
  }

  const { data, error } = await query;
  if (error) throw error;

  const rows = (data ?? []) as Contact[];
  const buckets: Buckets = { overdue: [], today: [], thisWeek: [], later: [] };
  for (const c of rows) {
    const d = c.follow_up_date!;
    if (d < today) buckets.overdue.push(c);
    else if (d === today) buckets.today.push(c);
    else if (d <= weekEnd) buckets.thisWeek.push(c);
    else buckets.later.push(c);
  }
  return buckets;
}
