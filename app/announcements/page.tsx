'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Megaphone, Search } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { CATEGORY_LABELS, PRIORITY_VARIANT } from '@/lib/announcement-meta';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Loading } from '@/components/shared/loading';
import { Pagination } from '@/components/shared/pagination';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Announcement, AnnouncementCategory, Paginated } from '@/types';

const CATEGORIES: (AnnouncementCategory | 'ALL')[] = [
  'ALL', 'GENERAL', 'MEETING', 'PRAYER', 'BIBLE_STUDY', 'EVANGELISM', 'FELLOWSHIP', 'IMPORTANT', 'EMERGENCY',
];

export default function AnnouncementsPage() {
  const [data, setData] = useState<Paginated<Announcement> | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '9' });
    if (search) params.set('search', search);
    if (category !== 'ALL') params.set('category', category);

    api
      .get<Paginated<Announcement>>(`/api/announcements?${params}`, { skipAuth: true })
      .then(setData)
      .finally(() => setLoading(false));
  }, [search, category, page]);

  return (
    <>
      <PageHeader
        eyebrow="Stay Informed"
        title="Announcements"
        description="Meeting times, prayer requests, and important updates from the fellowship."
      />

      <section className="container py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search announcements…"
              className="pl-10"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => { setCategory(c); setPage(1); }}
                aria-pressed={category === c}
                className={`text-xs px-3 py-1.5 rounded-sm border transition-colors ${
                  category === c
                    ? 'bg-fcs-700 text-white border-fcs-700'
                    : 'border-ink-200 bg-white text-ink-600 hover:border-fcs-500'
                }`}
              >
                {c === 'ALL' ? 'All' : CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
        </div>

        {loading && <Loading label="Loading announcements…" />}

        {!loading && data && data.items.length === 0 && (
          <EmptyState icon={Megaphone} title="No announcements yet." description="Check back soon for updates from the fellowship." />
        )}

        {!loading && data && data.items.length > 0 && (
          <>
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              {data.items.map((a, index) => (
                <Link
                  key={a.id}
                  href={`/announcements/${a.id}`}
                  className={`group block border-b border-ink-100 pb-6 transition-colors hover:border-fcs-500 ${index === 0 ? 'lg:row-span-3 lg:border-b-0 lg:pb-0' : ''}`}
                >
                  {index === 0 && a.imageUrl && (
                    <div className="relative mb-6 aspect-[16/8] overflow-hidden rounded-sm bg-ink-100">
                      <Image src={a.imageUrl} alt={a.title} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                    </div>
                  )}
                  <div className="mb-3 flex items-center gap-2">
                    <Badge variant={PRIORITY_VARIANT[a.priority]}>{CATEGORY_LABELS[a.category]}</Badge>
                    {a.priority === 'URGENT' && <Badge variant="urgent">Urgent</Badge>}
                    {a.publishedAt && <span className="ml-auto text-xs text-slate-400">{formatDate(a.publishedAt)}</span>}
                  </div>
                  <h3 className={`${index === 0 ? 'text-2xl sm:text-3xl' : 'text-lg'} font-display leading-snug transition-colors group-hover:text-fcs-700`}>{a.title}</h3>
                  <p className={`mt-2 text-sm leading-6 text-slate-600 ${index === 0 ? 'line-clamp-3' : 'line-clamp-2'}`}>{a.description}</p>
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
