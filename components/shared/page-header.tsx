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
    <section className="bg-ink-800 py-20 md:py-24">
      <div className="container">
        {eyebrow && <p className="text-gold-300 text-sm mb-4">{eyebrow}</p>}
        <h1 className="text-3xl md:text-5xl font-display text-paper leading-tight max-w-2xl text-balance">
          {title}
        </h1>
        {description && (
          <p className="text-ink-100 mt-5 max-w-xl leading-relaxed">{description}</p>
        )}
      </div>
    </section>
  );
}
