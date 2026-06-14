// Server-only helpers for fetching the current user + profile + role.
// Use these in Server Components and Server Actions to enforce access.

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Profile, UserRole } from '@/types/database.types';

/** Returns the authenticated user, or redirects to /login if not authenticated. */
export async function requireUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return user;
}

/** Returns the user's profile (with role), redirecting to /login if absent. */
export async function requireProfile(): Promise<Profile> {
  const user = await requireUser();
  const supabase = createClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    // Profile row missing — shouldn't happen post-trigger, but fail safe.
    redirect('/login');
  }
  if (!profile.is_active) {
    redirect('/login?error=account_disabled');
  }
  return profile as Profile;
}

/** Throws (404) if the current user is not an admin. Use in admin-only routes. */
export async function requireAdmin(): Promise<Profile> {
  const profile = await requireProfile();
  if (profile.role !== 'admin') {
    // Render a 404 instead of leaking the existence of admin pages.
    const { notFound } = await import('next/navigation');
    notFound();
  }
  return profile;
}

/** True if the role can write (admin or agent). */
export function canWrite(role: UserRole): boolean {
  return role === 'admin' || role === 'agent';
}
