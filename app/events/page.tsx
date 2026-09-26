'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Loading } from '@/components/shared/loading';
import { Pagination } from '@/components/shared/pagination';
import { Badge } from '@/components/ui/badge';
import type { FcsEvent, Paginated } from '@/types';

export default function EventsPage() {
  const [data, setData] = useState<Paginated<FcsEvent> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get<Paginated<FcsEvent>>(`/api/events?page=${page}&limit=9`, { skipAuth: true })
      .then(setData)
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <>
      <PageHeader eyebrow="Calendar" title="Events" description="Fellowship week, retreats, worship nights, and more." />

      <section className="container py-16">
        {loading && <Loading label="Loading events…" />}

        {!loading && data && data.items.length === 0 && (
          <EmptyState icon={CalendarDays} title="No upcoming events." description="Check back soon — new events are added regularly." />
        )}

        {!loading && data && data.items.length > 0 && (
          <>
            <div className="responsive-content-grid">
              {data.items.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="block rounded-md border border-ink-100 p-6 hover:border-gold-500 transition-colors"
                >
                  {event.status === 'CANCELLED' && <Badge variant="urgent" className="mb-3">Cancelled</Badge>}
                  <h3 className="font-display text-lg leading-snug mb-4">{event.title}</h3>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={14} className="text-gold-700 shrink-0" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gold-700 shrink-0" />
                      {event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gold-700 shrink-0" />
                      {event.venue}
                    </div>
                  </div>
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
