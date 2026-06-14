Execute docs/rls-smoke-tests.md against the schema in app/supabase/migrations/ and RLS policies in 0002_rls_policies.sql.

For each test case:
1. State expected behavior for admin, agent, read_only
2. Trace the enforcing policy or server action
3. If a gap is found, file a GitHub-ready bug report using templates/Bug-Report-Template.md format

Save findings to outputs/rls-audit-YYYY-MM-DD.md (create outputs/ if needed).

Do not modify schema in this session — report only, unless Joel approves a fix in the same session.
