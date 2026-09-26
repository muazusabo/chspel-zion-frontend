import { notFound } from 'next/navigation';
import Image from 'next/image';
import { CalendarDays, Clock, MapPin, User } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { FcsEvent } from '@/types';

async function getEvent(id: string): Promise<FcsEvent | null> {
  try {
    return await api.get<FcsEvent>(`/api/events/${id}`, { skipAuth: true });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);
  if (!event) notFound();

  return (
    <article className="py-16">
      {event.imageUrl && (
        <div className="container max-w-4xl mb-10">
          <div className="relative aspect-[16/9] rounded-md overflow-hidden">
            <Image src={event.imageUrl} alt={event.title} fill className="object-cover" priority />
          </div>
        </div>
      )}
      <div className="container max-w-2xl">
        {event.status === 'CANCELLED' && <Badge variant="urgent" className="mb-4">Cancelled</Badge>}
        <h1 className="text-3xl md:text-4xl leading-tight mb-6">{event.title}</h1>

        <div className="flex flex-col gap-3 text-slate-700 mb-8 pb-8 border-b border-ink-100">
          <div className="flex items-center gap-2.5">
            <CalendarDays size={17} className="text-gold-700" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center gap-2.5">
            <Clock size={17} className="text-gold-700" />
            {event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin size={17} className="text-gold-700" />
            {event.venue}
          </div>
          {event.organizer && (
            <div className="flex items-center gap-2.5">
              <User size={17} className="text-gold-700" />
              {event.organizer}
            </div>
          )}
        </div>

        <p className="text-slate-700 leading-relaxed whitespace-pre-line">{event.description}</p>
      </div>
    </article>
  );
}
