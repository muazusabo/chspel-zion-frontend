import type { Metadata } from 'next';
import Image from 'next/image';
import { Users } from 'lucide-react';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/shared/page-header';
import type { Executive } from '@/types';

export const metadata: Metadata = {
  title: 'Executives',
  description: 'Meet the SAZU FCS executive team leading the fellowship.',
};

async function getExecutives(): Promise<Executive[]> {
  return api.get<Executive[]>('/api/executives', { skipAuth: true }).catch(() => []);
}

export default async function ExecutivesPage() {
  const executives = await getExecutives();

  return (
    <>
      <PageHeader
        eyebrow="Leadership"
        title="Our Executives"
        description="The students who serve the fellowship in leadership, this academic session."
      />

      <section className="bg-white py-14 md:py-20">
        <div className="container">
          <div className="mb-10 flex flex-col gap-3 border-b border-ink-100 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-fcs-700">Student Executives</p>
              <h2 className="text-3xl text-fcs-900 md:text-4xl">FCS Chapel leadership</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-500 sm:text-right">
              Meet the students serving the fellowship in this academic session.
            </p>
          </div>
          {executives.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-fcs-50 text-fcs-700">
                <Users size={24} />
              </div>
              <p className="font-display text-lg text-ink">Executives will be listed here soon.</p>
            </div>
          )}

          {executives.length > 0 && (
            <div className="responsive-content-grid">
              {executives.map((exec) => (
                <article key={exec.id} className="group overflow-hidden rounded-sm border border-ink-100 bg-white transition-colors hover:border-fcs-500">
                  <div className="relative aspect-[4/5] overflow-hidden bg-ink-50">
                    {exec.photoUrl && !exec.photoUrl.startsWith('[') ? (
                      <Image src={exec.photoUrl} alt={exec.fullName} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <Users size={28} />
                      </div>
                    )}
                  </div>
                  <div className="min-h-[132px] p-5">
                    <h3 className="text-xl leading-snug text-ink">{exec.fullName}</h3>
                    <p className="mb-1 mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-fcs-700">{exec.position}</p>
                    {(exec.department || exec.level) && <p className="mt-2 text-sm text-slate-500">{[exec.department, exec.level].filter(Boolean).join(' · ')}</p>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
