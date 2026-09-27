'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/shared/brand-logo';

const QUICK_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/announcements', label: 'Announcements' },
  { href: '/events', label: 'Events' },
  { href: '/executives', label: 'Executives' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/give', label: 'Give' },
  { href: '/contact', label: 'Contact' },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-[#0b1b33] text-white">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-[1.3fr_0.8fr_0.8fr] md:gap-16 md:py-18">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <BrandLogo className="h-9 w-9 rounded-sm border border-white/20 bg-white p-1.5 text-fcs-700" />
            <span className="font-display text-lg text-paper">SAZU FCS</span>
          </div>
          <p className="max-w-xs text-sm leading-7 text-white/65">
            Fellowship of Christian Students — growing in faith, building
            community, serving with purpose.
          </p>
        </div>

        <div>
          <h4 className="font-display text-paper text-base mb-4">Quick Links</h4>
          <ul className="space-y-3 text-sm text-white/65">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-paper text-base mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-white/65">
            <li>Sazufcschapelofzion@gmail.com</li>
            <li>Gadu main campus</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-white/15">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} SAZU FCS. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
