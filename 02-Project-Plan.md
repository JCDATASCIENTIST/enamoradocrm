# Enamorado Insurance CRM — Full Project Plan

**Prepared by:** Joel Castillo (Developer/Consultant)
**Client:** Enamorado Insurance Company
**Project:** Custom CRM Web Application
**Plan Date:** May 26, 2026
**Companion Documents:** `01-Project-Scope.md`, `03-Timeline-and-Milestones.md`, `04-Risk-Register.md`

---

## 1. Executive Summary

This plan turns the approved scope into an executable delivery roadmap for a custom, HIPAA-aware CRM web application built on a modern Vercel + Supabase + GitHub stack. The project is structured as one unified initiative with two coordinated workstreams (Core CRM + Pipeline, and Commissions + Renewals + Enrollment) delivered over an estimated **18 working weeks** with clear client review gates, payment milestones, and an explicit change-control process to prevent scope creep.

The plan is organized so the client (Enamorado Insurance) always knows what is being built next, what they need to provide, when they will see working software, and when payments are due. The first usable build (Workstream A MVP) is targeted for end of Week 10, with full production launch by end of Week 18.

---

## 2. Engagement Model

Because this is a client engagement, the plan is structured around three layers: **build phases**, **payment milestones**, and **client checkpoints**. Each is independently trackable so neither side is surprised.

**Engagement type:** Fixed-scope, milestone-billed consulting engagement.
**Change control:** Anything outside the scope in `01-Project-Scope.md` requires a written change order with revised cost and timeline before work begins.
**Client responsibilities:** Timely review at each checkpoint, sample data, brand assets, domain access, signed BAA with Supabase if HIPAA is in play, and a single decision-maker for sign-off.

---

## 3. Phase Breakdown

The project is divided into five phases that flow sequentially but with overlap where useful. Workstreams A and B do not run in parallel from Day 1 — Workstream A produces a usable system first, then Workstream B layers on top of a stable foundation.

