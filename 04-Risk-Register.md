# Enamorado Insurance CRM — Risk Register & Assumptions

**Companion to:** `02-Project-Plan.md`
**Reviewed:** Weekly during Friday status update
**Owner:** Consultant (Joel) with client decision-maker as co-owner on client-side risks

---

## How This Document Works

Each risk has a severity (impact if it occurs) and a likelihood (probability before mitigation). The product of those drives priority. Mitigations are concrete actions taken now to lower likelihood, and contingencies are what we do if it happens anyway. Risks are revisited every Friday — closed risks stay in the log with a resolution note so the history is preserved.

---

## Risk 1 — HIPAA / PHI Compliance Gap

**Severity:** High. Storing Medicare or Medicaid identifiers without proper safeguards exposes the agency to regulatory penalties and the consultant to reputational damage.

**Likelihood (pre-mitigation):** Medium. The default Supabase configuration is not HIPAA-compliant; getting it wrong is easy.

**Mitigation:** Make the HIPAA posture decision the first major Phase 0 deliverable. If PHI will be stored, sign the Supabase BAA, enable Supabase's HIPAA project configuration, enforce SSL on every connection, restrict network access where supported, enable audit logging from Day 1, and document data flows through Zapier explicitly. If PHI will not be stored, define an explicit data-classification boundary (no SSNs, no Medicare IDs, only plan names and last-4 identifiers) and document it in the Discovery Document.

**Contingency:** If a HIPAA gap is discovered mid-build, pause Workstream B and remediate before resuming. Document the gap and remediation steps in the change log.

---

## Risk 2 — Scope Creep

**Severity:** High. Insurance operations have endless edge cases ("can it also track…?"); without a formal change process, a 4-month project becomes an 8-month project at the original price.

**Likelihood:** High. This is the most common failure mode on this type of engagement.

**Mitigation:** Anchor every conversation to `01-Project-Scope.md`. Repeat the change-control rule at kickoff, in the engagement agreement, and in the weekly Friday update template. Anything outside scope gets a written change order with revised cost and timeline before any work begins. Saying "yes, let's add that to a change order" is the answer — never "yes, I'll throw it in."

**Contingency:** If creep is already in flight, pause it, write the change order retroactively, and renegotiate the affected milestone. Eat the loss once, never twice.

---

## Risk 3 — Slow Client Sign-Offs

**Severity:** Medium-High. Every day a sign-off is delayed is a day the next phase cannot start, which compounds toward launch.

**Likelihood:** Medium. Small agencies often have one busy decision-maker who handles client renewals before answering project questions.

**Mitigation:** Identify a single named decision-maker in Phase 0; build the 5-business-day response SLA into the engagement agreement; send sign-off requests with a clear deadline and a one-line description of what happens if they slip ("Sign by Friday or Sprint 3 starts on Monday in the dark"); always provide a recommended answer with each question to make sign-off a yes/no rather than a research project.

**Contingency:** Pause work and pause the project clock when a sign-off slips beyond 5 business days. Resume both when the sign-off arrives. Send a written notice of pause at day 6 so it's documented.

---

## Risk 4 — Dirty Source Data for Migration

**Severity:** Medium. A messy CSV with duplicates, inconsistent field names, and free-text plan names can turn a one-day import into a one-week cleanup.

**Likelihood:** High. Existing client data almost always needs cleanup before import.

**Mitigation:** Define CSV expectations in the data dictionary during Phase 0 (column names, formats, deduplication, required fields). Provide the client with a template spreadsheet. Run a small sample import in Week 2 to surface format problems early. The contract states the consultant imports one cleaned CSV; cleanup beyond minor adjustments is billable.

**Contingency:** If data is dirty at import time, deliver the import on a best-effort basis with a written list of records that could not be imported and why. Offer cleanup as a change order.

---

## Risk 5 — Carrier/Enrollment Integration Uncertainty

**Severity:** Medium-High. If a Workstream B integration target turns out to require expensive API access, manual file uploads, or a partner agreement, the integration may be impossible within the original scope.

**Likelihood:** Medium. Many enrollment systems do not expose modern APIs.

**Mitigation:** Phase 0 includes an integration-scope conversation. The Discovery Document names at most one in-scope carrier or enrollment-tool integration; any others are explicit change orders. Week 13 begins with re-confirmation of integration scope before commitment.

