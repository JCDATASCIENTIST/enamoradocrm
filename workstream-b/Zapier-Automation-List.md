# Zapier automation list (Path B)

Only non-PHI fields are sent. No date of birth, phone, address, email, or member IDs.

**Code references:** `app/lib/zapier/payload.ts`, `app/lib/zapier/send.ts`, `app/lib/contacts/actions.ts`, `app/app/api/cron/zapier-reminders/route.ts`

---

## Summary

| # | Event | CRM trigger | Env var |
|---|-------|-------------|---------|
| 1 | New prospect | `createContact` when `contact_type = prospect` | `ZAPIER_NEW_PROSPECT_WEBHOOK` |
| 2 | Follow-up reminder | Daily cron | `ZAPIER_FOLLOWUP_REMINDER_WEBHOOK` |
| 3 | Renewal reminder | Daily cron | `ZAPIER_RENEWAL_REMINDER_WEBHOOK` |

---

## 1. New prospect

### CRM behavior

- **Trigger:** Server action `createContact` after successful insert
- **Condition:** `contact_type === 'prospect'`
- **Failure handling:** Fire-and-forget; CRM create succeeds even if Zapier fails

### Sample payload

```json
{
  "event": "new_prospect",
  "contact_id": "550e8400-e29b-41d4-a716-446655440000",
  "display_name": "Jane Doe",
  "contact_type": "prospect",
  "stage": "new",
  "plan_type": "medicare_advantage",
  "assigned_to_name": "Maria Agent"
}
```

### Field mapping (Path B)

| Field | Source | In Zap? |
|-------|--------|---------|
| event | Constant `new_prospect` | Yes |
| contact_id | Supabase insert id | Yes |
| display_name | first + last (+ preferred) | Yes |
| contact_type | Form | Yes |
| stage | Form | Yes |
| plan_type | Form | Yes |
| assigned_to_name | profiles.full_name lookup | Yes |
| email, phone, DOB | Contact record | **No** |

### Recommended Zap: `Enamorado CRM — New Prospect Alert`

1. **Trigger:** Webhooks by Zapier → Catch Hook
2. Copy hook URL → Vercel env `ZAPIER_NEW_PROSPECT_WEBHOOK`
3. **Action:** Email (Gmail/Outlook) or Slack
   - Subject: `New prospect: {{display_name}} ({{stage}})`
   - Body: Plan type, assignee, link to CRM contact (build URL: `https://crm.enamoradoinsurancefl.com/contacts/{{contact_id}}`)
4. **Filter (optional):** Only if `stage` equals `new`

### Test procedure

1. Set webhook URL in staging Vercel env
2. Log in as agent; create prospect with assignee
3. Zapier Task History → confirm hook received
4. Verify payload has no email/phone/DOB fields

---

## 2. Follow-up reminder

### CRM behavior

- **Trigger:** `GET /api/cron/zapier-reminders` (Vercel Cron daily 13:00 UTC)
- **Auth:** `Authorization: Bearer <CRON_SECRET>`
- **Query rule:** `follow_up_status = pending` AND `follow_up_date` between today and today+7

### Sample payload

```json
{
  "event": "follow_up_reminder",
  "contact_id": "550e8400-e29b-41d4-a716-446655440000",
  "display_name": "Jane Doe",
  "follow_up_date": "2026-06-15",
  "follow_up_status": "pending"
}
```

### Field mapping (Path B)

| Field | In Zap? |
|-------|---------|
| contact_id, display_name, follow_up_date, follow_up_status | Yes |
| Phone, email, notes | **No** |

### Recommended Zap: `Enamorado CRM — Follow-up Due`

1. **Trigger:** Catch Hook → `ZAPIER_FOLLOWUP_REMINDER_WEBHOOK`
2. **Action:** Email to assigned agent (lookup in CRM) or team inbox
   - Subject: `Follow-up due {{follow_up_date}}: {{display_name}}`
3. **Dedupe:** Zapier Storage — skip if same `contact_id` + `follow_up_date` sent in last 24h

### Test procedure

```bash
curl -s -H "Authorization: Bearer YOUR_CRON_SECRET" \
  "https://YOUR-DEPLOY-URL/api/cron/zapier-reminders"
```

Expect JSON: `{"follow_ups":N,"renewals":M}`. Check Zapier for N follow-up tasks.

---

## 3. Renewal reminder

### CRM behavior

- Same cron route as follow-ups
- **Query rule:** `contact_type = client`, `renewal_date` not null, between today and today+7
- Computes `days_until` in payload

### Sample payload

```json
{
  "event": "renewal_reminder",
  "contact_id": "550e8400-e29b-41d4-a716-446655440000",
  "display_name": "Jane Doe",
  "renewal_date": "2026-06-20",
  "days_until": 5,
  "carrier": "Humana",
  "plan_name": "Gold Plus HMO"
}
```

### Field mapping (Path B)

| Field | In Zap? |
|-------|---------|
| contact_id, display_name, renewal_date, days_until, carrier, plan_name | Yes |
| Member ID, DOB, address | **No** |

### Recommended Zap: `Enamorado CRM — Renewal Due`

1. **Trigger:** Catch Hook → `ZAPIER_RENEWAL_REMINDER_WEBHOOK`
2. **Action:** Slack channel #renewals or email
   - Subject: `Renewal in {{days_until}} days: {{display_name}} — {{carrier}}`
3. **Filter:** `days_until` less than 8

### Test procedure

1. Create test **client** with `renewal_date` = today + 3 days
2. Run cron curl (above)
3. Confirm single renewal hook in Zapier

---

## Cron auth and schedule

| Setting | Value |
|---------|-------|
| Route | `GET /api/cron/zapier-reminders` |
| Header | `Authorization: Bearer <CRON_SECRET>` |
| Schedule | `vercel.json` — `0 13 * * *` (13:00 UTC daily) |

Adjust cron for agency timezone (e.g. 8 AM Eastern ≈ 13:00 UTC during EST).

---

## Path B forbidden-field audit

Before publishing any Zap, confirm payloads **never** include:

- date_of_birth / DOB
- primary_phone / secondary_phone
- email
- address fields
- member_id (full or last4)
- medicaid_level (if treated as identifier in your Discovery doc)
- notes body

Allowed identifiers for routing: `contact_id`, `display_name`, dates, plan metadata, carrier/plan name.

---

## Vercel environment variables

```env
CRON_SECRET=generate-a-long-random-string
ZAPIER_NEW_PROSPECT_WEBHOOK=https://hooks.zapier.com/hooks/catch/...
ZAPIER_FOLLOWUP_REMINDER_WEBHOOK=https://hooks.zapier.com/hooks/catch/...
ZAPIER_RENEWAL_REMINDER_WEBHOOK=https://hooks.zapier.com/hooks/catch/...
```

All optional except `CRON_SECRET` if using cron. Empty webhook URL = silent skip (no error).

---

## Related workflow docs

- [workflows/Renewal-Reminder-Flow.md](../workflows/Renewal-Reminder-Flow.md)
- [workflows/New-Prospect-Intake-Flow.md](../workflows/New-Prospect-Intake-Flow.md)
- [workflows/HIPAA-Data-Handling-Flow.md](../workflows/HIPAA-Data-Handling-Flow.md)
