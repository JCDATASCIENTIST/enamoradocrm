# Scope coverage gap analysis

Generated for Happy Capy weekly audit. Compares [01-Project-Scope.md](../01-Project-Scope.md) to shipped features.

**Last updated:** 2026-06-14 (v1 polish pass)

## Workstream A — Core CRM

| Scope item | Status | Notes |
|------------|--------|-------|
| Client and prospect management | Done | `/contacts`, import, export |
| Notes and follow-up tracking | Done | Notes + follow-ups pages |
| Filtering, print, CSV export | Done | Filters, print views, API export |
| Sales pipeline (4 stages) | Done | `/pipeline` + history trigger |
| Multi-user roles | Done | admin, agent, read_only + RLS |
| Birthday reporting | Done | `/birthdays` |

## Workstream B

| Scope item | Status | Notes |
|------------|--------|-------|
| Commission tracking | Done | `/commissions` + inline panel on contact detail |
| Renewal tracking + reminders | Done | `/renewals` + cron + Zapier |
| Enrollment workflows | Done | `/enrollments` + inline quick-add on contact detail |
| Zapier automations | Done | 3 CRM webhooks + 1 new website-intake webhook |
| Inline enrollments/commissions on contact | Done | Added 2026-06-14 |
| Audit log diff for updates | Done | Added 2026-06-14 |

## Documentation gaps (addressed)

| Item | Status |
|------|--------|
| workflows/Renewal-Reminder-Flow.md | Done |
| workflows/Enrollment-Activity-Flow.md | Done |
| workflows/HIPAA-Data-Handling-Flow.md | Done (Path B; will be revised for Path A in v2) |
| workflows/Launch-Day-Runbook.md | Done |
| workflows/New-Prospect-Intake-Flow.md | Done |
| Extended Zapier-Automation-List.md | Done |
| Agent / Admin checklists | Done |

## v1 polish items (added 2026-06-14)

| Item | Status |
|------|--------|
| Domain fix: enamoradoinsurancecompany.com → enamoradoinsurancefl.com | Done (15 files) |
| CRM alt text: "Enamorado Health Services" → "Enamorado Insurance" | Done (3 files) |
| Inline enrollments panel on contact detail | Done |
| Inline commissions panel on contact detail | Done |
| Audit log diff for update rows | Done |
| Pipeline "Overdue" badge in APP_TZ | Done |
| error.tsx / not-found.tsx / global-error.tsx | Done |
| Commissions list: writing-agent column | Done |
| New-commission page: ?contact_id= prefill | Done |
| Dashboard greeting: no email local-part leak | Done |
| Website /contact form: working server action | Done |
| Follow-ups helper: single Intl.DateTimeFormat call | Done |

## Remaining optional enhancements (not v1 scope blockers)

| Item | Priority | Type |
|------|----------|------|
| Carrier/enrollment API integration | Change order | Integration |
| Aggregate commission reporting views (SQL views) | Future | Code |
| templates/Bug-Report-Template.md | Phase 2 template | Docs |
| Spanish version of marketing site | Change order | i18n |
| Canva birthday-card Zap (per kickoff transcript) | Decide | Integration |
| favicon, sitemap.xml, og-image | Launch polish | Code |

## v2 (Path A) — NOT STARTED, gated on Supabase BAA + scope sign-off

| Item | Status |
|------|--------|
| `0005_path_a_phi.sql` migration (SSN, MBI, Medicaid ID columns + access log) | Pending BAA |
| `app/lib/hipaa/vault.ts` server-side decrypt wrapper | Pending BAA |
| MCP server (`mcp/`) exposing CRM to Claude | Pending scope sign-off |
| Audit-log changes for PHI access events | Pending BAA |
| Risk-register update (Risk 1 → Path A; new Risk 11 for MCP attack surface) | Pending BAA |

## Recommended next sprint

1. UAT with client on staging; file bugs only for P1 issues
2. Configure production Zapier Zaps using test procedures in Zapier-Automation-List.md (now 4 Zaps, including the new website-intake)
3. DNS cutover to `enamoradoinsurancefl.com` and launch using Launch-Day-Runbook.md
4. **Once BAA is signed:** begin v2 (Path A) work
