'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { Contact } from '@/types/database.types';
import type { FormState } from '@/lib/contacts/actions';
import { CarrierField } from '@/components/carrier-field';
import {
  US_STATES,
  GENDERS,
  LANGUAGES,
  MEDICAID_LEVELS,
  type Option,
} from '@/lib/constants';

// Render <option>s for a fixed list, preserving any pre-existing value that is
// no longer in the list (so editing legacy records never silently drops data).
function Options({ options, current }: { options: Option[]; current?: string | null }) {
  const known = options.some((o) => o.value === current);
  return (
    <>
      {!known && current ? <option value={current}>{current}</option> : null}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </>
  );
}

interface AgentOption {
  id: string;
  full_name: string | null;
  email: string;
}

function Field({
  label,
  name,
  children,
  error,
  hint,
  required,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {hint && !error && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
      {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
    </div>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving…' : label}
    </Button>
  );
}

interface ContactFormProps {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  defaultValues?: Partial<Contact>;
  agents: AgentOption[];
  submitLabel: string;
  cancelHref: string;
}

const initialState: FormState = {};

export function ContactForm({ action, defaultValues = {}, agents, submitLabel, cancelHref }: ContactFormProps) {
  const [state, formAction] = useFormState(action, initialState);
  const fe = state.fieldErrors ?? {};
  const d = defaultValues;

  return (
    <form action={formAction} className="space-y-8">
      {state.error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</div>
      )}

      <Section title="Record">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Type" name="contact_type" required>
            <Select id="contact_type" name="contact_type" defaultValue={d.contact_type ?? 'prospect'}>
              <option value="prospect">Prospect</option>
              <option value="client">Client</option>
            </Select>
          </Field>
          <Field label="Pipeline stage" name="stage" required>
            <Select id="stage" name="stage" defaultValue={d.stage ?? 'new'}>
              <option value="new">New</option>
              <option value="requested">Requested</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </Select>
          </Field>
          <Field label="Assigned to" name="assigned_to">
            <Select id="assigned_to" name="assigned_to" defaultValue={d.assigned_to ?? ''}>
              <option value="">Unassigned</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.full_name ?? a.email}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Section>

      <Section title="Demographic">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="First name" name="first_name" required error={fe.first_name}>
            <Input id="first_name" name="first_name" defaultValue={d.first_name ?? ''} required />
          </Field>
          <Field label="Last name" name="last_name" required error={fe.last_name}>
            <Input id="last_name" name="last_name" defaultValue={d.last_name ?? ''} required />
          </Field>
          <Field label="Preferred first name" name="preferred_name" hint="Nickname only (e.g., Bobby for Robert). Last name is added automatically.">
            <Input id="preferred_name" name="preferred_name" defaultValue={d.preferred_name ?? ''} placeholder="Bobby" />
          </Field>
          <Field label="Date of birth" name="date_of_birth">
            <Input id="date_of_birth" name="date_of_birth" type="date" defaultValue={d.date_of_birth ?? ''} />
          </Field>
          <Field label="Gender" name="gender">
            <Select id="gender" name="gender" defaultValue={d.gender ?? ''}>
              <option value="">—</option>
              <Options options={GENDERS} current={d.gender} />
            </Select>
          </Field>
          <Field label="Language preference" name="language_preference">
            <Select id="language_preference" name="language_preference" defaultValue={d.language_preference ?? ''}>
              <option value="">—</option>
              <Options options={LANGUAGES} current={d.language_preference} />
            </Select>
          </Field>
        </div>
      </Section>

      <Section title="Contact">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Primary phone" name="primary_phone">
            <Input id="primary_phone" name="primary_phone" defaultValue={d.primary_phone ?? ''} />
          </Field>
          <Field label="Secondary phone" name="secondary_phone">
            <Input id="secondary_phone" name="secondary_phone" defaultValue={d.secondary_phone ?? ''} />
          </Field>
          <Field label="Email" name="email">
            <Input id="email" name="email" type="email" defaultValue={d.email ?? ''} />
          </Field>
          <Field label="Preferred contact method" name="preferred_contact_method">
            <Select
              id="preferred_contact_method"
              name="preferred_contact_method"
              defaultValue={d.preferred_contact_method ?? ''}
            >
              <option value="">—</option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
              <option value="text">Text</option>
              <option value="mail">Mail</option>
            </Select>
          </Field>
          <Field label="Address line 1" name="address_line_1">
            <Input id="address_line_1" name="address_line_1" defaultValue={d.address_line_1 ?? ''} />
          </Field>
          <Field label="Address line 2" name="address_line_2">
            <Input id="address_line_2" name="address_line_2" defaultValue={d.address_line_2 ?? ''} />
          </Field>
          <Field label="City" name="city">
            <Input id="city" name="city" defaultValue={d.city ?? ''} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="State" name="state">
              <Select id="state" name="state" defaultValue={d.state ?? ''}>
                <option value="">—</option>
                <Options options={US_STATES} current={d.state} />
              </Select>
            </Field>
            <Field label="ZIP" name="zip">
              <Input id="zip" name="zip" defaultValue={d.zip ?? ''} />
            </Field>
          </div>
        </div>
      </Section>

      <Section title="Plan & Insurance">
        <div className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Path B reminder: do not enter SSNs, full Medicare IDs, full Medicaid IDs, or any health
          diagnoses. Use the last-4 field for identifiers.
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Carrier" name="carrier" hint="Pick a carrier, or choose “Other” to type one.">
            <CarrierField defaultValue={d.carrier} />
          </Field>
          <Field label="Plan name" name="plan_name">
            <Input id="plan_name" name="plan_name" defaultValue={d.plan_name ?? ''} />
          </Field>
          <Field label="Plan type" name="plan_type">
            <Select id="plan_type" name="plan_type" defaultValue={d.plan_type ?? ''}>
              <option value="">—</option>
              <option value="medicare_advantage">Medicare Advantage</option>
              <option value="medicare_supplement">Medicare Supplement</option>
              <option value="part_d">Part D</option>
              <option value="medicaid">Medicaid</option>
              <option value="dual_eligible">Dual Eligible</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="Medicaid level" name="medicaid_level">
            <Select id="medicaid_level" name="medicaid_level" defaultValue={d.medicaid_level ?? ''}>
              <option value="">—</option>
              <Options options={MEDICAID_LEVELS} current={d.medicaid_level} />
            </Select>
          </Field>
          <Field label="Effective date" name="effective_date">
            <Input id="effective_date" name="effective_date" type="date" defaultValue={d.effective_date ?? ''} />
          </Field>
          <Field label="Renewal date" name="renewal_date">
            <Input id="renewal_date" name="renewal_date" type="date" defaultValue={d.renewal_date ?? ''} />
          </Field>
          <Field
            label="Member ID (last 4 only)"
            name="member_id_last4"
            error={fe.member_id_last4}
            hint="Digits only. Max 4 characters."
          >
            <Input
              id="member_id_last4"
              name="member_id_last4"
              maxLength={4}
              inputMode="numeric"
              defaultValue={d.member_id_last4 ?? ''}
            />
          </Field>
        </div>
      </Section>

      <Section title="Follow-up">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Follow-up date" name="follow_up_date">
            <Input id="follow_up_date" name="follow_up_date" type="date" defaultValue={d.follow_up_date ?? ''} />
          </Field>
          <Field label="Follow-up status" name="follow_up_status">
            <Select id="follow_up_status" name="follow_up_status" defaultValue={d.follow_up_status ?? ''}>
              <option value="">—</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="skipped">Skipped</option>
            </Select>
          </Field>
        </div>
      </Section>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
        <Link href={cancelHref}>
          <Button type="button" variant="ghost">
            Cancel
          </Button>
        </Link>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-slate-900">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
