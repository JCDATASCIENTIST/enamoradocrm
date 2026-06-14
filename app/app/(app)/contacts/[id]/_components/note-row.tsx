'use client';

import { useState, useTransition } from 'react';
import { updateNote, deleteNote } from '@/lib/notes/actions';
import { Button } from '@/components/ui/button';

export function NoteRow({
  note,
  contactId,
  authorName,
  isAdmin,
}: {
  note: { id: string; body: string; category: string | null; created_at: string };
  contactId: string;
  authorName: string | null;
  isAdmin: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(note.body);
  const [category, setCategory] = useState(note.category ?? '');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const result = await updateNote(note.id, contactId, body, category || null);
      if (result.error) setError(result.error);
      else {
        setError(null);
        setEditing(false);
      }
    });
  }

  function remove() {
    if (!confirm('Delete this note?')) return;
    startTransition(async () => {
      const result = await deleteNote(note.id, contactId);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="py-3 text-sm">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {note.category ?? 'note'}
          {authorName && <> · {authorName}</>}
        </span>
        <span>{new Date(note.created_at).toLocaleString()}</span>
      </div>
      {editing ? (
        <div className="mt-2 space-y-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            className="block w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
          />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="rounded-md border border-slate-300 px-2 py-1 text-xs"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={save} disabled={pending}>
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)} disabled={pending}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-1 whitespace-pre-wrap text-slate-800">{note.body}</div>
      )}
      {isAdmin && !editing && (
        <div className="mt-2 flex gap-2">
          <button type="button" onClick={() => setEditing(true)} className="text-xs text-brand-600 hover:underline">
            Edit
          </button>
          <button type="button" onClick={remove} disabled={pending} className="text-xs text-red-600 hover:underline">
            Delete
          </button>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
