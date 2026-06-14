# Discovery Document — Enamorado Insurance CRM

**Status:** ☐ Draft  ☐ Under Review  ☐ Approved (Checkpoint 1 sign-off)
**Phase:** 0 — Discovery & Setup
**Target sign-off:** End of Week 2
**Triggers:** Milestone 1 invoice (20% of total fee).

> This document is the foundation of the build. Once signed, anything not captured here that materially affects the system requires a Change Order. Fill out every section. Where a decision can't be made yet, mark it `OPEN` with a target resolution date — but no OPEN items survive sign-off.

---

## 1. Project Identity

**Client legal name:** _____________________________
**Operating name (if different):** _____________________________
**Subdomain for production CRM:** `crm.enamoradoinsurancecompany.com`
**Project effective date:** _____________________
**Target launch date:** _____________________ (Week 18)

---

## 2. Decision-Maker & SMEs

The Decision-Maker is the single person who can approve scope and sign off on milestones. They cannot be more than one person.

| Role | Name | Email | Phone | Authority |
|------|------|-------|-------|-----------|
| Decision-Maker | | | | Approves scope, sign-offs, payments |
| Admin SME | | | | Inputs on data structure, daily workflow |
| Agent SME | | | | Inputs on agent-facing workflow |
| Backup Decision-Maker (if primary unreachable) | | | | Same authority as primary |

---

## 3. Communication Preferences

**Primary channel for weekly updates:** ☐ Email  ☐ Slack  ☐ Other: _____
**Preferred meeting platform:** ☐ Zoom  ☐ Google Meet  ☐ Other: _____
**Preferred day/time for sprint demos:** _____________________
**Acceptable response window for non-urgent emails:** _____ business days
**Emergency channel for production issues (post-launch):** _____________________

---

## 4. HIPAA Posture Decision

This is the most consequential decision in Phase 0. **Choose one of the two paths below.**

### ☐ Path A — System WILL store PHI (Medicare/Medicaid IDs, full health info)

**Required actions:**
- Supabase Business Associate Agreement signed by ____________ (date).
- Supabase HIPAA project configuration enabled.
- SSL enforced on all connections.
- Audit logging enabled from Day 1.
- Documented data flow for Zapier — only non-PHI fields touch Zapier, OR Zapier BAA is also signed and PHI flows are documented.
- Backups retained per HIPAA retention requirements.

### ☐ Path B — System will NOT store PHI

**Explicit data boundary (what is NOT allowed in the system):**
- No Social Security Numbers.
- No full Medicare Beneficiary Identifiers (MBIs).
- No full Medicaid IDs.
- No medical conditions, diagnoses, or treatment information.
- _____________________________________________ (add more if applicable)

**What CAN be stored:** demographic info (name, DOB, address), contact info, plan name and carrier, last-4-digit identifier references, sales pipeline status, notes that do not contain PHI.

**How the boundary is enforced:**
- Field-level constraints in the database schema.
- UI guidance in note fields.
- Admin training (Phase 2).

---

## 5. User Roles & Permissions Matrix

For each role, define what the role can do in each major area. Use ✅ (full), 👁️ (read-only), ❌ (no access).

| Area | Admin | Agent | Read-Only |
|------|-------|-------|-----------|
| Invite users / change roles | | | |
| View all clients | | | |
| Edit any client | | | |
| Edit own assigned clients | | | |
| View all prospects | | | |
| Edit any prospect | | | |
| Move pipeline stages | | | |
| View commissions | | | |
| Edit commissions | | | |
| View renewals | | | |
| Edit renewals | | | |
| Run reports | | | |
| Export CSVs | | | |
| View audit log | | | |
| Delete records | | | |

**Roles needed beyond these three (if any):** _____________________

---

## 6. Data Dictionary — Client & Prospect Records

For each field, capture the name, type, whether it's required, who can edit it, and any validation rules.

### Demographic
| Field | Type | Required | Editable By | Validation / Notes |
|-------|------|----------|-------------|--------------------|
| First name | text | ✅ | Admin/Agent | |
| Last name | text | ✅ | Admin/Agent | |
| Preferred name | text | ❌ | Admin/Agent | |
| Date of birth | date | ✅ | Admin/Agent | Drives birthday report |
| Gender | enum | ❌ | Admin/Agent | List: _____ |
| Language preference | enum | ❌ | Admin/Agent | List: _____ |

### Contact
| Field | Type | Required | Editable By | Validation / Notes |
|-------|------|----------|-------------|--------------------|
| Primary phone | text | ✅ | Admin/Agent | |
| Secondary phone | text | ❌ | Admin/Agent | |
| Email | text | ❌ | Admin/Agent | |
| Address line 1 | text | ❌ | Admin/Agent | |
| Address line 2 | text | ❌ | Admin/Agent | |
| City / State / ZIP | text | ❌ | Admin/Agent | |
| Preferred contact method | enum | ❌ | Admin/Agent | |