### Phase 0 — Discovery & Setup (Weeks 1–2)
The first two weeks establish the contractual, technical, and informational foundation. Without this, nothing downstream is safe. The work in this phase is deliberately light on code and heavy on alignment because every assumption made here ripples through the rest of the build. Activities include kickoff with the client, finalized data dictionary for all client and prospect fields, confirmation of user roles and permissions, HIPAA compliance posture decision (whether to operate inside Supabase's HIPAA add-on or define a non-PHI data boundary), domain access from SiteGround, GitHub repo creation, Vercel project setup, and Supabase project provisioning. The phase closes with a signed-off Discovery Document that updates and supplements the scope.

### Phase 1 — Workstream A Core Build (Weeks 3–10)
Phase 1 builds the foundational CRM: authentication, multi-user role management, the clients and prospects database, notes and issue tracking, follow-up history, filtering and CSV export, printable views, and the sales pipeline with stages New, Requested, In Progress, and Done. The phase is split into four two-week sprints, each closing with a working demo for the client. By end of Week 10, the client has a usable Workstream A MVP they can begin operating their daily workflow inside — this is intentional, because the longer real users wait to use a system, the more rework Workstream B feedback creates.

### Phase 2 — Workstream A Hardening & Client Training (Weeks 11–12)
Phase 2 is the bridge between "working software" and "production-ready software." This is where the system gets stress-tested, edge cases are filed and resolved, the team is trained, and a parallel-run period begins (the client uses the new CRM alongside whatever they use today, surfacing real-world friction before Workstream B begins). Training documentation and short Loom-style videos for each role are delivered in this phase.

### Phase 3 — Workstream B Build (Weeks 13–17)
With a stable Workstream A foundation and real user feedback in hand, Phase 3 layers in commission tracking by policy/carrier/writing agent, renewal tracking with effective and renewal date workflows, online enrollment activity recording, and the selected Zapier automations for reminders and notifications. This is the most carrier-specific and integration-heavy phase, so a portion of Week 13 is reserved for confirming integration scope with the client before committing builds.

### Phase 4 — Production Launch & Handoff (Week 18)
The final week covers production deployment to `crm.enamoradoinsurancecompany.com`, DNS cutover, final security review (RLS audit, key rotation, SSL enforcement check), final user acceptance testing, a launch-day support window, and the formal handoff packet (admin documentation, credential vault, runbook, and a 30-day post-launch support agreement).

---

## 4. Work Breakdown Structure

The WBS below lists every deliverable grouped by phase. Each item is small enough to estimate in days but large enough to be meaningful to the client.

### Phase 0 — Discovery & Setup
Kickoff meeting and stakeholder map; full data dictionary for clients, prospects, policies, and pipeline; user role and permission matrix; HIPAA posture decision and (if needed) Supabase BAA signing; GitHub repo, Vercel project, Supabase project provisioned; SiteGround DNS access confirmed; branding assets received from client; environment variables and secrets management plan; signed Discovery Document.

### Phase 1 — Workstream A Core Build
Authentication and session management (Supabase Auth); user invitations and role assignment (Admin, Agent, Read-only); database schema for clients, prospects, notes, follow-ups, pipeline stages, stage history, and audit log; row-level security policies for each table; client and prospect list views with filter (age, plan, Medicaid level, stage, assigned user, follow-up status); detail views with editable demographic, contact, plan, Medicare/Medicaid fields; notes and issues panel with full activity history; CSV export from any filtered list; print-friendly views; birthday report; sales pipeline kanban with drag-and-drop stage transitions; pipeline stage history log; sprint demo videos at end of Weeks 4, 6, 8, and 10.

### Phase 2 — Workstream A Hardening & Training
Bug triage and resolution from parallel-run period; performance pass on largest list views; backup and restore tested; admin training session (live, recorded); agent training session (live, recorded); written user guide; runbook for common admin tasks (resetting passwords, exporting data, restoring records).

### Phase 3 — Workstream B Build
Commission schema (policy, carrier, writing agent, commission status, payment date, amount); commission entry, edit, and reporting views; renewal schema (effective date, renewal date, status, reminder rules); renewal dashboard with upcoming, due, and overdue views; enrollment activity log with status tracking; Zapier automation hooks for follow-up reminders, renewal reminders, and new-prospect notifications; reporting views combining commission, renewal, and pipeline data; sprint demo videos at end of Weeks 14, 16, and 17.

### Phase 4 — Launch & Handoff
Pre-launch security audit (RLS test suite, key rotation, SSL enforcement, automated backup verification); UAT with client sign-off checklist; production DNS cutover to subdomain; launch-day on-call coverage (4 hours); handoff packet (architecture diagram, admin guide, credential vault index, change log, 30-day post-launch support terms).

---

## 5. Technical Architecture

The architecture is intentionally boring — proven tools wired together cleanly — because for a client engagement with sensitive data, the worst thing you can do is pick something exotic.

**Frontend:** Next.js (App Router) deployed on Vercel. Server components for data fetching, client components for interactive views (pipeline kanban, filters). Tailwind CSS for styling. Hosted on a project-specific Vercel team account so the client can take ownership at handoff.

**Backend:** Supabase project for Postgres database, authentication, storage (for documents and attachments), and Edge Functions where server-side logic is needed (e.g., scheduled renewal reminders if not using Zapier). Row-level security enforced on every table from day one — no exceptions.

**Source control:** GitHub repo under a client-named org or the consultant's org (decide in Phase 0). Branching: `main` → `develop` → feature branches. PR review required before merging to `main`. CI runs typecheck, lint, and basic tests on every PR.

**Automation:** Zapier handles selected reminders, outreach notifications, and integrations with external enrollment tools. Zapier's task-based billing is owned by the client, not the consultant.

**Domain & DNS:** `crm.enamoradoinsurancecompany.com` configured via SiteGround DNS pointing to Vercel.

**Compliance posture:** If Medicare or Medicaid identifiers will be stored, the project must operate under Supabase's HIPAA-compliant configuration with a signed BAA. The HIPAA decision is finalized in Phase 0 and shapes everything downstream — database design, network policies, audit logging, and Zapier data flow.

---

## 6. Team & Roles

This is a solo-developer engagement unless otherwise noted. The roles below clarify who does what.

**Consultant (Joel):** All technical work, architecture decisions, sprint demos, training delivery, and primary client communication.

**Client decision-maker:** Single named point of contact at Enamorado Insurance who can approve scope, sign off on milestones, and route operational input from agency staff. This person must be identified in Phase 0.

**Client SMEs:** Agency staff (agents, admins) who provide field definitions, workflow input, and feedback during demos. They do not approve scope — they inform it.

**Outside vendors:** Supabase (database/auth), Vercel (hosting), SiteGround (domain), Zapier (automation). All billed to the client directly, not marked up through the consultant.

---

## 7. Client Checkpoints & Acceptance

The client reviews the project at six points. At each, the consultant presents working software or documentation, the client responds with sign-off or written feedback within five business days, and unresolved feedback becomes a backlog item for the next sprint.

**Checkpoint 1 — End of Week 2:** Discovery Document signed off. This locks the data dictionary, user roles, and HIPAA posture. Payment milestone 1 due.

**Checkpoint 2 — End of Week 6:** Workstream A mid-build demo. Auth, clients/prospects database, basic notes, and the start of the pipeline are working. The client tests them with sample data. Payment milestone 2 due.

**Checkpoint 3 — End of Week 10:** Workstream A MVP demo. Full Workstream A is feature-complete on a staging environment. Client begins parallel-run period. Payment milestone 3 due.

**Checkpoint 4 — End of Week 12:** Workstream A production-ready sign-off. Training complete, parallel-run feedback addressed.

**Checkpoint 5 — End of Week 17:** Workstream B feature-complete demo. Commissions, renewals, enrollment, and automations on staging. Payment milestone 4 due.

**Checkpoint 6 — End of Week 18:** Production launch sign-off. Final payment milestone due. 30-day post-launch support window begins.

---

## 8. Payment Milestones

The project is billed against five milestones tied to delivery, not time. This protects both sides: the client never pays for work not yet delivered, and the consultant is never asked to build past a checkpoint without payment.

**Milestone 1 — Project Start / Discovery Sign-off (20%):** Due on signature of the engagement agreement and Discovery Document.

**Milestone 2 — Workstream A Mid-Build Acceptance (20%):** Due at Checkpoint 2.

**Milestone 3 — Workstream A MVP Acceptance (20%):** Due at Checkpoint 3.

**Milestone 4 — Workstream B Feature-Complete Acceptance (25%):** Due at Checkpoint 5.

**Milestone 5 — Production Launch & Handoff (15%):** Due at Checkpoint 6.

The exact dollar values for these milestones live in the engagement agreement, not in this plan, so this document remains useful even if pricing is renegotiated.

---

## 9. Communication Plan

Predictable communication is more important than frequent communication. The cadence is:

**Weekly written update — every Friday:** A short status note covering what was completed this week, what's planned next week, anything blocking progress, and any decisions the client needs to make. Sent by email or whichever shared channel is agreed upon in Phase 0.

**Sprint demo — every two weeks:** A 30-minute live walkthrough (recorded) of new functionality with time for client questions. The recording is sent so absent stakeholders can watch later.

**Ad-hoc requests:** Client emails go to a single inbox and are responded to within one business day. Anything that takes longer than 30 minutes to answer becomes a logged task, not a chat thread.

**Change requests:** Anything outside scope gets a written change order with revised cost and timeline. Verbal scope changes are not honored — this rule protects both sides equally.

---

## 10. Scope Exclusions

To prevent the most common kinds of scope creep on insurance CRM projects, the following are explicitly **out of scope** unless added via change order:

Mobile app (the web app is responsive but no native iOS/Android build); SMS or email sending infrastructure beyond what Zapier provides; carrier API integrations beyond a single confirmed integration in Phase 0; data migration from existing systems beyond a one-time CSV import of cleaned client and prospect lists; custom branding work beyond applying provided logo and color tokens; AI features, document generation, or e-signature flows; full call recording or VOIP integration; multi-tenant or multi-agency support — this CRM is for one agency.

---

## 11. Assumptions

This plan assumes the following hold true. If any do not, the timeline and cost change. The assumptions are repeated in the engagement agreement so they're enforceable.

The client provides a single decision-maker available within one business day for blocking questions; the client provides clean source data for the one-time import (deduplicated, in CSV format, with consistent field names); a Supabase BAA is signed by end of Phase 0 if Medicare/Medicaid PHI will be stored; the client owns and provides access to the domain and DNS; the client pays Supabase, Vercel, Zapier, and SiteGround invoices directly; the consultant is the sole developer for the duration of the project; the agreed feature set in `01-Project-Scope.md` does not change without a written change order.

---

## 12. Post-Launch Support

The standard engagement includes **30 calendar days of post-launch support** beginning at Checkpoint 6. Support covers bug fixes for in-scope functionality, minor adjustments based on real-world use (up to 8 hours of work), and one knowledge-transfer session for any incoming developer or admin.

After 30 days, ongoing support is available on a monthly retainer or hourly basis — terms negotiated separately. This boundary is critical because without it, the project never ends and neither side knows what they owe each other.

---

## 13. How to Use This Plan

This plan is the master reference for the engagement. The Discovery Document refines it, the Timeline tracker (`03-Timeline-and-Milestones.md`) operationalizes it week by week, and the Risk Register (`04-Risk-Register.md`) tracks what could throw it off course. Weekly Friday updates reference this plan's section numbers when reporting progress, so the client always knows where the project sits inside the overall structure.

Any conflict between this plan and verbal commitments is resolved in favor of this plan unless updated via written change order.
