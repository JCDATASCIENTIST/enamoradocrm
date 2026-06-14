'use client';

import { useTransition } from 'react';
import { deleteContact } from '@/lib/contacts/actions';
import { Button } from '@/components/ui/button';

export function DeleteContactButton({ contactId }: { contactId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-red-600 hover:bg-red-50"
      disabled={pending}
      onClick={() => {
        if (!confirm('Permanently delete this contact and all related notes?')) return;
        startTransition(() => deleteContact(contactId));
      }}
    >
      {pending ? 'Deleting…' : 'Delete contact'}
    </Button>
  );
}