### Plan & Insurance
| Field | Type | Required | Editable By | Validation / Notes |
|-------|------|----------|-------------|--------------------|
| Carrier | enum | ❌ | Admin/Agent | List managed in Settings |
| Plan name | text | ❌ | Admin/Agent | |
| Plan type | enum | ❌ | Admin/Agent | List: Medicare Advantage / Medicare Supplement / Part D / Medicaid / Other |
| Medicaid level | enum | ❌ | Admin/Agent | List: _____ |
| Effective date | date | ❌ | Admin/Agent | |
| Renewal date | date | ❌ | Admin/Agent | Used by Workstream B |
| Member ID (last 4 only if Path B) | text | ❌ | Admin/Agent | |

### Pipeline & Status
| Field | Type | Required | Editable By | Validation / Notes |
|-------|------|----------|-------------|--------------------|
| Pipeline stage | enum | ✅ | Admin/Agent | New / Requested / In Progress / Done |
| Assigned user | user FK | ✅ | Admin (only) | |
| Follow-up date | date | ❌ | Admin/Agent | Drives daily task list |
| Follow-up status | enum | ❌ | Admin/Agent | Pending / Completed / Skipped |

### System
| Field | Type | Required | Editable By | Validation / Notes |
|-------|------|----------|-------------|--------------------|
| Created at | timestamp | auto | system | |
| Updated at | timestamp | auto | system | |
| Created by | user FK | auto | system | |
| Last updated by | user FK | auto | system | |

**Custom fields requested by client:** _______________________________________________

---

## 7. Sales Pipeline Definition

**Stages (fixed, in order):** New → Requested → In Progress → Done.

**Rules:**
- Who can move records between stages: _____
- Can records skip stages? ☐ Yes  ☐ No
- Can records move backward? ☐ Yes  ☐ No
- Stage history: every transition is logged (timestamp + user).
- Automation triggers per stage entry: _____________________

---

## 8. Integration Scope (Workstream B)

**Carrier or enrollment-tool integration in scope (NAME ONE OR NONE):**
- Name: _____________________________
- Integration type: ☐ API  ☐ CSV import  ☐ Browser-based manual  ☐ Other: _____
- Data flowing IN to CRM: _____________________
- Data flowing OUT to integration: _____________________
- Authentication method available: _____________________

**Out of integration scope (additional carriers / tools we may want later):** _____________________

---

## 9. CSV Import Spec (one-time migration)

**Files to be imported:** _____ (count)
**Source system:** _____________________
**Estimated record count:** _____________________
**Columns provided by client (attach the CSV header as Appendix A):** _____________________
**Mapping decisions:** _____________________
**Cleanup expected before import:** _____________________
**Date of test import (Week 2):** _____________________

---

## 10. Branding & Visual Identity

**Logo file(s) received:** ☐ Yes (location: _____)  ☐ Pending
**Primary brand color (hex):** _____
**Secondary brand color (hex):** _____
**Font preference (if any):** _____________________
**Tone preference for system copy (formal / friendly / minimal):** _____

---

## 11. Vendor Account Status

| Vendor | Account Status | Account Owner | Notes |
|--------|----------------|---------------|-------|
| GitHub | ☐ Created | | Org name: _____ |
| Vercel | ☐ Created | | Project name: _____ |
| Supabase | ☐ Created | | Project ref: _____, BAA: ☐ Signed |
| Zapier | ☐ Plan: _____ | | Billing to client directly |
| SiteGround | ☐ Access confirmed | | DNS edit access to: _____ |

---

## 12. Open Questions

Any decision that can't be made today goes here with an owner and a target resolution date. These must be resolved before sign-off.

| # | Question | Owner | Target Resolution |
|---|----------|-------|-------------------|
| 1 | | | |
| 2 | | | |

---

## 13. Sign-Off

By signing below, the parties confirm the contents of this Discovery Document accurately reflect the agreed direction for the build. Items not captured here are out of scope and require a Change Order.

**Provider — Joel Castillo**
Signature: __________________________________
Date: _____________________

**Client — Enamorado Insurance Company (Decision-Maker)**
Signature: __________________________________
Printed Name: _____________________________
Date: _____________________

---

## Appendix A — Sample CSV Header
(Paste the raw CSV header from the client's source export here so future readers can see the migration starting point.)

## Appendix B — Data Flow Diagram (PHI path)
(If Path A, attach or link a diagram showing exactly how PHI enters and leaves the system.)
