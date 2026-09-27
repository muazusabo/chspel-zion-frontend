'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { FcsEvent } from '@/types';

export function UpcomingEvents() {
  const [events, setEvents] = useState<FcsEvent[] | null>(null);

  useEffect(() => {
    api
      .get<FcsEvent[]>('/api/events/upcoming?limit=3')
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  if (events && events.length === 0) return null;

  return (
    <section className="container py-20 md:py-24">
      <div className="mb-10 flex items-end justify-between border-b border-ink-100 pb-6">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-fcs-700">Upcoming Events</p>
          <h2 className="text-3xl leading-tight md:text-4xl">Come join us</h2>
        </div>
        <Link href="/events" className="hidden text-sm font-medium text-fcs-700 underline underline-offset-4 sm:block">
          See all events
        </Link>
      </div>

      <div className="divide-y divide-ink-100">
        {(events ?? Array.from({ length: 3 })).map((event, i) =>
          event ? (
            <Link
              key={(event as FcsEvent).id}
              href={`/events/${(event as FcsEvent).id}`}
              className="group flex flex-col gap-2 py-6 transition-colors hover:bg-white sm:flex-row sm:items-center sm:gap-8 sm:px-4"
            >
              <div className="sm:w-44 shrink-0 flex items-center gap-2 text-sm text-slate-600">
                <Calendar size={15} className="text-fcs-600" />
                {formatDate((event as FcsEvent).date)}
              </div>
              <h3 className="flex-1 font-display text-lg transition-colors group-hover:text-fcs-700">
                {(event as FcsEvent).title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={15} className="text-fcs-600" />
                {(event as FcsEvent).venue}
              </div>
            </Link>
          ) : (
            <div key={i} className="py-6 animate-pulse">
              <div className="h-4 bg-ink-100 rounded w-1/3" />
            </div>
          ),
        )}
      </div>
    </section>
  );
}
