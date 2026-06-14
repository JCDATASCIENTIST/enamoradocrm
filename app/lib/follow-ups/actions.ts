'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireProfile } from '@/lib/auth/session';
import { dateInAppTz } from '@/lib/format';
import type { FollowUpStatus } from '@/types/database.types';

async function updateFollowUp(
  contactId: string,
  changes: { follow_up_status?: FollowUpStatus | null; follow_up_date?: string | null },
) {
  const profile = await requireProfile();
  if (profile.role === 'read_only') throw new Error('Read-only users cannot change follow-ups.');
  const supabase = createClient();
  const { error } = await supabase
    .from('contacts')
    .update({ ...changes, updated_by: profile.id })
    .eq('id', contactId);
  if (error) throw error;
  revalidatePath('/follow-ups');
  revalidatePath(`/contacts/${contactId}`);
  revalidatePath('/dashboard');
}

export async function markFollowUpComplete(contactId: string) {
  await updateFollowUp(contactId, { follow_up_status: 'completed' });
}

export async function markFollowUpSkipped(contactId: string) {
  await updateFollowUp(contactId, { follow_up_status: 'skipped' });
}

export async function snoozeFollowUp(contactId: string, days: number) {
  if (!Number.isInteger(days) || days < 1 || days > 365) {
    throw new Error('Snooze must be between 1 and 365 days.');
  }
  await updateFollowUp(contactId, { follow_up_date: dateInAppTz(days), follow_up_status: 'pending' });
}
