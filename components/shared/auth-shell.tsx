import Link from 'next/link';
import { BrandLogo } from '@/components/shared/brand-logo';

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container max-w-lg py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-md rounded-sm border border-ink-100 bg-white p-6 sm:p-9">
      <Link href="/" className="mb-9 flex items-center justify-center gap-2.5">
        <BrandLogo className="h-9 w-9 rounded-sm border border-ink-100 bg-white p-1.5 text-fcs-700" />
        <span className="font-display text-lg text-ink">SAZU FCS</span>
      </Link>
      <h1 className="mb-2 text-center text-2xl sm:text-3xl">{title}</h1>
      {subtitle && <p className="mb-8 text-center text-sm leading-6 text-slate-500">{subtitle}</p>}
      {children}
      </div>
    </section>
  );
}
