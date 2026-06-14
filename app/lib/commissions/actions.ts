'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { requireProfile } from '@/lib/auth/session';
import { checkForPhi } from '@/lib/hipaa/phi-guard';
import type { CommissionStatus } from '@/types/database.types';

const COMMISSION_STATUSES: CommissionStatus[] = ['pending', 'paid', 'cancelled'];

export type CommissionFormState = { error?: string };

function parseAmount(raw: string): { amount: number | null; error?: string } {
  if (!raw) return { amount: null };
  const n = Number(raw);
  if (!Number.isFinite(n)) return { amount: null, error: 'Amount must be a number.' };
  return { amount: n };
}

export async function createCommission(_prev: CommissionFormState, formData: FormData): Promise<CommissionFormState> {
  const profile = await requireProfile();
  if (profile.role === 'read_only') return { error: 'Read-only users cannot create commissions.' };

  const contact_id = String(formData.get('contact_id') ?? '').trim();
  if (!contact_id) return { error: 'Contact is required.' };

  const { amount, error: amtErr } = parseAmount(String(formData.get('amount') ?? '').trim());
  if (amtErr) return { error: amtErr };

  const status = String(formData.get('status') ?? 'pending') as CommissionStatus;
  if (!COMMISSION_STATUSES.includes(status)) return { error: 'Invalid status.' };

  const notes = String(formData.get('notes') ?? '').trim() || null;
  const phi = checkForPhi(notes);
  if (!phi.ok) return { error: phi.reason };

  const supabase = createClient();
  const { data, error } = await supabase
    .from('commissions')
    .insert({
      contact_id,
      carrier: String(formData.get('carrier') ?? '').trim() || null,
      policy_number: String(formData.get('policy_number') ?? '').trim() || null,
      writing_agent_id: String(formData.get('writing_agent_id') ?? '').trim() || null,
      amount,
      status,
      payment_date: String(formData.get('payment_date') ?? '').trim() || null,
      notes,
      created_by: profile.id,
      updated_by: profile.id,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  revalidatePath('/commissions');
  redirect(`/commissions/${data.id}`);
}

export async function updateCommission(id: string, _prev: CommissionFormState, formData: FormData): Promise<CommissionFormState> {
  const profile = await requireProfile();
  if (profile.role === 'read_only') return { error: 'Read-only users cannot edit commissions.' };

  const { amount, error: amtErr } = parseAmount(String(formData.get('amount') ?? '').trim());
  if (amtErr) return { error: amtErr };

  const status = String(formData.get('status') ?? 'pending') as CommissionStatus;
  if (!COMMISSION_STATUSES.includes(status)) return { error: 'Invalid status.' };

  const notes = String(formData.get('notes') ?? '').trim() || null;
  const phi = checkForPhi(notes);
  if (!phi.ok) return { error: phi.reason };

  const supabase = createClient();
  const { error } = await supabase
    .from('commissions')
    .update({
      carrier: String(formData.get('carrier') ?? '').trim() || null,
      policy_number: String(formData.get('policy_number') ?? '').trim() || null,
      writing_agent_id: String(formData.get('writing_agent_id') ?? '').trim() || null,
      amount,
      status,
      payment_date: String(formData.get('payment_date') ?? '').trim() || null,
      notes,
      updated_by: profile.id,
    })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/commissions');
  revalidatePath(`/commissions/${id}`);
  redirect(`/commissions/${id}`);
}
