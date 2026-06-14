# Enamorado Insurance CRM — Master Project Package Index

**Purpose:** This is the single source of truth for every document, template, SOP, workflow, and guide that this engagement needs. It is organized so you can see at a glance what is **done**, what is **next**, and what comes **later** in the project. It also tells you *who each document is for* (Client, Internal, or Both) and *which phase it belongs to*.

**Conventions:**
- ✅ Done — file exists in this folder.
- 🟡 Next — should be built before kickoff or in Phase 0.
- 🔵 Later — built when the phase that needs it arrives.
- (C) Client-facing, (I) Internal-only, (B) Both.

---

## 1. Foundation Documents — The Engagement Itself

These define what we're building, when, and on what terms. They are the contractual and planning backbone.

| Status | Document | Audience | Phase | Purpose |
|--------|----------|----------|-------|---------|
| ✅ | `01-Project-Scope.md` | B | Pre-engagement | The approved feature scope. |
| ✅ | `02-Project-Plan.md` | B | Pre-engagement | Phases, payment milestones, exclusions, assumptions. |
| ✅ | `03-Timeline-and-Milestones.md` | B | Pre-engagement | Week-by-week schedule with client dependencies. |
| ✅ | `04-Risk-Register.md` | B | Pre-engagement | 10 prioritized risks with mitigations. |
| ✅ | `05-Statement-of-Work.md` | C | Pre-engagement | Signature-ready engagement agreement. |
| ✅ | `06-Project-Package-Index.md` | B | Pre-engagement | This document. |
| 🟡 | `07-Kickoff-Deck-Outline.md` | C | Phase 0 W1 | Slides + talking points for the kickoff meeting. |
| 🟡 | `08-Discovery-Document-Template.md` | B | Phase 0 W1–W2 | Captures HIPAA decision, data dictionary, roles. Signed at Checkpoint 1. |

---

## 2. Reusable Templates — Operational Forms

Templates the project uses again and again. Stored in `templates/`. Each is built once and copied per use.

| Status | Template | Audience | When Used | Purpose |
|--------|----------|----------|-----------|---------|
| 🟡 | `templates/Change-Order-Template.md` | C | Any time scope shifts | Captures new work, revised cost, revised timeline. Signed by both parties. |
| 🟡 | `templates/Weekly-Status-Update-Template.md` | C | Every Friday | Standard format: done this week, next week, blockers, decisions needed, top 3 risks. |
| 🔵 | `templates/Sprint-Demo-Agenda-Template.md` | C | Every 2 weeks | Demo run-of-show: what we'll show, in what order, what we want feedback on. |
| 🔵 | `templates/Acceptance-Checklist-Template.md` | C | Each checkpoint | One-page sign-off form for the deliverables of that checkpoint. |
| 🔵 | `templates/Bug-Report-Template.md` | C | Any time | Standard form for client to log bugs during parallel-run and UAT. |
| 🔵 | `templates/UAT-Sign-Off-Checklist.md` | C | Week 18 | Feature-by-feature pass/fail acceptance form. |
| 🔵 | `templates/Decision-Log-Entry-Template.md` | I | Any decision | Records architectural or scope decisions and rationale. |
| 🔵 | `templates/Meeting-Notes-Template.md` | B | Every client meeting | Attendees, decisions, action items, next meeting. |

---

## 3. Phase 0 Deliverables — Discovery & Setup

Built or filled out in Weeks 1–2 and signed before Phase 1 starts.

