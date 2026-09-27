import type { Metadata } from 'next';
import { BookOpen, HandHeart, Heart, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import type { AboutContent } from '@/types';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about SAZU FCS — who we are, our mission, vision, and what we do.',
};

const ACTIVITIES = [
  { icon: BookOpen, label: 'Bible Study' },
  { icon: Heart, label: 'Prayer' },
  { icon: Users, label: 'Worship' },
  { icon: HandHeart, label: 'Evangelism' },
  { icon: BookOpen, label: 'Discipleship' },
  { icon: Users, label: 'Fellowship' },
  { icon: HandHeart, label: 'Outreach' },
  { icon: Heart, label: 'Student Support' },
];

const FALLBACK: AboutContent = {
  whoWeAre:
    'SAZU FCS is a community of university students who gather to grow in faith, encourage one another, and serve the campus and wider community in the name of Christ.',
  mission: '[Set the mission statement from the admin dashboard]',
  vision: '[Set the vision statement from the admin dashboard]',
  values: '[Set core values from the admin dashboard]',
  whatWeDo: 'Bible Study, Prayer, Worship, Evangelism, Discipleship, Fellowship, Outreach, Student support.',
};

async function getAbout(): Promise<AboutContent> {
  return api.get<AboutContent>('/api/about', { skipAuth: true }).catch(() => FALLBACK);
}

export default async function AboutPage() {
  const about = await getAbout();

  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Who we are, and why we gather"
        description="SAZU FCS exists to help students know Christ and grow together in faith throughout their time at university."
      />

      <section className="container max-w-5xl py-14 sm:py-20">
        <div className="grid gap-10 border-b border-ink-100 pb-12 md:grid-cols-[0.7fr_1.3fr] md:gap-16">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-fcs-700">Who We Are</h2>
          <p className="text-lg leading-8 text-slate-600">{about.whoWeAre}</p>
        </div>

        <div className="grid gap-10 border-b border-ink-100 py-12 md:grid-cols-2 md:gap-16">
          <div className="border-l-2 border-fcs-500 pl-5">
            <h3 className="mb-3 text-xl">Our Mission</h3>
            <p className="leading-7 text-slate-600">{about.mission}</p>
          </div>
          <div className="border-l-2 border-gold-500 pl-5">
            <h3 className="mb-3 text-xl">Our Vision</h3>
            <p className="leading-7 text-slate-600">{about.vision}</p>
          </div>
        </div>

        <div className="grid gap-6 border-b border-ink-100 py-12 md:grid-cols-[0.7fr_1.3fr] md:gap-16">
          <h3 className="text-xl">Our Values</h3>
          <p className="leading-7 text-slate-600">{about.values}</p>
        </div>

        <h3 className="mb-6 mt-12 text-xl">What We Do</h3>
        <div className="grid grid-cols-2 gap-0 border-y border-ink-100 sm:grid-cols-4">
          {ACTIVITIES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 border-b border-r border-ink-100 px-3 py-7 text-center last:border-r-0 sm:border-b-0"
            >
              <Icon size={22} className="text-fcs-700" />
              <span className="text-sm text-ink">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
