// Small formatting helpers used across the contacts UI.

// All "today / this week" windows are anchored to the broker's local timezone.
// Override via APP_TIMEZONE env var if the brokerage moves.
export const APP_TZ = process.env.APP_TIMEZONE || 'America/New_York';

// Returns YYYY-MM-DD for "today" in APP_TZ — safe to compare against date columns.
export function todayInAppTz(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: APP_TZ }).format(new Date());
}

// Returns YYYY-MM-DD for "today + days" in APP_TZ.
export function dateInAppTz(addDays: number): string {
  const now = new Date();
  now.setUTCDate(now.getUTCDate() + addDays);
  return new Intl.DateTimeFormat('en-CA', { timeZone: APP_TZ }).format(now);
}

export function fullName(c: { first_name: string; last_name: string; preferred_name?: string | null }) {
  const pref = c.preferred_name?.trim();
  if (pref) {
    // If the preferred name already ends with the last name (user typed the full
    // preferred name, e.g. "John Smith"), use it as-is. Otherwise treat it as a
    // first-name nickname and append the last name.
    const suffix = ` ${c.last_name}`.toLowerCase();
    if (pref.toLowerCase().endsWith(suffix) || pref.toLowerCase() === c.last_name.toLowerCase()) {
      return pref;
    }
    return `${pref} ${c.last_name}`;
  }
  return `${c.first_name} ${c.last_name}`;
}

export function ageFromDob(dob: string | null | undefined): number | null {
  if (!dob) return null;
  // Anchor at noon UTC so the local-date arithmetic doesn't drift in negative offsets.
  const d = new Date(dob + 'T12:00:00Z');
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getUTCFullYear() - d.getUTCFullYear();
  const m = now.getUTCMonth() - d.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < d.getUTCDate())) age--;
  return age;
}

export function formatDate(d: string | null | undefined) {
  if (!d) return '—';
  // Date-only strings (YYYY-MM-DD) are parsed as UTC midnight by default;
  // anchor to noon UTC so display in any TZ stays on the right calendar day.
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(d + 'T12:00:00Z') : new Date(d);
  return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function humanStage(stage: string) {
  return stage.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function humanPlan(plan: string | null | undefined) {
  if (!plan) return '—';
  return plan.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
