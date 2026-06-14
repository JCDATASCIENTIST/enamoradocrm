# Statement of Work
## Enamorado Insurance CRM — Custom Web Application

**Consultant ("Provider"):** Joel Castillo
**Client:** Enamorado Insurance Company
**Effective Date:** _____________________ (date of last signature below)
**SOW Version:** 1.0
**Governing Documents:** This SOW incorporates by reference `01-Project-Scope.md`, `02-Project-Plan.md`, `03-Timeline-and-Milestones.md`, and `04-Risk-Register.md`.

> **Note to Joel:** This SOW is drafted to be signature-ready, but you should have a lawyer review it once before sending. The clauses are written in plain language for client readability — your lawyer may want to tighten specific phrases. Replace bracketed `[…]` placeholders before sending.

---

## 1. Purpose

This Statement of Work governs the design, development, deployment, and delivery of a custom CRM web application for Enamorado Insurance Company. The CRM will be built and delivered as a single project organized into two workstreams (Core CRM + Pipeline; Commissions + Renewals + Enrollment) per the approved scope.

---

## 2. Services & Deliverables

Provider will deliver the services and deliverables defined in `02-Project-Plan.md`, summarized as:

A secure, multi-user CRM web application; client and prospect record management; sales pipeline with stages New, Requested, In Progress, and Done; notes, issues, and follow-up tracking; filtering, print views, and CSV exports; commission tracking and reporting; renewal tracking with reminder workflows; enrollment workflow support; selected Zapier automations; production deployment to `crm.enamoradoinsurancecompany.com`; written admin and user documentation; live training sessions (recorded); and a 30-day post-launch support window.

Anything not listed in `01-Project-Scope.md` is out of scope and requires a written Change Order (see §10).

---

## 3. Timeline

The estimated duration is **eighteen (18) working weeks** from the Effective Date, per `03-Timeline-and-Milestones.md`. The timeline assumes Client meets the dependencies in §6. Slippage caused by Client-side delays extends the schedule on a day-for-day basis.

---

## 4. Fees & Payment Schedule

**Total project fee:** $[TOTAL] USD, billed against the milestones below.

| # | Milestone | % | Amount (USD) | Trigger |
|---|-----------|---|--------------|---------|
| 1 | Discovery Sign-off | 20% | $[AMT_1] | Client signs Discovery Document (end of Week 2) |
| 2 | Workstream A Mid-Build | 20% | $[AMT_2] | Checkpoint 2 acceptance (end of Week 6) |
| 3 | Workstream A MVP | 20% | $[AMT_3] | Checkpoint 3 acceptance (end of Week 10) |
| 4 | Workstream B Feature-Complete | 25% | $[AMT_4] | Checkpoint 5 acceptance (end of Week 17) |
| 5 | Production Launch & Handoff | 15% | $[AMT_5] | Checkpoint 6 acceptance (end of Week 18) |

**Invoicing:** Invoices are issued on the milestone trigger date and are due **net 10**. Late invoices accrue 1.5% interest per month after day 30. Work on the next phase begins when the prior invoice clears.

**Out-of-pocket vendor fees** (Supabase, Vercel, Zapier, SiteGround, third-party APIs) are paid by Client directly to the vendors. Provider will not mark up vendor costs.

**Expenses** over $100 are pre-approved in writing by Client.

---

## 5. Payment Terms

Payment is by ACH, wire transfer, or Stripe link. Credit card payments incur a 3% processing surcharge. Returned payments incur a $35 fee. Provider may pause work after any invoice is 14 days overdue and may terminate per §13 after 30 days overdue.

---

## 6. Client Responsibilities

Client agrees to provide, within the dates listed in `03-Timeline-and-Milestones.md`:

A single named Decision-Maker with authority to approve scope and sign off on milestones; a cleaned CSV of existing client and prospect records for one-time import; brand assets (logo, color tokens) at kickoff; domain and DNS access via SiteGround; a signed Supabase Business Associate Agreement if Medicare or Medicaid PHI will be stored; payment of vendor invoices (Supabase, Vercel, Zapier, SiteGround) directly to those vendors; UAT participants for Week 18 acceptance testing; written response to sign-off requests within **five (5) business days**.

A Client-side delay on any of the above pauses the project clock per §3.

---

## 7. Provider Responsibilities

Provider agrees to perform the services per `02-Project-Plan.md`, maintain weekly written communication every Friday, deliver sprint demos every two weeks, store credentials in a vault accessible to Client, commit code daily to GitHub, follow the security and HIPAA posture decided in Phase 0, and complete the 30-day post-launch support window.

---

## 8. Acceptance

Each milestone deliverable is considered accepted when Client signs the corresponding acceptance checklist or, if no written response is received within **five (5) business days** of delivery, when the response window closes. Client may reject a deliverable in writing within the same window, in which case Provider will remediate at no additional cost provided the rejection is for failure to meet the agreed specification. Rejection for reasons outside the agreed specification triggers a Change Order under §10.

---

## 9. Intellectual Property

Upon receipt of full payment for each milestone, Provider assigns to Client all rights, title, and interest in the deliverables produced under that milestone, including the application source code, database schema, configuration, and written documentation specifically authored for this engagement. Provider retains ownership of (a) any pre-existing tools, libraries, or templates brought to the engagement, (b) general know-how and methodology, and (c) any open-source or third-party components incorporated under their original licenses.

