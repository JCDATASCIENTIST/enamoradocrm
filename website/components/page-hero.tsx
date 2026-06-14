type PageHeroProps = {
  label: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHero({ label, title, description, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-brand-800/10 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(199,107,58,0.15),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.08),transparent_40%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <p className="section-label text-accent-100">{label}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-xl leading-relaxed text-brand-100">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}
