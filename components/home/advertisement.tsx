import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Megaphone } from 'lucide-react';
import { api } from '@/lib/api';
import type { Announcement, Paginated } from '@/types';

async function getAdvertisement(): Promise<{ announcement: Announcement | null; failed: boolean }> {
  const result = await api
    .get<Paginated<Announcement>>('/api/announcements?limit=1', {
      skipAuth: true,
      next: { revalidate: 60 },
    })
    .catch(() => null);

  return { announcement: result?.items[0] ?? null, failed: result === null };
}

export async function Advertisement() {
  const { announcement, failed } = await getAdvertisement();
  if (!announcement && !failed) return null;

  if (failed) {
    return (
      <section className="border-y border-ink-100 bg-ink-50">
        <div className="container py-4 text-sm text-slate-600">
          Chapel updates are temporarily unavailable. Please check the announcements page again soon.
        </div>
      </section>
    );
  }

  if (!announcement) return null;

  return (
    <section className="border-y-2 border-gold-400 bg-gold-50">
      <div className="container flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {announcement.imageUrl ? (
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-md bg-ink-100 sm:h-24 sm:w-32">
              <Image
                src={announcement.imageUrl}
                alt={announcement.title}
                fill
                sizes="(max-width: 640px) 96px, 128px"
                className="object-cover"
              />
            </div>
          ) : (
            <Megaphone className="mt-1 shrink-0 text-gold-700" size={24} />
          )}
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-700">From the chapel</p>
            <h2 className="mt-1 font-display text-xl font-bold leading-snug text-ink sm:text-2xl">{announcement.title}</h2>
            <p className="mt-2 line-clamp-3 text-sm font-medium leading-relaxed text-slate-700">{announcement.description}</p>
          </div>
        </div>
        <Link
          href={`/announcements/${announcement.id}`}
          className="inline-flex shrink-0 items-center gap-1 self-start rounded-sm bg-ink px-4 py-2 text-sm font-bold text-paper hover:bg-ink-700 sm:self-center"
        >
          Read notice <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  );
}