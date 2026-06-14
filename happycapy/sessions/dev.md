In this session, own P0 + P3 only. Run typecheck/build, fix code gaps, open PRs. Do not write marketing copy.

Context: Enamorado Insurance CRM — Next.js 14 + Supabase in app/, GitHub JCDATASCIENTIST/enamoradocrm, Vercel root app/, HIPAA Path B for all Zapier payloads.

Start by:
1. cd app && npm run typecheck && npm run build
2. Report pass/fail with any errors
3. If failures, fix with minimal diff matching existing Server Action patterns
4. Review docs/rls-smoke-tests.md for any obvious code gaps

Do not change schema without RLS test notes. Do not add out-of-scope integrations.
