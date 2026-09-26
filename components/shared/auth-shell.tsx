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
    <section className="container py-16 md:py-24 max-w-md">
      <Link href="/" className="flex items-center justify-center gap-2.5 mb-10">
        <BrandLogo className="h-9 w-9 rounded-lg bg-paper p-1.5 text-ink ring-1 ring-ink-100" />
        <span className="font-display text-lg text-ink">SAZU FCS</span>
      </Link>
      <h1 className="text-2xl text-center mb-2">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 text-center mb-10">{subtitle}</p>}
      {children}
    </section>
  );
}
