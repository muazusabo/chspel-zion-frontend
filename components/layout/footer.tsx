import Link from 'next/link';
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
  return (
    <footer className="bg-ink-900 text-ink-100">
      <div className="container grid gap-10 py-12 sm:grid-cols-2 md:grid-cols-3 md:gap-16 md:py-16">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <BrandLogo className="h-9 w-9 rounded-sm bg-paper p-1.5 text-ink" />
            <span className="font-display text-lg text-paper">SAZU FCS</span>
          </div>
          <p className="text-sm text-ink-300 max-w-xs">
            Fellowship of Christian Students — growing in faith, building
            community, serving with purpose.
          </p>
        </div>

        <div>
          <h4 className="font-display text-paper text-base mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-ink-300">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold-300 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-paper text-base mb-4">Contact</h4>
          <ul className="space-y-2.5 text-sm text-ink-300">
            <li>Sazufcschapelofzion@gmail.com</li>
            <li>Gadu main campus</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-ink-700">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-400">
          <p>&copy; {new Date().getFullYear()} SAZU FCS. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-gold-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold-300">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
