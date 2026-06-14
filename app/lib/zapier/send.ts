// Fire-and-forget Zapier webhook posts. Failures are logged but do not block CRM actions.

type Payload = Record<string, unknown>;

async function postWebhook(url: string | undefined, payload: Payload) {
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error('Zapier webhook failed:', e);
  }
}

export async function notifyNewProspect(payload: Payload) {
  await postWebhook(process.env.ZAPIER_NEW_PROSPECT_WEBHOOK, payload);
}

export async function notifyFollowUpReminder(payload: Payload) {
  await postWebhook(process.env.ZAPIER_FOLLOWUP_REMINDER_WEBHOOK, payload);
}

export async function notifyRenewalReminder(payload: Payload) {
  await postWebhook(process.env.ZAPIER_RENEWAL_REMINDER_WEBHOOK, payload);
}
