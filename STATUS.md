# Project status — Enamorado Insurance CRM

**Last updated:** 2026-06-14 (agent context: CLAUDE.md + .agents/skills)

## Done

- **Agent context bundle:** `.agents/skills/` (6 skills from skills.zip), root `CLAUDE.md`, `AGENTS.md`, `.agents/README.md`; Happy Capy prompt now points to CLAUDE.md

- Synced full project tree to GitHub repo `JCDATASCIENTIST/enamoradocrm`
- Root README, `.gitignore`, repo layout with `app/` as Vercel root
- Happy Capy prompt pack: `happycapy/MASTER-PROMPT.md`, sessions, automations
- Workflow runbooks: `workflows/*.md` (5 flows + COVERAGE-GAP)
- Extended `workstream-b/Zapier-Automation-List.md` with Zap recipes and tests
- Launch checklists: Agent Monday Morning, Admin Onboarding
- Fixed `assigned_to_name` in new prospect Zapier payload (`app/lib/contacts/actions.ts`)

### 2026-06-14 v1 polish pass

- **Domain fix:** `enamoradoinsurancecompany.com` → `enamoradoinsurancefl.com` across 15 files (every doc, website config, deployment guide, Zap example, handoff checklist, sample URL in flows). The repo and the kickoff-meeting transcript now agree.
- **Brand alt-text fix:** "Enamorado Health Services" → "Enamorado Insurance" in the CRM sidebar, mobile nav, and login page logo `alt`.
- **Contact detail page now shows related work:**
  - Inline **Enrollments** panel (with quick-add form for agents/admins)
  - Inline **Commissions** panel (with `+ New` deep-link to `/commissions/new?contact_id=…`)
  - Each panel shows a "See all →" link when more records exist than the 20-row cap
- **Audit log now shows the diff** for `update` rows — changed fields with old/new values, capped at 6 fields per row. Path B-safe (only field names and stringified values; no PHI).
- **Pipeline "Overdue" badge** now uses `APP_TZ` (was browser TZ) so it matches the Follow-ups page and the cron.
- **Error / 404 pages:** added `app/app/(app)/error.tsx`, `app/app/(app)/not-found.tsx`, and `app/app/global-error.tsx` so a bad contact ID no longer throws an unhandled error.
- **Commissions list** now shows a "Writing agent" column.
- **New commission page** reads `?contact_id=…` and pre-selects the contact.
- **Dashboard greeting** no longer leaks the email local-part (`profile.email.split('@')[0]` fallback removed).
- **Website contact form** is now a working server action: validates input, rejects obvious PHI (SSN/MBI patterns), POSTs to a `WEBSITE_CONTACT_WEBHOOK` Zapier Catch-Hook if set, or returns success silently if not. No more `action="#"` placeholder.
- **Follow-ups helper** simplified (single `Intl.DateTimeFormat` call instead of three).

## In progress

- **None.** v1 polish pass is complete and green.

## Build verification (2026-06-14)

- `npm run typecheck` (CRM) — pass
- `npm run typecheck` (website) — pass
- `npm run build` (CRM) — pass (contact detail bundle grew 2.82 kB → 4.4 kB; expected, due to inline enrollments/commissions panels)
- `npm run build` (website) — pass (contact page bundle grew 142 B → 1.19 kB; expected, server-action form)

## Infrastructure (2026-06-14)

**Supabase (production CRM):** **Enamorado CRM** — ref `tvijtuivauumajbkpodj`  
URL: `https://tvijtuivauumajbkpodj.supabase.co`  
Migrations **0001–0004 applied** (2026-06-14). RLS enabled on all 8 tables.

| Project | Ref | Use |
|---------|-----|-----|
| **Enamorado CRM** | `tvijtuivauumajbkpodj` | Production CRM |
| thehub-business | `ghbdtysszptnykfrrmqx` | **Do not use** for Enamorado |

**First admin:** **Deferred** — not required to deploy the website or finish Vercel setup. The CRM login page will work, but **no one can sign in** until this is done (5 minutes when ready).

