import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { HomepageContent } from '@/types';

const UNIVERSITY_NAME = "Sa'adu Zungur University";
const UNIVERSITY_URL = 'https://sazu.edu.ng/';

export function Hero({ content }: { content: HomepageContent }) {
  const imageUrl =
    content.heroImageUrl && !content.heroImageUrl.startsWith('[')
      ? content.heroImageUrl
      : '/images/hero-fallback.svg';

  return (
    <section className="relative min-h-[min(760px,calc(100vh-5rem))] overflow-hidden bg-ink-800">
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        {/* Left-to-right scrim so text stays readable regardless of the image,
            plus a bottom fade so the section meets the next one cleanly. */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/95 via-ink-900/70 to-ink-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />
      </div>

      <div className="relative container flex min-h-[min(760px,calc(100vh-5rem))] items-center py-20 md:py-28">
        <div className="grid w-full items-end gap-16 xl:grid-cols-[minmax(0,1fr)_220px]">
          <div className="max-w-2xl animate-fade-up">
            <div className="mb-7 flex items-center gap-3 text-gold-300">
              <span className="h-px w-10 bg-gold-300/70" />
              <p className="text-xs font-medium uppercase tracking-[0.2em] md:text-sm">
                {content.heroSubtitle || 'Fellowship of Christian Students'}
              </p>
            </div>

            <h1 className="mb-6 max-w-3xl text-5xl font-display leading-[0.98] tracking-tight text-paper text-balance sm:text-6xl md:text-8xl">
              {content.heroTitle || 'SAZU FCS'}
            </h1>

          {/* Welcome message: a warm, editorial lede — larger and more
              generously spaced than ordinary body copy so it reads as an
              invitation, not a caption. */}
            <p className="mb-8 max-w-xl font-display text-xl leading-relaxed text-gold-100/95 text-balance md:text-2xl">
              {content.heroDescription ||
                'Where love is shared, lives are transformed, and Jesus is Lord.'}
            </p>

            <div className="mb-10 flex flex-wrap items-center gap-4">
              <Link href="/register">
                <Button variant="gold" size="lg">Join the Fellowship</Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-ink-100/40 text-paper hover:bg-paper hover:text-ink"
                >
                  Explore FCS
                </Button>
              </Link>
            </div>

            <div className="max-w-xl border-t border-paper/20 pt-7">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
                Welcome to Chapel of Zion
              </p>
              <a
                href={UNIVERSITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-4 inline-block text-base font-semibold text-paper underline decoration-paper/40 underline-offset-4 transition-colors hover:text-gold-100 hover:decoration-gold-300 md:text-lg"
              >
                {UNIVERSITY_NAME}
              </a>
              <p className="max-w-lg text-base font-semibold leading-relaxed text-paper/95 md:text-lg">
                Where love is shared, lives are transformed, everyone is somebody, and Jesus is Lord.
                <span className="mt-2 block text-sm font-semibold tracking-wide text-gold-100/80">
                  John 15:12 · Romans 12:2
                </span>
              </p>
            </div>
          </div>

          <aside className="hidden border-l border-paper/15 pl-7 text-paper/80 xl:block">
            <p className="mb-8 text-xs font-medium uppercase tracking-[0.2em] text-gold-300">
              Our rhythm
            </p>
            <div className="space-y-7">
              <div>
                <p className="mb-1 font-display text-2xl text-paper">Faith</p>
                <p className="text-sm leading-relaxed text-paper/55">Rooted in the Word and growing together.</p>
              </div>
              <div>
                <p className="mb-1 font-display text-2xl text-paper">Community</p>
                <p className="text-sm leading-relaxed text-paper/55">A family of students who make room for everyone.</p>
              </div>
              <div>
                <p className="mb-1 font-display text-2xl text-paper">Service</p>
                <p className="text-sm leading-relaxed text-paper/55">Carrying the hope of Christ beyond campus.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}