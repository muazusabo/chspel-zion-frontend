export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-ink-100 bg-[#f1f5f9] py-14 sm:py-16 md:py-20">
      <div className="container">
        {eyebrow && <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-fcs-700">{eyebrow}</p>}
        <h1 className="max-w-3xl text-3xl font-display leading-tight text-fcs-900 text-balance sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
        )}
      </div>
    </section>
  );
}
