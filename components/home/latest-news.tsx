'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { NewsArticle, Paginated } from '@/types';

export function LatestNews() {
  const [items, setItems] = useState<NewsArticle[] | null>(null);

  useEffect(() => {
    api
      .get<Paginated<NewsArticle>>('/api/news?limit=3')
      .then((res) => setItems(res.items))
      .catch(() => setItems([]));
  }, []);

  if (items && items.length === 0) return null;

  return (
    <section className="bg-parchment py-20 md:py-28">
      <div className="container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-gold-700 text-sm mb-4">Latest News</p>
            <h2 className="text-3xl md:text-4xl leading-tight">What&apos;s happening at FCS</h2>
          </div>
          <Link href="/news" className="hidden sm:block text-sm text-ink underline underline-offset-4">
            View all
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {(items ?? Array.from({ length: 3 })).map((item, i) =>
            item ? (
              <Link
                key={(item as NewsArticle).id}
                href={`/news/${(item as NewsArticle).slug}`}
                className="group"
              >
                <div className="relative aspect-[4/3] rounded-md overflow-hidden mb-4 bg-ink-50">
                  {(item as NewsArticle).featuredImage && (
                    <Image
                      src={(item as NewsArticle).featuredImage as string}
                      alt={(item as NewsArticle).title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                {(item as NewsArticle).category && (
                  <p className="text-xs text-gold-700 mb-2">{(item as NewsArticle).category}</p>
                )}
                <h3 className="font-display text-lg leading-snug mb-2 group-hover:text-forest-700 transition-colors">
                  {(item as NewsArticle).title}
                </h3>
                {(item as NewsArticle).excerpt && (
                  <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                    {(item as NewsArticle).excerpt}
                  </p>
                )}
                {(item as NewsArticle).publishedAt && (
                  <p className="text-xs text-slate-400">
                    {formatDate((item as NewsArticle).publishedAt as string)}
                  </p>
                )}
              </Link>
            ) : (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] rounded-md bg-ink-100 mb-4" />
                <div className="h-4 bg-ink-100 rounded w-2/3 mb-2" />
                <div className="h-3 bg-ink-100 rounded w-1/2" />
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