When Dalkys is ready, in [Enamorado CRM → Authentication](https://supabase.com/dashboard/project/tvijtuivauumajbkpodj/auth/users):

1. **Invite user** → `hello@enamoradoinsurancefl.com`
2. After they set a password, open **SQL Editor** and run:

```sql
update public.profiles
set role = 'admin', full_name = 'Dalkys Enamorado'
where email = 'hello@enamoradoinsurancefl.com';
```

**Alternative (after first admin exists):** an existing admin can invite more users from **CRM → Admin → Users** (`/admin/users`) — no dashboard needed for additional accounts.

**Vercel — Website:** **Live**  
- Project: `enamorado-insurance-website`  
- Production: https://enamorado-insurance-website.vercel.app  
- Dashboard: https://vercel.com/joelcastillomarketingexpert-7985s-projects/enamorado-insurance-website  
- Custom domains added (DNS pending at SiteGround): `enamoradoinsurancefl.com`, `www.enamoradoinsurancefl.com`  
- SiteGround records: `@` → A `76.76.21.21`, `www` → A `76.76.21.21` (per Vercel CLI output)

**Vercel — CRM:** not deployed yet

**Figma:** [Enamorado Insurance — Website](https://www.figma.com/design/gsZgq97yzeH48p59j45cs1)

**Website copy:** Dalkys Enamorado broker messaging in `website/lib/site.ts`.

## Blocked

- v2 work is **not blocked** but is gated on the items below in "Questions for Joel".

## GitHub

- Initial commit pushed to `main` at https://github.com/JCDATASCIENTIST/enamoradocrm
- Set Vercel **Root Directory** to `app/` when linking the repo
- All domain references in the repo now match the kickoff-meeting decision (`enamoradoinsurancefl.com`)

## Path B audit (integrations)

- `notifyNewProspect` still includes only `assigned_to_name`, `display_name`, `event`, `contact_type`, `stage`, `plan_type` — no PHI fields added
- `WEBSITE_CONTACT_WEBHOOK` payload is **new** (marketing site → Zapier). It can include name, phone, email, and free-text message because the website is a prospect-intake surface, not a CRM record. The form rejects obvious SSN/MBI/Medicaid-ID patterns and caps message length. Documented in `website/lib/contact-action.ts`.

## Next 3 actions

1. Review the v1 polish changes (file list in this PR) and merge to `main`
2. When the agency signs the Supabase BAA, start v2 (Path A) work — `0005_path_a_phi.sql` migration, `app/lib/hipaa/vault.ts` server-side decrypt, MCP server skeleton
3. Configure production Zapier Zaps (existing 3 CRMs + the new website intake Zap)

## Questions for Joel (and the client)

- Confirm agency timezone for the 13:00 UTC cron (do we want 8 AM Eastern = 13:00 UTC during EST?)
- Confirm Zapier destination (email vs Slack) for each of the 3 CRM Zaps + the new website-intake Zap
- **BAA timing** — when is the Supabase BAA expected to be signed? Until then, v2 PHI columns stay empty
- **MCP server auth** — Supabase JWT, separate bearer token, or both? Default in v2 plan: Supabase JWT for the user's existing session
- **Canva birthday card Zap** was agreed in the kickoff meeting; not built yet — is that still a v1 scope item, or deferred to v2?
- **Language preference** is stored on contacts (English, Spanish, Haitian Creole, Portuguese, Other) but the website is monolingual English. A Spanish version of the marketing site is a meaningful accessibility/UX win and fits the agency's demographic — change-order scope, but worth flagging

## v1 audit findings (from this session, used as the polish backlog)

| Severity | Item | Resolution |
|---|---|---|
| Critical | Contact detail missing enrollments/commissions panels | Fixed (this pass) |
| Critical | Audit log doesn't show update diff | Fixed (this pass) |
| Should fix | Pipeline "Overdue" badge uses browser TZ | Fixed (this pass) |
| Should fix | Website /contact form is a placeholder | Fixed (this pass) |
| Should fix | Dashboard leaks email local-part | Fixed (this pass) |
| Should fix | No error/404 pages in (app) group | Fixed (this pass) |
| Should fix | /commissions list missing writing-agent name | Fixed (this pass) |
| Nice | No print CSS | False alarm — exists at `app/app/globals.css:14-37` |
| Nice | No favicon / sitemap / og-image | Not addressed — defer to launch polish |

## v2 (Path A) work — NOT STARTED, gated on BAA + scope sign-off

Per the user's request: store full SSN, full MBI, full Medicaid ID; build an MCP server exposing CRM tools to Claude.

Sequence (no code yet):
1. `0005_path_a_phi.sql` — add `ssn_encrypted` / `mbi_encrypted` / `medicaid_id_encrypted` (bytea, pgsodium-encrypted), `phi_access_log` table, expand RLS so only `admin` can read plaintext
2. `app/lib/hipaa/vault.ts` — server-only helper that decrypts on demand and writes the access-log row
3. `app/lib/contacts/actions.ts` — extend `createContact` / `updateContact` to accept PHI fields, validate, encrypt, log reads
4. `mcp/` (new repo dir) — TypeScript MCP server using `@modelcontextprotocol/sdk`; OAuth via Supabase JWT; tools: list_contacts, get_contact, add_note, transition_stage, search_contacts, list_follow_ups, complete_follow_up, snooze_follow_up, list_renewals, list_commissions, log_commission, list_enrollments, log_enrollment
5. Webhook contract: tools that return contact detail redact `ssn_encrypted` / `mbi_encrypted` / `medicaid_id_encrypted` unless caller's role is admin AND `reveal_phi=true` is set, in which case it's audit-logged
6. Docs: update `04-Risk-Register.md` (Risk 1 → Path A; new Risk 11 for MCP attack surface; Risk 6 likelihood bump), `workflows/HIPAA-Data-Handling-Flow.md`, add `mcp/README.md`
