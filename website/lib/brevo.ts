import { site } from '@/lib/site';

export type ContactNotification = {
  name: string;
  phone: string;
  email: string;
  message: string;
  locale: string;
  submittedAt: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildContactEmailHtml(data: ContactNotification): string {
  const rows = [
    ['Name', data.name],
    ['Phone', data.phone || '—'],
    ['Email', data.email || '—'],
    ['Language', data.locale === 'es' ? 'Español' : 'English'],
    ['Submitted', data.submittedAt],
    ['Message', data.message || '—'],
  ];

  const body = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 12px;">${escapeHtml(value).replace(/\n/g, '<br>')}</td></tr>`,
    )
    .join('');

  return `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#1e3a8a;">
<p>New contact request from <strong>${escapeHtml(site.url)}</strong>.</p>
<table style="border-collapse:collapse;width:100%;max-width:560px;">${body}</table>
<p style="color:#64748b;font-size:12px;">Reply directly to this email if the visitor left an address.</p>
</body></html>`;
}

export async function sendContactNotification(data: ContactNotification): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return false;

  const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL ?? site.email;
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? site.email;
  const senderName = process.env.BREVO_SENDER_NAME ?? site.shortName;

  const subject = `Website lead: ${data.name} (${data.locale.toUpperCase()})`;

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: notifyEmail, name: site.broker.name }],
      replyTo: data.email ? { email: data.email, name: data.name } : undefined,
      subject,
      htmlContent: buildContactEmailHtml(data),
    }),
  });

  if (!res.ok) {
    console.error('Brevo contact email failed', res.status, await res.text().catch(() => ''));
    return false;
  }

  return true;
}
