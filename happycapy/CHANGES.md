# v1 polish pass — 2026-06-14

37 files changed (+736 / −168). All on top of `JCDATASCIENTIST/enamoradocrm@main` as of 2026-06-14.

Apply with:

```bash
cd enamorado   # your local checkout
git apply --check v1-polish.patch   # verify it applies cleanly
git apply v1-polish.patch
cd app && npm run typecheck && npm run build
cd ../website && npm run typecheck && npm run build
```

If `git apply` rejects (because you have unrelated local changes), use `git apply --3way` or resolve manually.

---

## Domain fix (per kickoff-meeting transcript: `enamoradoinsurancefl.com`)

The repo and the docs disagreed with the kickoff call — every file referenced `enamoradoinsurancecompany.com` but Joel and the client agreed on `enamoradoinsurancefl.com`. Replaced across 15 files:

- `website/lib/site.ts` — `url`, `crmUrl`, `email`
- `docs/deployment-domains.md` — 9 references
- `workflows/Launch-Day-Runbook.md`, `workstream-b/Zapier-Automation-List.md`
- `handoff/Agent-Monday-Morning-Checklist.md`, `handoff/Credential-Vault-Index.md`, `handoff/Launch-Checklist.md`
- `happycapy/MASTER-PROMPT.md`, `templates/Discovery-Document-Template.md`
- `website/README.md`
- `01-Project-Scope.md`, `02-Project-Plan.md`, `03-Timeline-and-Milestones.md`, `05-Statement-of-Work.md`, `07-Kickoff-Deck-Outline.md`

## Brand alt-text fix

The CRM sidebar, mobile nav, and login page all used `alt="Enamorado Health Services"`. Changed to `alt="Enamorado Insurance"` to match the brand in `website/lib/site.ts`. Files:

- `app/app/(app)/layout.tsx`
- `app/app/(app)/_components/mobile-nav.tsx`
- `app/app/login/page.tsx`

## Contact detail page: inline enrollments + commissions panels

The contact detail page used to show demographic, contact, plan, notes, and stage history — but agents working on a contact had to leave the page to log an enrollment or commission. Now both have inline panels (with quick-add for agents/admins).

Files changed:
- `app/lib/enrollments/queries.ts` — added `listEnrollmentsForContact(contactId, limit)`
- `app/lib/commissions/queries.ts` — added `listCommissionsForContact(contactId, limit)`
- `app/app/(app)/contacts/[id]/page.tsx` — fetch + render two new panels

Commissions panel includes a `+ New` deep-link to `/commissions/new?contact_id=…`. Enrollments panel includes a quick-add form (reusing the existing `EnrollmentForm` component, which already supports a `contactId` prop).

## Audit log: render the diff for `update` rows

The `audit_log` table already stored `old_values` / `new_values` / `changed_fields` JSONB, but `/admin/audit` only showed the row_id. Now update rows show the changed fields (up to 6 per row, with `updated_at` and `updated_by` filtered out). Path B-safe — values are stringified, no PHI is exposed.

Files changed:
- `app/app/(app)/admin/audit/page.tsx`

## Pipeline "Overdue" badge in APP_TZ

The follow-ups page uses `APP_TZ` (default `America/New_York`) for "today" comparisons. The pipeline kanban was using the browser's local timezone. They now agree, so a contact that is "Overdue" on the kanban is also overdue on the follow-ups page.

Files changed:
- `app/app/(app)/pipeline/page.tsx` — computes `todayInAppTz()` server-side, passes to board
- `app/app/(app)/pipeline/_components/pipeline-board.tsx` — accepts the prop, drops the `new Date(...)` browser-TZ math

## Error / 404 pages

A bad contact ID used to throw an unhandled error. Added:
- `app/app/(app)/error.tsx` — error boundary for the (app) group, with "Try again" + "Go to dashboard" buttons and an Error ID for support
- `app/app/(app)/not-found.tsx` — 404 page within the (app) group
- `app/app/global-error.tsx` — escape-hatch boundary for the entire CRM

## /commissions list: writing-agent column

The form supported a writing agent, the schema had a `writing_agent_id` FK, but the list page didn't show it. Now it does. The `NewCommissionPage` also reads `?contact_id=…` from the query string and pre-selects the contact in the form.

Files changed:
- `app/app/(app)/commissions/page.tsx`
- `app/app/(app)/commissions/new/page.tsx`
- `app/app/(app)/commissions/_components/commission-form.tsx` — accepts `defaultContactId` prop

## Dashboard greeting: no email local-part leak

The old line was `Welcome back, {profile.full_name ?? profile.email.split('@')[0]}.` — the `split('@')[0]` fallback leaked the local-part of the email when `full_name` was null. The `handle_new_user` trigger already sets `full_name` to the email local-part on signup, so the `split('@')[0]` fallback is redundant. Removed it.

File changed:
- `app/app/(app)/dashboard/page.tsx`

## Website contact form: working server action

The form on `enamoradoinsurancefl.com/contact` was a hard-coded `<form action="#">` placeholder. It's now a real Next.js Server Action:

- Validates required fields (name, plus phone or email)
- Rejects obvious PHI patterns (SSN, full MBI)
- POSTs to a Zapier Catch-Hook if `WEBSITE_CONTACT_WEBHOOK` is set
- Returns success silently if the webhook env var is unset (so deploys work before the agency has its Zap configured)

Files added:
- `website/lib/contact-action.ts`
- `website/app/contact/contact-form.tsx`

Files changed:
- `website/app/contact/page.tsx` — uses the new component
- `website/README.md` — documents the new env var

## Follow-ups helper: single Intl.DateTimeFormat call

`app/lib/follow-ups/queries.ts` was calling `Intl.DateTimeFormat` three times for the same value to determine the weekday. Simplified to one call. Behavior is identical.

File changed:
- `app/lib/follow-ups/queries.ts`

## Docs

- `STATUS.md` — rewritten with the v1 polish section, the build verification, the open questions, and a v2 (Path A) section
- `workflows/COVERAGE-GAP.md` — added a "v1 polish items" table with the 12 items above, and a v2 (Path A) section
- `website/README.md` — documented the new env var
