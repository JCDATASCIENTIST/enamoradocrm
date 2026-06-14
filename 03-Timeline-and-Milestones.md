# Enamorado Insurance CRM — Timeline & Milestones

**Companion to:** `02-Project-Plan.md`
**Planning horizon:** 18 working weeks (Discovery → Production Launch)
**Cadence:** Two-week sprints with Friday demos

---

## Week-by-Week Timeline

The timeline below assumes a Monday start in Week 1. Replace "W1" through "W18" with calendar dates once the engagement agreement is signed.

### Phase 0 — Discovery & Setup

**Week 1** — Kickoff meeting, stakeholder map, draft data dictionary, draft user role matrix, HIPAA posture discussion, request for sample data and brand assets. *Deliverable: Draft Discovery Document circulated by Friday.*

**Week 2** — Discovery Document revisions and sign-off; GitHub repo, Vercel project, and Supabase project provisioned; SiteGround DNS access verified; Supabase BAA signed if applicable; environment and secrets management plan set; engagement agreement countersigned. *Checkpoint 1 — Payment Milestone 1 due (20%).*

### Phase 1 — Workstream A Core Build

**Week 3** — Authentication, session management, user invitation flow; database schema v1 for clients, prospects, and core lookup tables; row-level security policies authored and tested.

**Week 4** — Client list view, client detail view (editable demographic and contact fields), basic search; smoke-test deploy to staging on Vercel. *Sprint 1 demo Friday — internal recording for client review.*

**Week 5** — Prospect list and detail views; plan and Medicare/Medicaid fields; user role enforcement on routes and queries; audit log table wired in.

**Week 6** — Notes panel with activity history; follow-up tracking with due-date filters; basic CSV export from filtered lists. *Sprint 2 demo Friday — live walkthrough with client. **Checkpoint 2 — Payment Milestone 2 due (20%).***

**Week 7** — Filter system across age, plan, Medicaid level, stage, assigned user, follow-up status; print-friendly views; birthday report.

**Week 8** — Sales pipeline kanban view; stage definitions (New, Requested, In Progress, Done); drag-and-drop stage transitions; stage history log. *Sprint 3 demo Friday — internal recording for client review.*

**Week 9** — Pipeline polish, filters on pipeline, pipeline-to-client linking, role-based pipeline visibility; performance pass on largest list views.

**Week 10** — Bug bash, accessibility pass, staging hardening, sample-data load. *Sprint 4 demo Friday — Workstream A MVP walkthrough. **Checkpoint 3 — Payment Milestone 3 due (20%).***

### Phase 2 — Workstream A Hardening & Training

**Week 11** — Parallel-run period begins; client uses Workstream A on real data alongside their existing process. Daily bug triage; performance fixes; backup/restore tested end-to-end.

**Week 12** — Admin training session (live, recorded); agent training session (live, recorded); written user guide; admin runbook delivered. *Checkpoint 4 — Workstream A production-ready sign-off.*

### Phase 3 — Workstream B Build

**Week 13** — Integration scope confirmation (which enrollment tools and carrier systems are in scope); commission schema and entry/edit views; renewal schema and dashboard scaffolding.

**Week 14** — Commission reporting views; renewal dashboard with upcoming/due/overdue tabs; renewal reminder rules. *Sprint 5 demo Friday — live walkthrough with client.*

**Week 15** — Enrollment activity log with status tracking; Zapier automation hooks for follow-up reminders, renewal reminders, and new-prospect notifications; carrier or enrollment-tool integration build (if in scope).

**Week 16** — Combined reporting views (commission + renewal + pipeline); polish and edge cases. *Sprint 6 demo Friday — internal recording for client review.*

**Week 17** — Final bug bash, UAT prep, security audit (RLS test suite, key rotation, SSL enforcement, backup verification). *Sprint 7 demo Friday — Workstream B feature-complete walkthrough. **Checkpoint 5 — Payment Milestone 4 due (25%).***

### Phase 4 — Production Launch & Handoff

**Week 18** — Final UAT with sign-off checklist; DNS cutover to `crm.enamoradoinsurancefl.com`; production deploy; 4-hour launch-day on-call window; handoff packet delivered (architecture diagram, admin guide, credential vault index, change log, 30-day support terms). *Checkpoint 6 — Payment Milestone 5 due (15%). 30-day post-launch support begins.*

---

## Milestone Summary Table

| # | Milestone | Week | Deliverable | Payment |
|---|-----------|------|-------------|---------|
| 1 | Discovery Sign-off | End W2 | Signed Discovery Document, environment provisioned | 20% |
| 2 | Workstream A Mid-Build | End W6 | Auth + clients/prospects + notes working on staging | 20% |
| 3 | Workstream A MVP | End W10 | Full Workstream A feature-complete on staging | 20% |
| 4 | Workstream A Prod-Ready | End W12 | Training complete, parallel-run feedback resolved | — |
| 5 | Workstream B Feature-Complete | End W17 | Commissions + renewals + enrollment + automations on staging | 25% |
| 6 | Production Launch | End W18 | Live on `crm.enamoradoinsurancefl.com`, handoff packet delivered | 15% |

---

## Demo Calendar

Sprint demos happen every other Friday at a fixed time agreed in Phase 0. Each demo is recorded so absent stakeholders catch up async. The demo schedule is: end of W4, W6, W8, W10, W14, W16, W17. The Week 18 launch is a working session rather than a demo.

---

## Client-Owned Dependencies

Anything the client must provide is listed here with the latest acceptable delivery date. If any of these slips, the corresponding consultant work slips by the same amount and the timeline extends.

**By end of Week 1:** Single named decision-maker, brand assets (logo, color tokens), domain access at SiteGround, sample dataset for the data dictionary discussion.

**By end of Week 2:** Signed engagement agreement; signed Supabase BAA if PHI is in scope; production-ready cleaned CSV of existing clients and prospects for one-time import.

**By end of Week 12:** Final integration scope decision for Workstream B (which carriers, which enrollment tools).

**By end of Week 17:** UAT participants identified and available for Week 18 acceptance testing.

---

## Slack/Buffer

This timeline assumes no major holidays or client-side outages. If multi-day delays occur on client-owned dependencies (sample data, sign-offs, integration decisions), each slipped day extends the final launch by one day. A two-week buffer between Week 18 and any externally promised launch date is strongly recommended on the client side.
