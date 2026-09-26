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

      <section className="container py-20 max-w-3xl">
        <h2 className="text-2xl mb-4">Who We Are</h2>
        <p className="text-slate-600 leading-relaxed mb-14">{about.whoWeAre}</p>

        <div className="grid sm:grid-cols-2 gap-10 mb-14">
          <div>
            <h3 className="text-xl mb-3">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed">{about.mission}</p>
          </div>
          <div>
            <h3 className="text-xl mb-3">Our Vision</h3>
            <p className="text-slate-600 leading-relaxed">{about.vision}</p>
          </div>
        </div>

        <h3 className="text-xl mb-3">Our Values</h3>
        <p className="text-slate-600 leading-relaxed mb-14">{about.values}</p>

        <h3 className="text-xl mb-6">What We Do</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {ACTIVITIES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center gap-3 rounded-md border border-ink-100 py-7 px-3"
            >
              <Icon size={22} className="text-gold-700" />
              <span className="text-sm text-ink">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
