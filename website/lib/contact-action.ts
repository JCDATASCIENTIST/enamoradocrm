'use server';

// Server action for the public contact form on enamoradoinsurancefl.com.
// Forwards submissions to a Zapier Catch-Hook webhook (configurable via env)
// so the agency can route them into Slack, email, the CRM, or anywhere.
//
// If WEBSITE_CONTACT_WEBHOOK is unset, the action still succeeds — the form
// submission is acknowledged but no data leaves the site. This keeps the
// deploy working before the agency has its Zap configured.
//
// IMPORTANT: This is the public marketing site. Path B (no PHI) does not
// apply because we are not the system of record for any client data — the
// submitter is a *prospect* who has not yet become a client. We still do
// not log full SSN / MBI / Medicaid IDs and we forward only what the
// prospect typed in the form.

export type ContactFormState = { error?: string; success?: boolean };

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  if (!name) return { error: 'Please enter your name.' };
  if (!phone && !email) {
    return { error: 'Please share a phone number or email so we can reach you.' };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'That email address does not look right.' };
  }

  // Reject obvious PHI so we never forward SSN / MBI / Medicaid IDs to Zapier.
  const phiPattern = /(?:\d{3}-\d{2}-\d{4}|\d{9})|(?=[A-Za-z0-9]{11})(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{11}/;
  for (const [field, value] of [
    ['name', name],
    ['phone', phone],
    ['email', email],
    ['message', message],
  ] as const) {
    if (phiPattern.test(value)) {
      return {
        error:
          'Your message looks like it contains a Social Security Number or full Medicare/Medicaid ID. Please remove it and resubmit — for your protection we never transmit those numbers through web forms.',
      };
    }
    if (field === 'name' && value.length > 120) return { error: 'Name is too long.' };
    if (field === 'phone' && value.length > 40) return { error: 'Phone is too long.' };
    if (field === 'email' && value.length > 200) return { error: 'Email is too long.' };
    if (field === 'message' && value.length > 2000) return { error: 'Message is too long.' };
  }

  const webhook = process.env.WEBSITE_CONTACT_WEBHOOK;
  if (!webhook) {
    // No webhook configured — pretend success so the form still works.
    return { success: true };
  }

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'website_contact_request',
        name,
        phone: phone || null,
        email: email || null,
        message: message || null,
        submitted_at: new Date().toISOString(),
        source: 'enamoradoinsurancefl.com/contact',
      }),
    });
    if (!res.ok) {
      return { error: 'We could not send your message. Please call us instead.' };
    }
  } catch {
    return { error: 'We could not reach our inbox. Please call us instead.' };
  }

  return { success: true };
}
