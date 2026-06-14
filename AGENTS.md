# Agent skills index

This repo ships project skills under [`.agents/skills/`](.agents/skills/). Each skill is a folder with a `SKILL.md` (read this first when the skill applies) and optional `references/` docs.

Instructions for all agents also live in [`CLAUDE.md`](CLAUDE.md).

## Available skills

### `nextjs-app-router-patterns`

**Path:** `.agents/skills/nextjs-app-router-patterns/SKILL.md`

Use for App Router structure, Server Components, Server Actions, streaming, layouts, and data-fetching patterns in `app/` or `website/`.

### `nextjs-supabase-auth`

**Path:** `.agents/skills/nextjs-supabase-auth/SKILL.md`

Use for Supabase Auth + Next.js middleware, cookie sessions, `@supabase/ssr` clients, and auth callbacks in the CRM (`app/lib/auth/`, `app/lib/supabase/`, `app/middleware.ts`).

### `supabase-postgres-best-practices`

**Path:** `.agents/skills/supabase-postgres-best-practices/SKILL.md`

Use for migrations, RLS policies, indexes, query performance, and Postgres schema work in `app/supabase/migrations/`.

### `tailwind-design-system`

**Path:** `.agents/skills/tailwind-design-system/SKILL.md`

Use for UI polish, component consistency, responsive layout, and design tokens in `website/` and `app/components/`. Note: this project uses Tailwind v3 (`tailwind.config.ts`), not v4 — adapt v4 guidance accordingly.

### `kpi-dashboard-design`

**Path:** `.agents/skills/kpi-dashboard-design/SKILL.md`

Use when improving `app/app/(app)/dashboard/` — overdue renewals, follow-ups, commission totals, and admin operational views.

### `mcp-builder`

**Path:** `.agents/skills/mcp-builder/SKILL.md`

Use when implementing the planned v2 MCP server (CRM tools for Claude). See `STATUS.md` v2 section. Includes reference docs for Node/Python MCP servers and evaluation scripts.

## How to use skills

1. Identify which skill matches the task
2. Read that skill’s `SKILL.md` completely before editing code
3. Follow project rules in `CLAUDE.md` (Path B, scope, conventions)
4. Update `STATUS.md` after substantial work

## Happy Capy

For Happy Capy.ai sessions, start with [`happycapy/MASTER-PROMPT.md`](happycapy/MASTER-PROMPT.md) — it points here and to `CLAUDE.md`.
