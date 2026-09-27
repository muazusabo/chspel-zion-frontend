'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/shared/brand-logo';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/announcements', label: 'Announcements' },
  { href: '/events', label: 'Events' },
  { href: '/executives', label: 'Executives' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/give', label: 'Give' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-t-2 border-t-gold-500 border-b border-ink-100/80 bg-paper/95 shadow-[0_4px_18px_rgba(16,26,43,0.045)] backdrop-blur-md">
      <div className="container flex h-[4.5rem] items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
          <BrandLogo className="h-10 w-10 rounded-sm bg-ink p-1.5 text-paper ring-1 ring-gold-500/50" />
          <span className="leading-tight text-ink">
            <span className="block font-display text-base sm:text-lg">SAZU FCS</span>
            <span className="block text-[9px] font-medium tracking-[0.12em] text-slate uppercase sm:text-[10px]">
              Fellowship of Christian Students
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 rounded-sm bg-ink-50/70 p-1 xl:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(`${link.href}/`));

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative rounded-sm px-2.5 py-2 text-[13px] font-medium text-ink-600 transition-colors hover:bg-paper hover:text-ink',
                  active && 'bg-paper text-ink shadow-sm',
                )}
              >
                <span className="relative z-10">{link.label}</span>
                {active && (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 bg-gold-500" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          {loading ? null : user ? (
            <>
              {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">Admin</Button>
                </Link>
              )}
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="gold" size="sm">Join FCS <ArrowUpRight size={15} aria-hidden="true" /></Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="mr-1 flex h-11 w-11 items-center justify-center rounded-sm text-ink transition-colors hover:bg-ink-50 xl:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-controls="site-navigation"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-100 bg-paper/95 xl:hidden">
          <nav id="site-navigation" className="container flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === link.href || (link.href !== '/' && pathname.startsWith(`${link.href}/`)) ? 'page' : undefined}
                className={cn(
                  'border-l-2 border-transparent px-3 py-3 text-base font-medium text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink',
                  pathname === link.href && 'border-gold-500 bg-ink-50 text-ink',
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 flex flex-col gap-2 border-t border-ink-100 pt-4">
              {user ? (
                <>
                  {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                    <Link href="/admin" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full">Admin</Button>
                    </Link>
                  )}
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full">Dashboard</Button>
                  </Link>
                  <Button variant="outline" className="w-full" onClick={logout}>Logout</Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full">Login</Button>
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    <Button variant="gold" className="w-full">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
