import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { ContactForm } from './contact-form';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Enamorado Insurance Company for Medicare and health insurance guidance.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Contact</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-brand-900">Let&apos;s talk about your coverage</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Reach out by phone or email. We will schedule a time to review your situation and next steps.
          </p>

          <dl className="mt-8 space-y-6">
            <div>
              <dt className="text-sm font-semibold text-slate-500">Phone</dt>
              <dd className="mt-1">
                <a href={`tel:${site.phone.replace(/\D/g, '')}`} className="text-lg font-medium text-brand-700 hover:underline">
                  {site.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-slate-500">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${site.email}`} className="text-lg font-medium text-brand-700 hover:underline">
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-slate-500">Office</dt>
              <dd className="mt-1 text-slate-700">
                {site.address.line1}
                <br />
                {site.address.city}, {site.address.state} {site.address.zip}
              </dd>
            </div>
          </dl>

          <p className="mt-8 text-sm text-slate-500">
            Update contact details in <code className="rounded bg-slate-100 px-1">website/lib/site.ts</code> before launch.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <h2 className="text-lg font-semibold text-slate-900">Request a callback</h2>
          <p className="mt-2 text-sm text-slate-600">
            Fill this out and a licensed agent will reach out within one business day. Prefer a phone call? Use the number on the left.
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
