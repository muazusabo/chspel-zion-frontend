'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { SkeletonGrid } from '@/components/shared/loading';
import type { GalleryCategory, GalleryImage, Paginated } from '@/types';

const CATEGORIES: (GalleryCategory | 'ALL')[] = [
  'ALL', 'WORSHIP', 'BIBLE_STUDY', 'PRAYER', 'EVANGELISM', 'RETREAT', 'FELLOWSHIP', 'OUTREACH', 'EVENTS', 'EXECUTIVES',
];

const LABELS: Record<string, string> = {
  ALL: 'All', WORSHIP: 'Worship', BIBLE_STUDY: 'Bible Study', PRAYER: 'Prayer',
  EVANGELISM: 'Evangelism', RETREAT: 'Retreat', FELLOWSHIP: 'Fellowship',
  OUTREACH: 'Outreach', EVENTS: 'Events', EXECUTIVES: 'Executives',
};

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[] | null>(null);
  const [category, setCategory] = useState<GalleryCategory | 'ALL'>('ALL');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const lightbox = lightboxIndex !== null ? images?.[lightboxIndex] ?? null : null;

  useEffect(() => {
    if (lightboxIndex === null || !images?.length) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxIndex(null);
      if (event.key === 'ArrowLeft') {
        setLightboxIndex((index) => index === null ? null : (index - 1 + images.length) % images.length);
      }
      if (event.key === 'ArrowRight') {
        setLightboxIndex((index) => index === null ? null : (index + 1) % images.length);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [images, lightboxIndex]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '48' });
    if (category !== 'ALL') params.set('category', category);
    api
      .get<Paginated<GalleryImage>>(`/api/gallery?${params}`, { skipAuth: true })
      .then((res) => setImages(res.items))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <>
      <PageHeader eyebrow="Gallery" title="Moments from the fellowship" description="Worship nights, retreats, and outreach moments from the fellowship." />

      <section className="container py-16">
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                category === c ? 'bg-ink text-paper border-ink' : 'border-ink-200 text-ink-600 hover:border-ink-400'
              }`}
            >
              {LABELS[c]}
            </button>
          ))}
        </div>

        {loading && <SkeletonGrid count={9} />}

        {!loading && images && images.length === 0 && (
          <EmptyState icon={Images} title="No gallery images yet." />
        )}

        {!loading && images && images.length > 0 && (
          <div className="columns-2 sm:columns-3 gap-4 space-y-4">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => setLightboxIndex(images.indexOf(img))}
                className="group relative block w-full overflow-hidden rounded-lg break-inside-avoid bg-ink-50 text-left"
              >
                <Image
                  src={img.imageUrl}
                  alt={img.caption ?? 'Gallery photo'}
                  width={500}
                  height={500}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.03] group-hover:opacity-90"
                  loading="lazy"
                />
                {img.caption && (
                  <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-ink-900/90 to-transparent px-4 pb-3 pt-8 text-sm text-paper transition-transform duration-300 group-hover:translate-y-0">
                    {img.caption}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-[60] bg-ink-900/95 flex items-center justify-center p-6"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute right-6 top-6 z-10 text-paper transition-colors hover:text-gold-300"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close"
          >
            <X size={28} />
          </button>
          {images && images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-paper/20 bg-ink-900/60 p-3 text-paper transition-colors hover:bg-ink-900 hover:text-gold-300"
                onClick={(event) => {
                  event.stopPropagation();
                  setLightboxIndex((index) => index === null ? null : (index - 1 + images.length) % images.length);
                }}
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-paper/20 bg-ink-900/60 p-3 text-paper transition-colors hover:bg-ink-900 hover:text-gold-300"
                onClick={(event) => {
                  event.stopPropagation();
                  setLightboxIndex((index) => index === null ? null : (index + 1) % images.length);
                }}
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
          <div className="max-w-3xl max-h-[85vh] relative" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightbox.imageUrl}
              alt={lightbox.caption ?? 'Gallery photo'}
              width={1200}
              height={1200}
              sizes="(max-width: 768px) 92vw, 75vw"
              className="h-auto max-h-[78vh] w-full rounded-lg object-contain"
            />
            {lightbox.caption && (
              <p className="text-center text-ink-100 text-sm mt-4">{lightbox.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
