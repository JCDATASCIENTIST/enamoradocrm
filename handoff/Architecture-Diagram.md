# Architecture overview

```mermaid
flowchart LR
  Browser[User browser]
  Vercel[Vercel Next.js 14]
  Supabase[Supabase Auth + Postgres RLS]
  Zapier[Zapier automations]
  SiteGround[SiteGround DNS]

  Browser --> Vercel
  Vercel --> Supabase
  Vercel -->|cron daily| Zapier
  SiteGround -->|crm subdomain| Vercel
```

## Components

| Layer | Technology |
|-------|------------|
| Frontend | Next.js App Router, Tailwind |
| Hosting | Vercel |
| Database + Auth | Supabase |
| Automations | Zapier (webhooks, Path B payloads) |
| DNS | SiteGround → `crm.enamoradoinsurancecompany.com` |

## Security

- Session cookies via `@supabase/ssr`
- RLS on all application tables
- Service role only on server for admin invite and cron
- Audit log append-only via SECURITY DEFINER triggers
