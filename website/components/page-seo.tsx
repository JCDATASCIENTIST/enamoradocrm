import { JsonLd } from '@/components/json-ld';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { buildPageGraph } from '@/lib/seo/schema';

type PageSeoProps = {
  locale: Locale;
  dict: Dictionary;
  path: string;
  title: string;
  description: string;
  breadcrumbs: { name: string; path: string }[];
  faqs?: readonly { question: string; answer: string }[];
};

export function PageSeo({ locale, dict, path, title, description, breadcrumbs, faqs }: PageSeoProps) {
  return (
    <JsonLd
      data={buildPageGraph(locale, dict, {
        path,
        title,
        description,
        breadcrumbs,
        faqs,
      })}
    />
  );
}