| Status | Document | Audience | Purpose |
|--------|----------|----------|---------|
| 🟡 | Discovery Document (filled from template #8 above) | C | Locked HIPAA posture, data dictionary, role matrix, integration list. |
| 🟡 | `phase-0/Data-Dictionary.md` | B | Field-level spec for clients, prospects, policies, pipeline. |
| 🟡 | `phase-0/User-Role-and-Permissions-Matrix.md` | B | Admin / Agent / Read-only access rules per table and action. |
| 🟡 | `phase-0/HIPAA-Posture-Decision.md` | B | The yes/no on PHI storage and the resulting compliance controls. |
| 🟡 | `phase-0/Integration-Scope-Confirmation.md` | C | Names the one carrier / enrollment-tool integration in scope for Workstream B. |
| 🟡 | `phase-0/Environment-Provisioning-Checklist.md` | I | GitHub, Vercel, Supabase, SiteGround setup steps. |
| 🟡 | `phase-0/Sample-Data-CSV-Spec.md` | C | Tells the client exactly how the import CSV must be formatted. |

---

## 4. Internal SOPs — How We Build

Standard operating procedures for the consultant side. These are *how Joel works*, written down so the work is repeatable and recoverable if a successor steps in.

| Status | SOP | Phase | Purpose |
|--------|-----|-------|---------|
| 🟡 | `sops/Sprint-Cadence-SOP.md` | All | 2-week sprint shape: Mon plan, Wed mid-check, Fri demo + status. |
| 🟡 | `sops/Code-Review-and-PR-SOP.md` | Phase 1+ | Branch rules, PR template, review checklist, merge gates. |
| 🟡 | `sops/Database-Migration-SOP.md` | Phase 1+ | How schema changes are written, tested, and applied to staging then production. |
| 🟡 | `sops/RLS-Testing-SOP.md` | Phase 1+ | Every table gets an RLS test per role. Mandatory on every PR. |
| 🟡 | `sops/Deploy-SOP.md` | Phase 1+ | Staging deploy on every merge; production deploy is manual with a checklist. |
| 🟡 | `sops/Security-Incident-Response-SOP.md` | All | What to do if PHI leak or credential compromise is suspected. |
| 🟡 | `sops/Backup-and-Restore-SOP.md` | Phase 2+ | Verified weekly. Tested end-to-end in Week 11. |
| 🟡 | `sops/Change-Order-Intake-SOP.md` | All | How to take a verbal "can you also add…" and turn it into a signed change order. |
| 🟡 | `sops/Client-Communication-SOP.md` | All | Email response SLA, demo cadence, escalation path. |
| 🟡 | `sops/Credentials-Vault-SOP.md` | All | Where secrets live, who has access, rotation schedule. |

---

## 5. Workflows — Repeatable Processes

Diagrammable end-to-end flows that span multiple roles or systems. These are *what happens when X comes in*.

| Status | Workflow | Audience | Purpose |
|--------|----------|----------|---------|
| 🟡 | `workflows/Client-Request-Intake-Flow.md` | I | Email arrives → triage → in-scope task / change order / future backlog. |
| 🟡 | `workflows/Bug-Triage-Flow.md` | I | Bug reported → severity → assigned → fix → deploy → verify with client. |
| 🟡 | `workflows/Feature-Build-Flow.md` | I | Spec → branch → build → test → PR → demo → merge → staging. |
| 🟡 | `workflows/Sign-Off-Flow.md` | B | Deliverable ready → checkpoint email → 5-day window → accept or remediate. |
| 🟡 | `workflows/HIPAA-Data-Handling-Flow.md` | B | How PHI enters, lives in, and leaves the system. Mandatory if PHI is in scope. |
| 🔵 | `workflows/Renewal-Reminder-Flow.md` | B | How Zapier + Supabase scheduler triggers renewal reminders. Built in Workstream B. |
| 🔵 | `workflows/Enrollment-Activity-Flow.md` | C | How agents record an enrollment from start to finish in the CRM. |
| 🔵 | `workflows/Launch-Day-Runbook.md` | I | Hour-by-hour Week 18 launch sequence including rollback. |

---

## 6. Phase 2 Deliverables — Training & Documentation

Built during Weeks 11–12 to make the system actually usable by humans. These are the artifacts that earn Checkpoint 4 sign-off.

| Status | Document | Audience | Purpose |
|--------|----------|----------|---------|
| 🔵 | `user-guides/Admin-User-Guide.md` | C | Step-by-step for admin tasks: invite users, set roles, manage data, run reports. |
| 🔵 | `user-guides/Agent-User-Guide.md` | C | Step-by-step for daily agent workflow: log a call, move a prospect, schedule a follow-up. |
| 🔵 | `user-guides/CSV-Import-Export-Guide.md` | C | How to export filtered lists and import updated data. |
| 🔵 | `user-guides/Birthday-Report-Guide.md` | C | How and when to run the birthday report. |
| 🔵 | `user-guides/Pipeline-Stage-Guide.md` | C | When to use each stage and how stage history works. |
| 🔵 | `videos/Admin-Training-Recording.md` | C | Index + link to the recorded admin training (Week 12). |
| 🔵 | `videos/Agent-Training-Recording.md` | C | Index + link to the recorded agent training (Week 12). |

---

## 7. Phase 3 Deliverables — Workstream B Specifics

Built during Weeks 13–17. These layer on top of the Workstream A foundation.

| Status | Document | Audience | Purpose |
|--------|----------|----------|---------|
| 🔵 | `workstream-b/Commission-Tracking-Spec.md` | B | Final field list, calculation rules, reporting views. |
| 🔵 | `workstream-b/Renewal-Tracking-Spec.md` | B | Effective vs. renewal date logic, reminder rules, dashboard behavior. |
| 🔵 | `workstream-b/Enrollment-Workflow-Spec.md` | B | Activity log fields, statuses, transition rules. |
| 🔵 | `workstream-b/Zapier-Automation-List.md` | B | Which Zaps exist, what they do, what data they touch. |
| 🔵 | `user-guides/Commission-User-Guide.md` | C | How to enter, edit, and report on commissions. |
| 🔵 | `user-guides/Renewal-User-Guide.md` | C | How to track and act on upcoming and overdue renewals. |
| 🔵 | `user-guides/Enrollment-User-Guide.md` | C | How to log an enrollment from start to finish. |

---

## 8. Phase 4 Deliverables — Launch & Handoff

Built or finalized in Week 18. Together these make up the **handoff packet** that closes the engagement.

| Status | Document | Audience | Purpose |
|--------|----------|----------|---------|
| 🔵 | `handoff/Architecture-Diagram.md` | B | One-page system overview: Vercel ↔ Supabase ↔ Zapier ↔ SiteGround. |
| 🔵 | `handoff/Admin-Handoff-Guide.md` | C | One document the client's admin keeps as their reference. |
| 🔵 | `handoff/Credentials-Vault-Index.md` | C | What credentials exist, where they live, who has access. |
| 🔵 | `handoff/Change-Log.md` | B | Every Change Order signed during the project, with status. |
| 🔵 | `handoff/Production-Runbook.md` | I | What to do when X breaks. The successor developer's manual. |
| 🔵 | `handoff/30-Day-Support-Terms.md` | C | Scope and rules of the post-launch support window. |
| 🔵 | `handoff/Post-Launch-Retainer-Proposal.md` | C | Optional — turns the project into an ongoing relationship. |

---

## 9. Internal Project Operations

Documents Joel maintains for himself across the engagement.

| Status | Document | Purpose |
|--------|----------|---------|
| 🟡 | `internal/Project-Charter.md` | One-page internal summary: why we took it, what success looks like, what to walk away from. |
| 🟡 | `internal/Time-Tracking-Log.md` | Hours per phase, used to inform pricing of future projects. |
| 🟡 | `internal/Architecture-Decision-Records/` | One file per significant technical decision (ADR-001, ADR-002, …). |
| 🟡 | `internal/Lessons-Learned.md` | Built as we go, not at the end. Each entry has date, situation, lesson. |
| 🟡 | `internal/Client-Profile.md` | What we know about how the client communicates, decides, and operates. Updated weekly. |
| 🔵 | `internal/Post-Mortem.md` | Written in Week 19. What went well, what didn't, what to change for the next project. |

---

## 10. Quick Inventory by Phase

A reading order for the engagement.

**Before kickoff (Weeks 0):** ✅ files 01–06 plus 🟡 07 Kickoff Deck, 🟡 templates (Change Order, Weekly Update), 🟡 internal Project Charter and Client Profile.

**Phase 0 (Weeks 1–2):** Discovery Document, Data Dictionary, Role Matrix, HIPAA Decision, Integration Scope, Environment Checklist, Sample Data CSV Spec, Sprint Cadence SOP, Credentials Vault SOP.

**Phase 1 (Weeks 3–10):** Code Review SOP, Migration SOP, RLS Testing SOP, Deploy SOP, Bug Triage Flow, Feature Build Flow, Sign-Off Flow, Bug Report template, Sprint Demo Agenda template.

**Phase 2 (Weeks 11–12):** Admin User Guide, Agent User Guide, CSV Import-Export Guide, Birthday Report Guide, Pipeline Stage Guide, Admin and Agent training recordings.

**Phase 3 (Weeks 13–17):** Workstream B specs (Commission, Renewal, Enrollment, Zapier), corresponding user guides, Renewal Reminder Flow, Enrollment Activity Flow.

**Phase 4 (Week 18):** Architecture Diagram, Admin Handoff Guide, Credentials Vault Index, Change Log, Production Runbook, Launch-Day Runbook, 30-Day Support Terms.

**Post-engagement (Week 19+):** Post-Mortem, Lessons Learned final write-up, optional Retainer Proposal.

---

## 11. Build Priorities Right Now

The items marked 🟡 above are everything you need to be **ready to kick off**. In recommended build order:

1. **Kickoff Deck** (`07-Kickoff-Deck-Outline.md`) — needed for Week 1 meeting.
2. **Change Order template** — needed the first time the client asks "can you also…"
3. **Weekly Status Update template** — needed the first Friday of Week 1.
4. **Discovery Document template** — drives Weeks 1–2 of work and ends in Checkpoint 1.
5. **Sprint Cadence SOP** — internal, but written before sprints start.
6. **Credentials Vault SOP** — before any vendor account is provisioned.
7. **Code Review, Migration, RLS, Deploy SOPs** — before Week 3 build starts.

Templates and SOPs are written **once** and live forever. Phase deliverables are written **when their phase starts** so they reflect what was actually decided, not what we guessed in Week 0.
