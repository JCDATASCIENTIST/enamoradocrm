import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { fullName, todayInAppTz, dateInAppTz } from '@/lib/format';
import { notifyFollowUpReminder, notifyRenewalReminder } from '@/lib/zapier/send';

/** Daily cron (Vercel Cron or Zapier poll). Secured via CRON_SECRET header. */
export async function GET(request: Request) {
  const secret = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const today = todayInAppTz();
  const in7Str = dateInAppTz(7);

  const [{ data: followUps }, { data: renewals }] = await Promise.all([
    supabase
      .from('contacts')
      .select('id, first_name, last_name, preferred_name, follow_up_date, follow_up_status')
      .eq('follow_up_status', 'pending')
      .gte('follow_up_date', today)
      .lte('follow_up_date', in7Str),
    supabase
      .from('contacts')
      .select('id, first_name, last_name, preferred_name, renewal_date, carrier, plan_name')
      .eq('contact_type', 'client')
      .not('renewal_date', 'is', null)
      .gte('renewal_date', today)
      .lte('renewal_date', in7Str),
  ]);

  for (const c of followUps ?? []) {
    if (!c.follow_up_date) continue;
    await notifyFollowUpReminder({
      event: 'follow_up_reminder',
      contact_id: c.id,
      display_name: fullName(c),
      follow_up_date: c.follow_up_date,
      follow_up_status: c.follow_up_status,
    });
  }

  for (const c of renewals ?? []) {
    if (!c.renewal_date) continue;
    const days = Math.round(
      (new Date(c.renewal_date + 'T00:00:00').getTime() - new Date(today + 'T00:00:00').getTime()) /
        (1000 * 60 * 60 * 24),
    );
    await notifyRenewalReminder({
      event: 'renewal_reminder',
      contact_id: c.id,
      display_name: fullName(c),
      renewal_date: c.renewal_date,
      days_until: days,
      carrier: c.carrier,
      plan_name: c.plan_name,
    });
  }

  return NextResponse.json({
    follow_ups: followUps?.length ?? 0,
    renewals: renewals?.length ?? 0,
  });
}
