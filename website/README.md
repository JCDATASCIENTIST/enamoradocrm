# Enamorado Insurance — Marketing Website

Public marketing site for **enamoradoinsurancecompany.com**. The CRM lives separately at **crm.enamoradoinsurancecompany.com** (`../app/`).

## Stack

Next.js 14 · Tailwind CSS · Vercel

## Local development

```bash
cd website
npm install
npm run dev
```

Runs on http://localhost:3001 (CRM uses 3000).

## Before launch

Edit contact details in [`lib/site.ts`](lib/site.ts):

- Phone, email, office address
- Confirm `url` and `crmUrl`

Wire the contact form on `/contact` to your email or Zapier intake.

## Deploy on Vercel

Use a **separate Vercel project** from the CRM:

| Project | Root directory | Domain |
|---------|----------------|--------|
| Enamorado Website | `website` | `enamoradoinsurancecompany.com`, `www` |
| Enamorado CRM | `app` | `crm.enamoradoinsurancecompany.com` |

See [../docs/deployment-domains.md](../docs/deployment-domains.md) for SiteGround DNS records.
