import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
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
    <footer className="bg-ink-800 text-ink-100">
      <div className="container py-16 grid gap-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <BrandLogo className="h-9 w-9 rounded-lg bg-paper p-1.5 text-ink" />
            <span className="font-display text-lg text-paper">SAZU FCS</span>
          </div>
          <p className="text-sm text-ink-300 max-w-xs">
            Fellowship of Christian Students — growing in faith, building
            community, serving with purpose.
          </p>
          <div className="flex gap-3 mt-5">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-600 text-ink-300 hover:border-gold-500 hover:text-gold-300 transition-colors"
                aria-label="Social link"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
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
            <li>[PHONE NUMBER]</li>
            <li>Gadu main campus</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-paper text-base mb-4">Chapel</h4>
          <p className="text-sm text-ink-300">
            Join us for fellowship, worship, and Bible study. Meeting times
            and location are set from the admin dashboard.
          </p>
          <Link
            href="/give/account"
            className="inline-block mt-4 text-sm text-gold-300 hover:underline"
          >
            View giving details →
          </Link>
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
