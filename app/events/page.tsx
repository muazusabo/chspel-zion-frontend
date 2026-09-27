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

      <section className="container py-12 sm:py-16">
        {loading && <Loading label="Loading events…" />}

        {!loading && data && data.items.length === 0 && (
          <EmptyState icon={CalendarDays} title="No upcoming events." description="Check back soon — new events are added regularly." />
        )}

        {!loading && data && data.items.length > 0 && (
          <>
            <div className="grid gap-0 border-y border-ink-100">
              {data.items.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group grid gap-4 border-b border-ink-100 py-6 transition-colors last:border-b-0 hover:bg-white sm:grid-cols-[150px_1fr_auto] sm:items-center sm:px-4"
                >
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CalendarDays size={15} className="shrink-0 text-fcs-600" />
                    {formatDate(event.date)}
                  </div>
                  <div>
                    {event.status === 'CANCELLED' && <Badge variant="urgent" className="mb-2">Cancelled</Badge>}
                    <h3 className="font-display text-lg leading-snug transition-colors group-hover:text-fcs-700">{event.title}</h3>
                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                      <Clock size={14} className="shrink-0 text-fcs-600" />
                      {event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}
                    </p>
                  </div>
                  <p className="flex items-center gap-2 text-sm text-slate-600 sm:justify-end">
                    <MapPin size={14} className="shrink-0 text-fcs-600" />
                    {event.venue}
                  </p>
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
