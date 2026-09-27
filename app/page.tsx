import { api } from '@/lib/api';
import { Hero } from '@/components/home/hero';
import { Advertisement } from '@/components/home/advertisement';
import { Welcome } from '@/components/home/welcome';
import { ScriptureStrip } from '@/components/home/scripture-strip';
import { ImageSections } from '@/components/home/image-sections';
import { UpcomingEvents } from '@/components/home/upcoming-events';
import type { HomepageContent, Scripture } from '@/types';

const FALLBACK_HOMEPAGE: HomepageContent = {
  heroTitle: 'SAZU FCS',
  heroSubtitle: 'Fellowship of Christian Students',
  heroDescription: 'Growing in Faith. Building Community. Serving with Purpose.',
};

const FALLBACK_SCRIPTURE: Scripture = {
  verseText:
    '"For where two or three gather in my name, there am I with them."',
  reference: 'Matthew 18:20',
};

async function getHomepageData() {
  const [homepage, scripture] = await Promise.all([
    api.get<HomepageContent>('/api/homepage', { skipAuth: true, next: { revalidate: 60 } }).catch(() => FALLBACK_HOMEPAGE),
    api.get<Scripture>('/api/scripture', { skipAuth: true, next: { revalidate: 60 } }).catch(() => FALLBACK_SCRIPTURE),
  ]);
  return { homepage, scripture };
}

export default async function HomePage() {
  const { homepage, scripture } = await getHomepageData();

  return (
    <>
      <Hero content={homepage} />
      <Advertisement />
      <Welcome content={homepage} />
      <ScriptureStrip scripture={scripture} />
      <ImageSections content={homepage} />
      <UpcomingEvents />
    </>
  );
}
