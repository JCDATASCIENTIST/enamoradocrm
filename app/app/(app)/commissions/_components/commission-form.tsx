'use client';

import { useFormState } from 'react-dom';
import { createCommission, updateCommission, type CommissionFormState } from '@/lib/commissions/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { Commission } from '@/types/database.types';
import { fullName } from '@/lib/format';
import { CarrierField } from '@/components/carrier-field';

const initial: CommissionFormState = {};

interface ContactOption {
  id: string;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
}

interface AgentOption {
  id: string;
  full_name: string | null;
  email: string;
}

export function CommissionForm({
  commission,
  contacts,
  agents,
}: {
  commission?: Commission;
  contacts: ContactOption[];
  agents: AgentOption[];
}) {
  const action = commission
    ? updateCommission.bind(null, commission.id)
    : createCommission;
  const [state, formAction] = useFormState(action, initial);

  return (
    <form action={formAction} className="mt-6 space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {!commission && (
        <label className="block text-sm">
          <span className="text-slate-700">Contact</span>
          <Select name="contact_id" required className="mt-1">
            <option value="">Select contact…</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {fullName(c)}
              </option>
            ))}
          </Select>
        </label>
      )}
      <label className="block text-sm">
        <span className="text-slate-700">Carrier</span>
        <div className="mt-1">
          <CarrierField defaultValue={commission?.carrier} />
        </div>
      </label>
      <label className="block text-sm">
        <span className="text-slate-700">Policy number</span>
        <Input name="policy_number" defaultValue={commission?.policy_number ?? ''} className="mt-1" />
      </label>
      <label className="block text-sm">
        <span className="text-slate-700">Writing agent</span>
        <Select name="writing_agent_id" defaultValue={commission?.writing_agent_id ?? ''} className="mt-1">
          <option value="">—</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.full_name ?? a.email}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-slate-700">Amount</span>
        <Input name="amount" type="number" step="0.01" defaultValue={commission?.amount ?? ''} className="mt-1" />
      </label>
      <label className="block text-sm">
        <span className="text-slate-700">Status</span>
        <Select name="status" defaultValue={commission?.status ?? 'pending'} className="mt-1">
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </label>
      <label className="block text-sm">
        <span className="text-slate-700">Payment date</span>
        <Input name="payment_date" type="date" defaultValue={commission?.payment_date ?? ''} className="mt-1" />
      </label>
      <label className="block text-sm">
        <span className="text-slate-700">Notes</span>
        <div className="mt-1 mb-1 rounded-md bg-amber-50 px-2 py-1 text-[11px] text-amber-800">
          Path B reminder: no SSNs, full Medicare/Medicaid IDs, or clinical details.
        </div>
        <textarea
          name="notes"
          defaultValue={commission?.notes ?? ''}
          rows={3}
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit">{commission ? 'Save changes' : 'Create commission'}</Button>
    </form>
  );
}