Provider may use anonymized, non-confidential descriptions of the work for portfolio and marketing purposes (e.g., "built a custom CRM for an independent insurance agency") unless Client objects in writing.

---

## 10. Change Control

Any addition, removal, or material modification to the scope in `01-Project-Scope.md` requires a written Change Order signed by both parties **before** the change is implemented. Each Change Order will specify the new work, the revised cost, and the revised timeline. Verbal scope changes are not binding. Use the Change Order template in `templates/Change-Order-Template.md`.

---

## 11. Confidentiality

Each party will protect the other's confidential information with at least the same care it uses to protect its own confidential information, and not less than reasonable care. Confidential information includes business records, client data, source code, financial details, and any information marked confidential or reasonably understood to be confidential. This obligation survives termination of this SOW for three (3) years, except that confidential information constituting PHI is protected indefinitely under the applicable BAA and HIPAA rules.

---

## 12. Data Protection & HIPAA

Provider will follow the data protection posture set in the Phase 0 Discovery Document. If the system will store Protected Health Information, Provider will operate inside Supabase's HIPAA-compliant configuration under a signed Business Associate Agreement, enable audit logging, enforce SSL on all connections, implement row-level security on all tables, and limit Provider's access to the minimum necessary to deliver services. Client remains the Covered Entity responsible for HIPAA compliance overall.

---

## 13. Termination

Either party may terminate this SOW for material breach with **fourteen (14) days** written notice and an opportunity to cure. Either party may terminate for convenience with **thirty (30) days** written notice. On termination, Client pays for all work completed and accepted through the termination date plus any work in progress prorated to the date of notice, and Provider delivers all completed work product and credentials to Client within ten (10) business days.

If termination occurs because Client failed to meet its responsibilities under §6 (including non-payment), Provider retains the milestone payment for the most recently completed milestone and is not obligated to remediate subsequent issues without further compensation.

---

## 14. Warranty

Provider warrants that the deliverables will substantially conform to the specifications in `01-Project-Scope.md` and `02-Project-Plan.md` for a period of **thirty (30) days** following production launch (Checkpoint 6). During this period, Provider will fix defects in the delivered software at no additional cost. The warranty does not cover (a) modifications made by anyone other than Provider, (b) issues caused by Client misuse, (c) issues caused by third-party services, or (d) requests for new functionality not specified in the scope.

After the 30-day warranty period, ongoing support is available on a monthly retainer or hourly basis under a separate agreement.

---

## 15. Limitation of Liability

Provider's total cumulative liability under this SOW will not exceed the total fees paid by Client to Provider under this SOW. Neither party will be liable for indirect, incidental, consequential, special, or punitive damages, including lost profits, even if advised of the possibility. This limitation does not apply to (a) breaches of confidentiality, (b) IP infringement, or (c) gross negligence or willful misconduct.

---

## 16. Independent Contractor

Provider is an independent contractor, not an employee, agent, partner, or joint venturer of Client. Provider is responsible for Provider's own taxes, insurance, equipment, and benefits. Nothing in this SOW creates an employment relationship.

---

## 17. Insurance

Provider [maintains / will maintain prior to project start] professional liability insurance with limits of not less than $[AMOUNT] per occurrence and $[AMOUNT] aggregate. Certificate of insurance available on request.

---

## 18. Governing Law & Dispute Resolution

This SOW is governed by the laws of the State of [STATE] without regard to its conflict-of-laws principles. The parties will first attempt to resolve any dispute in good faith through direct negotiation. If unresolved within thirty (30) days, the dispute will be submitted to binding arbitration administered by [American Arbitration Association / JAMS] under its commercial rules, with arbitration to take place in [CITY, STATE]. Each party bears its own costs and attorneys' fees unless the arbitrator finds otherwise.

---

## 19. Miscellaneous

**Entire agreement:** This SOW, together with the documents it incorporates by reference, is the entire agreement between the parties on its subject matter and supersedes all prior discussions.
**Amendments:** Amendments require a writing signed by both parties.
**Notices:** Notices are effective when delivered by email to the addresses listed below.
**Severability:** If any provision is unenforceable, the remainder remains in effect.
**No assignment:** Neither party may assign this SOW without the other's written consent, except to a successor by merger or acquisition.
**Counterparts:** This SOW may be signed in counterparts, including electronic signatures, each of which is an original.

---

## 20. Signatures

**Provider — Joel Castillo**
Signature: __________________________________
Printed Name: Joel Castillo
Title: Owner / Consultant
Date: _____________________
Email: joelcastillomarketingexpert@gmail.com

**Client — Enamorado Insurance Company**
Signature: __________________________________
Printed Name: _____________________________
Title: _____________________________________
Date: _____________________
Email: _____________________________________

---

## Exhibit A — Incorporated Documents

The following documents are incorporated into this SOW by reference and control over this SOW only if explicitly stated:

1. `01-Project-Scope.md` — defines the functional scope.
2. `02-Project-Plan.md` — defines the phases, deliverables, communication plan, and exclusions.
3. `03-Timeline-and-Milestones.md` — defines the week-by-week schedule and dependencies.
4. `04-Risk-Register.md` — informational; does not modify obligations.

If a conflict arises between this SOW and any incorporated document, this SOW controls except for the technical scope, where `01-Project-Scope.md` controls.
