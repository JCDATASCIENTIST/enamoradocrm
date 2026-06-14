# Renewal tracking spec

## Purpose

Operational views for client renewal dates already stored on `contacts.renewal_date`.

## Buckets

| Tab | Rule |
|-----|------|
| Overdue | `renewal_date < today` |
| Due (7 days) | `today <= renewal_date <= today+7` |
| Upcoming (30 days) | `today+7 < renewal_date <= today+30` |

Only `contact_type = client` with non-null `renewal_date`.

## UI

`/renewals` with tab query param `?tab=overdue|due|upcoming`.

## Reminders

Daily cron `GET /api/cron/zapier-reminders` posts Path B payloads to `ZAPIER_RENEWAL_REMINDER_WEBHOOK` for renewals due within 7 days.

## Integration scope

No carrier API in v1 — manual dates on contact record. Carrier integration is change-order scope per Discovery §8.
