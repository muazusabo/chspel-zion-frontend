import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { HomepageContent } from '@/types';

export function Hero({ content }: { content: HomepageContent }) {
  const imageUrl =
    content.heroImageUrl && !content.heroImageUrl.startsWith('[')
      ? content.heroImageUrl
      : '/images/sunday.jpg';

  return (
    <section className="relative isolate overflow-hidden bg-fcs-900">
      <Image
        src={imageUrl}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#081426]/90 via-[#081426]/55 to-[#081426]/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#081426]/50 via-transparent to-[#081426]/10" />

      <div className="container relative flex min-h-[min(690px,calc(100svh-6rem))] items-end py-16 sm:py-20 md:items-center md:py-24">
        <div className="max-w-3xl animate-fade-up">
          <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/80 sm:text-sm">
            <span className="h-px w-8 bg-white/70" />
            {content.heroSubtitle || 'Fellowship of Christian Students'}
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] text-white text-balance sm:text-6xl md:text-7xl">
            {content.heroTitle || 'SAZU FCS'}
          </h1>
          <p className="mt-6 max-w-2xl text-sm font-semibold leading-relaxed text-white/90 text-balance sm:text-base">
            WELCOME TO CHAPEL OF ZION WHERE LOVE IS SHARED, LIVES ARE TRANSFORMED,
            EVERYBODY IS SOMEBODY, AND JESUS IS LORD!
          </p>
          <p className="mt-5 max-w-2xl font-sans text-lg leading-relaxed text-white/80 text-balance sm:text-xl">
            {content.heroDescription ||
              'Growing in Faith. Building Community. Serving with Purpose.'}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/register">
              <Button variant="gold" size="lg">Join the Fellowship</Button>
            </Link>
            <Link
              href="/about"
              className="inline-flex h-12 items-center gap-2 px-4 text-sm font-medium text-white transition-colors hover:text-white/75"
            >
              Explore FCS <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <a
            href="https://sazu.edu.ng/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex border-t border-paper/25 pt-4 text-sm text-paper/75 hover:text-paper"
          >
            Chapel of Zion · Sa&apos;adu Zungur University
          </a>
        </div>
      </div>
    </section>
  );
}