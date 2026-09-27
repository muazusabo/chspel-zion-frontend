import type { Scripture } from '@/types';

export function ScriptureStrip({ scripture }: { scripture: Scripture }) {
  return (
    <section className="bg-[#edf3f8] py-16 md:py-20">
      <div className="container max-w-4xl text-center">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-fcs-700">Scripture for today</p>
        <p className="font-display italic text-2xl leading-relaxed text-fcs-900 text-balance md:text-3xl">
          {scripture.verseText}
        </p>
        <p className="mt-5 text-sm font-medium text-slate-600">{scripture.reference}</p>
      </div>
    </section>
  );
}
