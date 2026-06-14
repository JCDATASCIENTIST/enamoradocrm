'use server';

import { sendContactNotification } from '@/lib/brevo';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';

export type ContactFormState = { error?: string; success?: boolean };

function resolveLocale(raw: string): Locale {
  return isLocale(raw) ? raw : 'en';
}

async function forwardToWebhook(
  webhook: string,
  payload: Record<string, string | null>,
): Promise<boolean> {
  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const locale = resolveLocale(String(formData.get('locale') ?? 'en'));
  const errors = getDictionary(locale).formErrors;

  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  if (!name) return { error: errors.nameRequired };
  if (!phone && !email) return { error: errors.contactRequired };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: errors.emailInvalid };
  }

  const phiPattern = /(?:\d{3}-\d{2}-\d{4}|\d{9})|(?=[A-Za-z0-9]{11})(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{11}/;
  for (const [field, value] of [
    ['name', name],
    ['phone', phone],
    ['email', email],
    ['message', message],
  ] as const) {
    if (phiPattern.test(value)) {
      return { error: errors.phiDetected };
    }
    if (field === 'name' && value.length > 120) return { error: errors.nameTooLong };
    if (field === 'phone' && value.length > 40) return { error: errors.phoneTooLong };
    if (field === 'email' && value.length > 200) return { error: errors.emailTooLong };
    if (field === 'message' && value.length > 2000) return { error: errors.messageTooLong };
  }

  const submittedAt = new Date().toISOString();
  const webhookPayload = {
    event: 'website_contact_request',
    name,
    phone: phone || null,
    email: email || null,
    message: message || null,
    submitted_at: submittedAt,
    source: `enamoradoinsurancecompany.com/${locale}/contact`,
    locale,
  };

  if (process.env.BREVO_API_KEY) {
    const sent = await sendContactNotification({
      name,
      phone,
      email,
      message,
      locale,
      submittedAt,
    });
    if (!sent) return { error: errors.sendFailed };
    return { success: true };
  }

  const webhook = process.env.WEBSITE_CONTACT_WEBHOOK;
  if (webhook) {
    const ok = await forwardToWebhook(webhook, webhookPayload);
    if (!ok) return { error: errors.inboxFailed };
    return { success: true };
  }

  return { success: true };
}
