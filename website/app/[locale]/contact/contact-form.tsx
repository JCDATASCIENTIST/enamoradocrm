'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { Locale } from '@/lib/i18n/config';
import { submitContactForm, type ContactFormState } from '@/lib/contact-action';

const initial: ContactFormState = {};

type ContactFormProps = {
  locale: Locale;
  dict: Dictionary;
};

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-800 disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export function ContactForm({ locale, dict }: ContactFormProps) {
  const [state, formAction] = useFormState(submitContactForm, initial);
  const t = dict.form;

  if (state.success) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <h2 className="text-lg font-semibold text-green-900">{t.successTitle}</h2>
        <p className="mt-2 text-sm text-green-800">{t.successText}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="locale" value={locale} />
      {state.error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          {t.fullName}
        </label>
        <input id="name" name="name" type="text" required maxLength={120} className="input-field" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
            {t.phone}
          </label>
          <input id="phone" name="phone" type="tel" maxLength={40} className="input-field" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            {t.email}
          </label>
          <input id="email" name="email" type="email" maxLength={200} className="input-field" />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700">
          {t.message}
        </label>
        <textarea id="message" name="message" rows={4} maxLength={2000} className="input-field" />
      </div>
      <p className="text-xs text-slate-500">{t.phiWarning}</p>
      <SubmitButton label={t.submit} pendingLabel={t.sending} />
    </form>
  );
}
