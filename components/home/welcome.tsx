import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { HomepageContent } from '@/types';

export function Welcome({ content }: { content: HomepageContent }) {
  const imageUrl =
    content.welcomeImageUrl && !content.welcomeImageUrl.startsWith('[')
      ? content.welcomeImageUrl
      : '/images/welcome-fallback.svg';

  return (
    <section className="bg-white">
      <div className="container grid items-center gap-10 py-16 sm:py-20 md:grid-cols-2 md:gap-20 md:py-24">
        <div className="relative order-2 aspect-[4/5] max-h-[620px] overflow-hidden rounded-sm bg-ink-50 md:order-1">
          <Image
            src={imageUrl}
            alt="Fellowship gathering"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="order-1 md:order-2">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-fcs-700">Welcome to SAZU FCS</p>
          <h2 className="mb-6 text-3xl leading-tight text-balance sm:text-4xl md:text-5xl">
            A community where faith and friendship grow together
          </h2>
          <p className="mb-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            {content.welcomeMessage ||
              'SAZU FCS is a family of students walking together in Christ — through Bible study, prayer, worship, and honest friendship. Whatever stage of faith you\u2019re at, there\u2019s a place for you here.'}
          </p>
          {content.missionPreview && !content.missionPreview.startsWith('[') && (
            <p className="mb-4 max-w-xl leading-relaxed text-slate-600">
              <span className="font-medium text-ink">Our mission: </span>
              {content.missionPreview}
            </p>
          )}
          <Link href="/about">
            <Button variant="link" className="mt-2 text-ink underline underline-offset-4">
              Learn more about us →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
