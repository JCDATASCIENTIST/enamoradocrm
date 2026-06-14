# Commission tracking spec

## Purpose

Track commissions by contact (policy), carrier, writing agent, amount, status, and payment date.

## Schema

Table `commissions` (migration `0004_workstream_b.sql`):

| Field | Type | Notes |
|-------|------|-------|
| contact_id | FK | Required |
| carrier | text | |
| policy_number | text | |
| writing_agent_id | FK profiles | |
| amount | numeric(12,2) | |
| status | enum | pending, paid, cancelled |
| payment_date | date | |
| notes | text | |

## RLS

- All authenticated roles: SELECT.
- Admin: full UPDATE/DELETE.
- Agent: INSERT; UPDATE only when linked contact is assigned to them or unassigned.

## UI

- `/commissions` — list + status filters + totals
- `/commissions/new` — create
- `/commissions/[id]` — edit

## Reporting (future)

Aggregate by carrier and writing agent via SQL views or dashboard widgets.
