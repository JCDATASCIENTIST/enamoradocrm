'use server';

// Server actions for auth: login, logout.
// Sign-up is intentionally NOT public — users are invited by an admin.

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '/dashboard');

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  const safeNext =
    next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\')
      ? next
      : '/dashboard';
  redirect(safeNext);
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
