import Image from 'next/image';
import type { HomepageContent } from '@/types';

export function ImageSections({ content }: { content: HomepageContent }) {
  const imageUrl =
    content.imageSectionUrl && !content.imageSectionUrl.startsWith('[')
      ? content.imageSectionUrl
      : '/images/bible-sty.jpg';

  return (
    <section className="bg-[#0b1b33] py-16 text-white sm:py-20 md:py-24">
      <div className="container grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-20">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-ink-800">
          <Image
            src={imageUrl}
            alt="Students gathered for Bible study"
            fill
            sizes="(max-width: 768px) 100vw, 58vw"
            className="object-cover"
          />
        </div>
        <div className="max-w-xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-white/65">
            Faith, together
          </p>
          <h2 className="text-3xl leading-tight text-white text-balance sm:text-4xl md:text-5xl">
            A place to grow, ask, worship, and belong.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-8 text-white/70 sm:text-lg">
            From time in Scripture to service beyond campus, there is room here
            to take your next step with Christ and with one another.
          </p>
        </div>
      </div>
    </section>
  );
}
