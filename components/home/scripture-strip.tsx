import type { Scripture } from '@/types';

export function ScriptureStrip({ scripture }: { scripture: Scripture }) {
  return (
    <section className="bg-forest-700 py-16 md:py-20">
      <div className="container max-w-3xl text-center">
        <div className="mx-auto mb-6 h-px w-16 bg-gold-500" />
        <p className="font-display italic text-2xl md:text-3xl text-paper leading-relaxed text-balance">
          {scripture.verseText}
        </p>
        <p className="mt-5 text-gold-300 text-sm">{scripture.reference}</p>
      </div>
    </section>
  );
}
