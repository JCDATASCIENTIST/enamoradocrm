'use client';

import { useFormState } from 'react-dom';
import { inviteUser, type AdminFormState } from '@/lib/admin/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const initial: AdminFormState = {};

export function InviteUserForm() {
  const [state, formAction] = useFormState(inviteUser, initial);

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h2 className="text-sm font-semibold text-slate-800">Invite user</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block text-xs text-slate-500">Email</span>
          <Input name="email" type="email" required />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs text-slate-500">Full name</span>
          <Input name="full_name" />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs text-slate-500">Role</span>
          <Select name="role" defaultValue="agent">
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="read_only">Read only</option>
          </Select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs text-slate-500">Temporary password</span>
          <Input name="password" type="password" required minLength={8} />
        </label>
      </div>
      <Button type="submit" size="sm">
        Create user
      </Button>
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
      {state.success && <p className="text-xs text-green-700">{state.success}</p>}
    </form>
  );
}
