'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireProfile } from '@/lib/auth/session';
import { checkForPhi } from '@/lib/hipaa/phi-guard';

export type NoteState = { error?: string };

export async function addNote(
  contactId: string,
  _prev: NoteState,
  formData: FormData,
): Promise<NoteState> {
  const profile = await requireProfile();
  if (profile.role === 'read_only') {
    return { error: 'Read-only users cannot add notes.' };
  }
  const body = String(formData.get('body') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim() || null;

  if (!body) return { error: 'Note cannot be empty.' };

  const phi = checkForPhi(body);
  if (!phi.ok) return { error: phi.reason };

  const supabase = createClient();
  const { error } = await supabase.from('notes').insert({
    contact_id: contactId,
    body,
    category,
    created_by: profile.id,
  });
  if (error) return { error: error.message };

  revalidatePath(`/contacts/${contactId}`);
  return {};
}

export async function updateNote(noteId: string, contactId: string, body: string, category: string | null): Promise<NoteState> {
  const profile = await requireProfile();
  if (profile.role !== 'admin') return { error: 'Only admins can edit notes.' };

  const trimmed = body.trim();
  if (!trimmed) return { error: 'Note cannot be empty.' };

  const phi = checkForPhi(trimmed);
  if (!phi.ok) return { error: phi.reason };

  const supabase = createClient();
  const { error } = await supabase
    .from('notes')
    .update({ body: trimmed, category: category?.trim() || null })
    .eq('id', noteId);
  if (error) return { error: error.message };

  revalidatePath(`/contacts/${contactId}`);
  return {};
}

export async function deleteNote(noteId: string, contactId: string): Promise<NoteState> {
  const profile = await requireProfile();
  if (profile.role !== 'admin') return { error: 'Only admins can delete notes.' };

  const supabase = createClient();
  const { error } = await supabase.from('notes').delete().eq('id', noteId);
  if (error) return { error: error.message };

  revalidatePath(`/contacts/${contactId}`);
  return {};
}
