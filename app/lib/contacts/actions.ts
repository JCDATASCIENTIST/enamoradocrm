'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { requireProfile } from '@/lib/auth/session';
import { notifyNewProspect } from '@/lib/zapier/send';
import { fullName } from '@/lib/format';
import { checkShortIdField } from '@/lib/hipaa/phi-guard';
import type { ContactType, PipelineStage, PlanType, FollowUpStatus, ContactMethod } from '@/types/database.types';

export type FormState = { error?: string; fieldErrors?: Record<string, string> };

// ---- helpers ----------------------------------------------------------------

function nullable(v: FormDataEntryValue | null): string | null {
  const s = typeof v === 'string' ? v.trim() : '';
  return s.length > 0 ? s : null;
}

function nullableDate(v: FormDataEntryValue | null): string | null {
  const s = nullable(v);
  if (!s) return null;
  // Browser date inputs return YYYY-MM-DD which Postgres accepts.
  return s;
}

function validateMemberLast4(v: string | null): string | null {
  if (v == null) return null;
  // Path B: only last-4 identifiers. Reject anything longer.
  if (v.length > 4) throw new Error('Member ID must be 4 characters or fewer (Path B — no full IDs).');
  if (!/^[0-9]{0,4}$/.test(v)) throw new Error('Member ID last-4 must be digits only.');
  return v.length === 0 ? null : v;
}

interface ContactInput {
  contact_type: ContactType;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
  date_of_birth: string | null;
  gender: string | null;
  language_preference: string | null;
  primary_phone: string | null;
  secondary_phone: string | null;
  email: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  preferred_contact_method: ContactMethod | null;
  carrier: string | null;
  plan_name: string | null;
  plan_type: PlanType | null;
  medicaid_level: string | null;
  effective_date: string | null;
  renewal_date: string | null;
  member_id_last4: string | null;
  stage: PipelineStage;
  assigned_to: string | null;
  follow_up_date: string | null;
  follow_up_status: FollowUpStatus | null;
}

function parseForm(formData: FormData): { values: ContactInput; fieldErrors: Record<string, string> } {
  const fieldErrors: Record<string, string> = {};
  const first_name = String(formData.get('first_name') ?? '').trim();
  const last_name = String(formData.get('last_name') ?? '').trim();
  if (!first_name) fieldErrors.first_name = 'First name is required.';
  if (!last_name) fieldErrors.last_name = 'Last name is required.';

  let member_id_last4: string | null = null;
  try {
    member_id_last4 = validateMemberLast4(nullable(formData.get('member_id_last4')));
  } catch (e) {
    fieldErrors.member_id_last4 = (e as Error).message;
  }

  const medicaidRaw = nullable(formData.get('medicaid_level'));
  const medicaidCheck = checkShortIdField(medicaidRaw);
  if (!medicaidCheck.ok) fieldErrors.medicaid_level = medicaidCheck.reason;

  const values: ContactInput = {
    contact_type: (String(formData.get('contact_type') ?? 'prospect') as ContactType),
    first_name,
    last_name,
    preferred_name: nullable(formData.get('preferred_name')),
    date_of_birth: nullableDate(formData.get('date_of_birth')),
    gender: nullable(formData.get('gender')),
    language_preference: nullable(formData.get('language_preference')),
    primary_phone: nullable(formData.get('primary_phone')),
    secondary_phone: nullable(formData.get('secondary_phone')),
    email: nullable(formData.get('email')),
    address_line_1: nullable(formData.get('address_line_1')),
    address_line_2: nullable(formData.get('address_line_2')),
    city: nullable(formData.get('city')),
    state: nullable(formData.get('state')),
    zip: nullable(formData.get('zip')),
    preferred_contact_method: (nullable(formData.get('preferred_contact_method')) as ContactMethod | null),
    carrier: nullable(formData.get('carrier')),
    plan_name: nullable(formData.get('plan_name')),
    plan_type: (nullable(formData.get('plan_type')) as PlanType | null),
    medicaid_level: nullable(formData.get('medicaid_level')),
    effective_date: nullableDate(formData.get('effective_date')),
    renewal_date: nullableDate(formData.get('renewal_date')),
    member_id_last4,
    stage: (String(formData.get('stage') ?? 'new') as PipelineStage),
    assigned_to: nullable(formData.get('assigned_to')),
    follow_up_date: nullableDate(formData.get('follow_up_date')),
    follow_up_status: (nullable(formData.get('follow_up_status')) as FollowUpStatus | null),
  };
  return { values, fieldErrors };
}

async function resolveAssigneeName(
  supabase: ReturnType<typeof createClient>,
  assignedTo: string | null,
): Promise<string | null> {
  if (!assignedTo) return null;
  const { data } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', assignedTo)
    .maybeSingle();
  return data?.full_name ?? null;
}

// ---- actions ----------------------------------------------------------------

export async function createContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const profile = await requireProfile();
  if (profile.role === 'read_only') return { error: 'Read-only users cannot create contacts.' };

  const { values, fieldErrors } = parseForm(formData);
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const supabase = createClient();
  const { data, error } = await supabase
    .from('contacts')
    .insert({ ...values, created_by: profile.id, updated_by: profile.id })
    .select('id')
    .single();
  if (error) return { error: error.message };

  if (values.contact_type === 'prospect') {
    const assigned_to_name = await resolveAssigneeName(supabase, values.assigned_to);
    void notifyNewProspect({
      event: 'new_prospect',
      contact_id: data.id,
      display_name: fullName(values),
      contact_type: values.contact_type,
      stage: values.stage,
      plan_type: values.plan_type,
      assigned_to_name,
    });
  }

  revalidatePath('/contacts');
  redirect(`/contacts/${data.id}`);
}

export async function updateContact(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const profile = await requireProfile();
  if (profile.role === 'read_only') return { error: 'Read-only users cannot edit contacts.' };

  const { values, fieldErrors } = parseForm(formData);
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const supabase = createClient();
  const { error } = await supabase
    .from('contacts')
    .update({ ...values, updated_by: profile.id })
    .eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/contacts');
  revalidatePath(`/contacts/${id}`);
  redirect(`/contacts/${id}`);
}

export async function deleteContact(id: string): Promise<void> {
  const profile = await requireProfile();
  if (profile.role !== 'admin') {
    throw new Error('Only admins can delete contacts.');
  }
  const supabase = createClient();
  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/contacts');
  redirect('/contacts');
}

export async function transitionStage(id: string, to_stage: PipelineStage): Promise<void> {
  const profile = await requireProfile();
  if (profile.role === 'read_only') throw new Error('Read-only users cannot change stages.');

  const supabase = createClient();
  const { error } = await supabase
    .from('contacts')
    .update({ stage: to_stage, updated_by: profile.id })
    .eq('id', id);
  if (error) throw error;

  revalidatePath(`/contacts/${id}`);
  revalidatePath('/contacts');
  revalidatePath('/pipeline');
}

export async function promoteToClient(id: string): Promise<void> {
  const profile = await requireProfile();
  if (profile.role === 'read_only') throw new Error('Read-only users cannot promote contacts.');

  const supabase = createClient();
  const { error } = await supabase
    .from('contacts')
    .update({ contact_type: 'client', updated_by: profile.id })
    .eq('id', id);
  if (error) throw error;
  revalidatePath(`/contacts/${id}`);
  revalidatePath('/contacts');
  revalidatePath('/pipeline');
}
