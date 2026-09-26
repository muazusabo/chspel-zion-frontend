'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Newspaper } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { SkeletonGrid } from '@/components/shared/loading';
import { Pagination } from '@/components/shared/pagination';
import type { NewsArticle, Paginated } from '@/types';

export default function NewsPage() {
  const [data, setData] = useState<Paginated<NewsArticle> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get<Paginated<NewsArticle>>(`/api/news?page=${page}&limit=9`, { skipAuth: true })
      .then(setData)
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <>
      <PageHeader eyebrow="News" title="Stories from SAZU FCS" description="Updates, testimonies, and reflections from fellowship life." />

      <section className="container py-16">
        {loading && <SkeletonGrid count={6} />}

        {!loading && data && data.items.length === 0 && (
          <EmptyState icon={Newspaper} title="No news available." description="New stories will appear here as they're published." />
        )}

        {!loading && data && data.items.length > 0 && (
          <>
            <div className="responsive-content-grid">
              {data.items.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`} className="group">
                  <div className="relative aspect-[4/3] rounded-md overflow-hidden mb-4 bg-ink-50">
                    {article.featuredImage && (
                      <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  {article.category && <p className="text-xs text-gold-700 mb-2">{article.category}</p>}
                  <h3 className="font-display text-lg leading-snug mb-2 group-hover:text-forest-700 transition-colors">
                    {article.title}
                  </h3>
                  {article.excerpt && <p className="text-sm text-slate-600 line-clamp-2 mb-2">{article.excerpt}</p>}
                  {article.publishedAt && <p className="text-xs text-slate-400">{formatDate(article.publishedAt)}</p>}
                </Link>
              ))}
            </div>
            <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
          </>
        )}
      </section>
    </>
  );
}
