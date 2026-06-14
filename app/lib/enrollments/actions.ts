'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireProfile } from '@/lib/auth/session';
import type { EnrollmentStatus } from '@/types/database.types';

const ENROLLMENT_STATUSES: EnrollmentStatus[] = [
  'started',
  'in_progress',
  'submitted',
  'approved',
  'declined',
  'cancelled',
];

export type EnrollmentFormState = { error?: string };

export async function createEnrollment(_prev: EnrollmentFormState, formData: FormData): Promise<EnrollmentFormState> {
  const profile = await requireProfile();
  if (profile.role === 'read_only') return { error: 'Read-only users cannot log enrollments.' };

  const contact_id = String(formData.get('contact_id') ?? '').trim();
  if (!contact_id) return { error: 'Contact is required.' };

  const status = String(formData.get('status') ?? 'started') as EnrollmentStatus;
  if (!ENROLLMENT_STATUSES.includes(status)) return { error: 'Invalid status.' };

  const supabase = createClient();
  const { error } = await supabase.from('enrollment_activities').insert({
    contact_id,
    status,
    external_ref: String(formData.get('external_ref') ?? '').trim() || null,
    description: String(formData.get('description') ?? '').trim() || null,
    created_by: profile.id,
    updated_by: profile.id,
  });
  if (error) return { error: error.message };

  revalidatePath('/enrollments');
  revalidatePath(`/contacts/${contact_id}`);
  return {};
}

export async function updateEnrollmentStatus(id: string, status: EnrollmentStatus, contactId: string) {
  const profile = await requireProfile();
  if (profile.role === 'read_only') throw new Error('Read-only users cannot update enrollments.');
  if (!ENROLLMENT_STATUSES.includes(status)) throw new Error('Invalid status.');

  const supabase = createClient();
  const patch: { status: EnrollmentStatus; completed_at?: string; updated_by: string } = {
    status,
    updated_by: profile.id,
  };
  if (status === 'approved' || status === 'declined' || status === 'cancelled') {
    patch.completed_at = new Date().toISOString();
  }

  const { error } = await supabase.from('enrollment_activities').update(patch).eq('id', id);
  if (error) throw error;

  revalidatePath('/enrollments');
  revalidatePath(`/contacts/${contactId}`);
}
