'use client';

import { useState, useTransition } from 'react';
import { updateUserRole, setUserActive } from '@/lib/admin/actions';
import type { UserRole } from '@/types/database.types';

export function UserRowActions({
  userId,
  role,
  is_active,
}: {
  userId: string;
  role: UserRole;
  is_active: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <select
          defaultValue={role}
          disabled={pending}
          onChange={(e) =>
            startTransition(async () => {
              setError(null);
              const result = await updateUserRole(userId, e.target.value as UserRole);
              if (result.error) setError(result.error);
            })
          }
          className="rounded border border-slate-300 px-2 py-1 text-xs"
        >
          <option value="admin">admin</option>
          <option value="agent">agent</option>
          <option value="read_only">read_only</option>
        </select>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              setError(null);
              const result = await setUserActive(userId, !is_active);
              if (result.error) setError(result.error);
            })
          }
          className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {is_active ? 'Deactivate' : 'Activate'}
        </button>
      </div>
      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
}
