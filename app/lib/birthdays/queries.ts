// Birthday queries — operates by month/day of date_of_birth, year-agnostic.
// We pull contacts with a DOB and filter by (month, day) in app code so we
// handle year-wrap correctly (e.g. a "this week" view across Dec 31 → Jan 1).

import { createClient } from '@/lib/supabase/server';
import type { Contact } from '@/types/database.types';

export type BirthdayMode = 'today' | 'this_week' | 'this_month' | 'month';

export interface BirthdayQuery {
  mode: BirthdayMode;
  /** When mode === 'month', 1–12. */
  month?: number;
}

interface BirthdayRow extends Contact {
  /** Computed: this year's birthday date (string YYYY-MM-DD). */
  upcoming_birthday: string;
  /** Days from today, 0 = today. Can be 0..364. */
  days_until: number;
  /** Age they will turn on the upcoming birthday. */
  turning_age: number | null;
}

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function thisYearsBirthday(dob: string, today: Date): { dateStr: string; daysUntil: number; turningAge: number | null } {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) {
    return { dateStr: dob, daysUntil: Number.MAX_SAFE_INTEGER, turningAge: null };
  }
  const y = today.getFullYear();
  let thisYear = new Date(y, d.getMonth(), d.getDate());
  const todayMidnight = new Date(y, today.getMonth(), today.getDate());
  if (thisYear.getTime() < todayMidnight.getTime()) {
    thisYear = new Date(y + 1, d.getMonth(), d.getDate());
  }
  const dateStr = `${thisYear.getFullYear()}-${pad(thisYear.getMonth() + 1)}-${pad(thisYear.getDate())}`;
  const daysUntil = Math.round((thisYear.getTime() - todayMidnight.getTime()) / 86400000);
  const turningAge = thisYear.getFullYear() - d.getFullYear();
  return { dateStr, daysUntil, turningAge };
}

export async function getBirthdays(q: BirthdayQuery): Promise<BirthdayRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .not('date_of_birth', 'is', null);
  if (error) throw error;

  const today = new Date();

  const computed: BirthdayRow[] = (data ?? []).map((c) => {
    const { dateStr, daysUntil, turningAge } = thisYearsBirthday(c.date_of_birth as string, today);
    return { ...(c as Contact), upcoming_birthday: dateStr, days_until: daysUntil, turning_age: turningAge };
  });

  computed.sort((a, b) => a.days_until - b.days_until);

  if (q.mode === 'today') {
    return computed.filter((r) => r.days_until === 0);
  }
  if (q.mode === 'this_week') {
    return computed.filter((r) => r.days_until <= 7);
  }
  if (q.mode === 'this_month') {
    const month = today.getMonth();
    return computed.filter((r) => new Date(r.upcoming_birthday).getMonth() === month);
  }
  if (q.mode === 'month' && q.month) {
    const m = q.month - 1;
    return computed.filter((r) => new Date(r.upcoming_birthday).getMonth() === m);
  }
  return computed;
}