**Contingency:** If the integration target turns out to be unfeasible, pivot to a manual workflow (CSV upload, copy-paste from carrier portal into CRM) and document the limitation. The client decides whether to pursue the integration as a separate paid project.

---

## Risk 6 — Multi-User Permission Bugs Leak Sensitive Data

**Severity:** Critical. A read-only user seeing data they shouldn't is a security incident with regulatory exposure.

**Likelihood:** Medium. RLS is powerful but easy to get wrong, especially on join queries.

**Mitigation:** Author RLS policies on Day 1 of each schema change, not at the end. Build an automated RLS test suite — every table gets a test that runs a query as each role and asserts the expected rows are visible. Run the test suite on every PR. Final Phase 4 security audit re-runs the suite explicitly.

**Contingency:** If a leak is found in production, rotate keys, audit access logs, notify the client decision-maker within one business day, file an incident write-up, and remediate before re-enabling affected functionality.

---

## Risk 7 — Vendor Outage or Pricing Change

**Severity:** Low-Medium. Supabase, Vercel, or Zapier could have outages or change pricing during the project.

**Likelihood:** Low for outages affecting the timeline, Medium for pricing changes over the project life.

**Mitigation:** The architecture deliberately avoids exotic vendors. The client owns all vendor accounts and pays them directly — pricing changes are between the client and the vendor. The consultant monitors vendor status pages during build.

**Contingency:** If a vendor outage blocks work, log the time, notify the client, and resume when the vendor recovers. Pricing changes are communicated to the client within 5 business days of discovery.

---

## Risk 8 — Single-Developer Bus Factor

**Severity:** High. Solo engagements have one person on the critical path for everything.

**Likelihood:** Low.

**Mitigation:** Daily commits to GitHub so progress is recoverable; runbooks and admin documentation drafted during Phase 2 (not Phase 4) so a successor could pick up; credentials stored in a shared vault accessible to the client decision-maker; weekly Friday updates create a paper trail of the current state of work.

**Contingency:** If the consultant becomes unavailable, the client has GitHub, Vercel, Supabase, and Zapier access plus all written documentation needed to bring in a replacement developer.

---

## Risk 9 — Insurance Domain Edge Cases Discovered Late

**Severity:** Medium. Insurance has carrier-specific rules, state-by-state variation, and quirks (e.g., Medicare Advantage renewal windows, AEP/OEP/SEP timing).

**Likelihood:** High. No data dictionary catches everything.

**Mitigation:** The parallel-run period in Phase 2 exists specifically to surface domain edge cases before Workstream B is built on top of them. Encourage agents to log every "the system can't do X" moment during Week 11.

**Contingency:** Triage discovered edge cases into "must fix before launch" (handled in Phase 2/3 within existing scope where reasonable) and "post-launch change order" (handled after Week 18).

---

## Risk 10 — Launch-Day Surprises

**Severity:** Medium-High. DNS cutover, real-traffic load, and last-minute "wait we forgot to tell you about…" moments are common.

**Likelihood:** Medium.

**Mitigation:** Launch on a Tuesday or Wednesday (not Friday), do a dry-run DNS cutover the prior week with a temporary hostname, schedule the 4-hour on-call window, and have a rollback plan documented before launch.

**Contingency:** If launch fails, roll back DNS to the prior state, notify the client decision-maker, root-cause the failure, fix on staging, re-test, and re-launch within one business day.

---

## Open Assumptions to Validate

These are repeated from `02-Project-Plan.md` because they're also risk drivers. They must be confirmed in writing during Phase 0:

A single decision-maker is available within one business day for blocking questions; clean source data will be provided in CSV; Supabase BAA will be signed if PHI is in scope; the client owns and provides DNS access at SiteGround; the client pays vendor invoices directly; the consultant is the sole developer for the duration; the agreed feature set does not change without a written change order; the client commits UAT participants for Week 18.

If any of these assumptions does not hold, the corresponding risk above moves up in priority and the plan adjusts accordingly.

---

## Review Cadence

The risk register is reviewed every Friday during the weekly status update. New risks are added when discovered, closed risks stay in the log with a resolution note, and the top three active risks are surfaced in every Friday update so the client sees them, too.
