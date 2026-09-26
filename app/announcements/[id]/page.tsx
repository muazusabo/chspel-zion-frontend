import { notFound } from 'next/navigation';
import Image from 'next/image';
import { api, ApiError } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { CATEGORY_LABELS, PRIORITY_VARIANT } from '@/lib/announcement-meta';
import { Badge } from '@/components/ui/badge';
import type { Announcement } from '@/types';

async function getAnnouncement(id: string): Promise<Announcement | null> {
  try {
    return await api.get<Announcement>(`/api/announcements/${id}`, { skipAuth: true });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export default async function AnnouncementDetailPage({ params }: { params: { id: string } }) {
  const announcement = await getAnnouncement(params.id);
  if (!announcement) notFound();

  return (
    <article className="container max-w-2xl py-20">
      <div className="flex items-center gap-2 mb-5">
        <Badge variant={PRIORITY_VARIANT[announcement.priority]}>
          {CATEGORY_LABELS[announcement.category]}
        </Badge>
        {announcement.priority === 'URGENT' && <Badge variant="urgent">Urgent</Badge>}
      </div>
      <h1 className="text-3xl md:text-4xl leading-tight mb-4">{announcement.title}</h1>
      {announcement.publishedAt && (
        <p className="text-sm text-slate-400 mb-8">{formatDate(announcement.publishedAt)}</p>
      )}
      {announcement.imageUrl && (
        <div className="relative aspect-video rounded-md overflow-hidden mb-8">
          <Image src={announcement.imageUrl} alt={announcement.title} fill className="object-cover" />
        </div>
      )}
      <p className="text-slate-700 leading-relaxed whitespace-pre-line">{announcement.description}</p>
    </article>
  );
}
