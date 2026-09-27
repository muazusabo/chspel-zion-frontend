import Image from 'next/image';

export function ImageSections() {
  return (
    <section className="bg-ink-900 py-16 text-paper sm:py-20 md:py-24">
      <div className="container grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-ink-800">
          <Image
            src="/images/bible-sty.jpg"
            alt="Students gathered for Bible study"
            fill
            sizes="(max-width: 768px) 100vw, 58vw"
            className="object-cover"
          />
        </div>
        <div className="max-w-xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-gold-300">
            Faith, together
          </p>
          <h2 className="text-3xl leading-tight text-paper text-balance sm:text-4xl md:text-5xl">
            A place to grow, ask, worship, and belong.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-paper/70 sm:text-lg">
            From time in Scripture to service beyond campus, there is room here
            to take your next step with Christ and with one another.
          </p>
        </div>
      </div>
    </section>
  );
}
