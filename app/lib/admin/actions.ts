'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import type { UserRole } from '@/types/database.types';

export type AdminFormState = { error?: string; success?: string };

export async function inviteUser(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdmin();

  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const role = String(formData.get('role') ?? 'agent') as UserRole;
  const full_name = String(formData.get('full_name') ?? '').trim() || null;
  const password = String(formData.get('password') ?? '').trim();

  if (!email) return { error: 'Email is required.' };
  if (!['admin', 'agent', 'read_only'].includes(role)) return { error: 'Invalid role.' };
  if (password.length < 8) return { error: 'Temporary password must be at least 8 characters.' };

  const admin = createAdminClient();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name },
  });
  if (createError) return { error: createError.message };

  if (created.user) {
    const { error: profileError } = await admin
      .from('profiles')
      .update({ role, full_name, is_active: true })
      .eq('id', created.user.id);
    if (profileError) return { error: profileError.message };
  }

  revalidatePath('/admin/users');
  return { success: `Invited ${email} as ${role}.` };
}

async function wouldRemoveLastAdmin(userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('profiles')
    .select('id')
    .eq('role', 'admin')
    .eq('is_active', true);
  if (error || !data) return false;
  return data.length <= 1 && data.some((r) => r.id === userId);
}

export async function updateUserRole(userId: string, role: UserRole): Promise<AdminFormState> {
  await requireAdmin();
  if (!['admin', 'agent', 'read_only'].includes(role)) return { error: 'Invalid role.' };

  if (role !== 'admin' && (await wouldRemoveLastAdmin(userId))) {
    return { error: 'Cannot demote the last active admin.' };
  }

  const admin = createAdminClient();
  const { error } = await admin.from('profiles').update({ role }).eq('id', userId);
  if (error) return { error: error.message };

  revalidatePath('/admin/users');
  return { success: 'Role updated.' };
}

export async function setUserActive(userId: string, is_active: boolean): Promise<AdminFormState> {
  const profile = await requireAdmin();
  if (profile.id === userId && !is_active) {
    return { error: 'You cannot deactivate your own account.' };
  }
  if (!is_active && (await wouldRemoveLastAdmin(userId))) {
    return { error: 'Cannot deactivate the last active admin.' };
  }

  const admin = createAdminClient();
  const { error } = await admin.from('profiles').update({ is_active }).eq('id', userId);
  if (error) return { error: error.message };

  revalidatePath('/admin/users');
  return { success: is_active ? 'User activated.' : 'User deactivated.' };
}
