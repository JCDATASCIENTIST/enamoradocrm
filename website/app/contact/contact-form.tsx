'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitContactForm, type ContactFormState } from '@/lib/contact-action';

const initial: ContactFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
    >
      {pending ? 'Sending…' : 'Submit request'}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useFormState(submitContactForm, initial);

  if (state.success) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <h2 className="text-lg font-semibold text-green-900">Thanks — we&apos;ll be in touch.</h2>
        <p className="mt-2 text-sm text-green-800">
          A licensed agent will reach out within one business day. If it&apos;s urgent, call
          us directly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 space-y-4">
      {state.error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={120}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            maxLength={40}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            maxLength={200}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700">
          How can we help?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>
      <p className="text-xs text-slate-500">
        For your protection, do not include Social Security numbers, full Medicare/Medicaid IDs,
        or health information in this form.
      </p>
      <SubmitButton />
    </form>
  );
}
