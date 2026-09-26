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
    <section className="container py-20 md:py-28">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-gold-700 text-sm mb-4">Upcoming Events</p>
          <h2 className="text-3xl md:text-4xl leading-tight">Come join us</h2>
        </div>
        <Link href="/events" className="hidden sm:block text-sm text-ink underline underline-offset-4">
          See all events
        </Link>
      </div>

      <div className="divide-y divide-ink-100 border-t border-b border-ink-100">
        {(events ?? Array.from({ length: 3 })).map((event, i) =>
          event ? (
            <Link
              key={(event as FcsEvent).id}
              href={`/events/${(event as FcsEvent).id}`}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 py-6 group"
            >
              <div className="sm:w-44 shrink-0 flex items-center gap-2 text-sm text-slate-600">
                <Calendar size={15} className="text-gold-700" />
                {formatDate((event as FcsEvent).date)}
              </div>
              <h3 className="font-display text-lg flex-1 group-hover:text-forest-700 transition-colors">
                {(event as FcsEvent).title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={15} className="text-gold-700" />
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
