# Enamorado Insurance — Marketing Website

Public marketing site for **enamoradoinsurancefl.com**. The CRM lives separately at **crm.enamoradoinsurancefl.com** (`../app/`).

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

### Contact form (`/contact`)

The form on `/contact` is a Next.js Server Action (`app/contact/contact-form.tsx` + `lib/contact-action.ts`). It validates input, rejects obvious SSN / full-MBI / full-Medicaid-ID patterns, and forwards to Zapier if `WEBSITE_CONTACT_WEBHOOK` is set.

```env
# .env.local (website) — optional. If unset, the form returns success silently
# and submissions are not forwarded anywhere. Configure once the agency has
# a Zapier Catch-Hook URL for prospect intake.
WEBSITE_CONTACT_WEBHOOK=https://hooks.zapier.com/hooks/catch/...
```

The Zap receives a JSON body with `event: "website_contact_request"`, `name`, `phone`, `email`, `message`, `submitted_at`, and `source`.

## Deploy on Vercel

Use a **separate Vercel project** from the CRM:

| Project | Root directory | Domain |
|---------|----------------|--------|
| Enamorado Website | `website` | `enamoradoinsurancefl.com`, `www` |
| Enamorado CRM | `app` | `crm.enamoradoinsurancefl.com` |

See [../docs/deployment-domains.md](../docs/deployment-domains.md) for SiteGround DNS records.
