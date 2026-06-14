# SEO, AEO & GEO guide — Enamorado Insurance website

This site uses three layers so Google, Bing, and AI assistants (ChatGPT, Claude, Perplexity) can find and cite Enamorado Insurance accurately.

---

## Skills & references (no dedicated SEO skill in repo)

Use these when extending the site:

| Topic | Where to learn |
|-------|----------------|
| Next.js metadata | `.agents/skills/nextjs/` or [nextjs.org/docs/app/building-your-application/optimizing/metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata) |
| Schema.org | [schema.org/InsuranceAgency](https://schema.org/InsuranceAgency), [Google Rich Results Test](https://search.google.com/test/rich-results) |
| llms.txt (GEO) | [llmstxt.org](https://llmstxt.org/) |
| Sitemap / robots | Next.js `app/sitemap.ts`, `app/robots.ts` |

---

## What is implemented in code

| Layer | File(s) | Purpose |
|-------|---------|---------|
| **SEO** | `lib/seo/metadata.ts` | Title, description, canonical URLs, hreflang EN/ES, Open Graph, Twitter cards |
| **Schema (JSON-LD)** | `lib/seo/schema.ts`, `components/page-seo.tsx` | `InsuranceAgency`, `WebSite`, `WebPage`, `BreadcrumbList`, `FAQPage`, `Person` (broker) |
| **AEO** | Home FAQ section + `FAQPage` schema | Answer-style content for “Medicare broker Lake Worth” type queries |
| **GEO** | `public/llms.txt` | Machine-readable site summary for LLM crawlers |
| **Discovery** | `app/sitemap.ts`, `app/robots.ts` | All `/en` and `/es` URLs; AI bots allowed (GPTBot, ClaudeBot, PerplexityBot, etc.) |

---

## After deploy — verify (Joel)

1. **Rich Results Test:** https://search.google.com/test/rich-results → test `https://enamoradoinsurancecompany.com/en`
2. **Sitemap:** https://enamoradoinsurancecompany.com/sitemap.xml
3. **llms.txt:** https://enamoradoinsurancecompany.com/llms.txt
4. **Google Search Console:** Add property → submit sitemap URL
5. **Bing Webmaster Tools:** Same sitemap
6. **Google Business Profile:** Match NAP (name, address, phone) to `lib/site.ts`

---

## NAP consistency (critical)

Search engines and LLMs trust matching data everywhere:

| Field | Site value |
|-------|------------|
| Name | Enamorado Insurance Company |
| Address | 3554 Lake Worth Rd, Lake Worth, FL 33461 |
| Phone | (561) 215-1061 |
| Hours | Mon–Fri 9–6; Sat by appointment |

Update GBP, Brevo sender, and any directories when this changes.

---

## Ongoing AEO / GEO tips

1. **Keep FAQ answers factual** — edit `lib/i18n/dictionaries/en.ts` and `es.ts` → `home.faq`
2. **Add local content** — blog posts or service pages for “Medicare Lake Worth”, “Medicare Palm Beach County” (future)
3. **Refresh llms.txt** when you add pages or change services
4. **Reviews** — link Google reviews on About page when available (future `aggregateRating` schema)
5. **License / sameAs** — add Florida DOI license URL to schema when Dalkys provides it

---

## Code map (when updating)

```
website/
├── app/sitemap.ts          # Auto-generates all locale URLs
├── app/robots.ts           # Crawler rules + sitemap link
├── public/llms.txt         # GEO — edit manually when site changes
├── lib/seo/metadata.ts     # Page titles, OG, hreflang
├── lib/seo/schema.ts       # JSON-LD builders
├── components/page-seo.tsx # Per-page structured data
└── lib/i18n/dictionaries/  # Meta descriptions + FAQ copy (EN/ES)
```

---

## Happy Capy automation (optional)

Schedule in Happy Capy using `happycapy/automations/weekly-audit.md` — add a line to verify sitemap, llms.txt, and Search Console after each deploy.
