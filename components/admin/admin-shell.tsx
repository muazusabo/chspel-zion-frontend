'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { ADMIN_NAV, type AdminNavBadgeKey } from './admin-nav';
import { BrandLogo } from '@/components/shared/brand-logo';

function formatNavBadge(value: number) {
  if (value <= 0) return null;
  return value > 99 ? '99+' : String(value);
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [navCounts, setNavCounts] = useState<Record<AdminNavBadgeKey, number>>({
    pendingReceiptRequests: 0,
    pendingPayments: 0,
    unreadMessages: 0,
  });

  useEffect(() => {
    let active = true;

    const loadCounts = async () => {
      try {
        const stats = await api.get<{ pendingReceiptRequests?: number; pendingPayments?: number; unreadMessages?: number }>('/api/admin/dashboard');
        if (!active) return;
        setNavCounts({
          pendingReceiptRequests: stats.pendingReceiptRequests ?? 0,
          pendingPayments: stats.pendingPayments ?? 0,
          unreadMessages: stats.unreadMessages ?? 0,
        });
      } catch {
        if (!active) return;
        setNavCounts({ pendingReceiptRequests: 0, pendingPayments: 0, unreadMessages: 0 });
      }
    };

    loadCounts();
    const intervalId = window.setInterval(loadCounts, 15000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-ink-100 px-5 py-5">
        <Link href="/admin" className="flex items-center gap-2.5" onClick={onNavigate}>
          <BrandLogo className="h-8 w-8 rounded-sm border border-ink-100 bg-white p-1 text-fcs-700" />
          <span className="font-display text-base text-ink">SAZU FCS</span>
        </Link>
        {onNavigate && (
          <button type="button" onClick={onNavigate} className="flex h-10 w-10 items-center justify-center rounded-sm text-ink-600 hover:bg-ink-50" aria-label="Close admin navigation">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {ADMIN_NAV.map((group, gi) => {
          const items = group.items.filter((item) => !item.roles || (user && item.roles.includes(user.role)));
          if (items.length === 0) return null;
          return (
            <div key={gi} className="mb-5">
              {group.label && (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">{group.label}</p>
              )}
              {items.map((item) => {
                const active = pathname === item.href;
                const badgeValue = item.badgeKey ? navCounts[item.badgeKey] ?? 0 : 0;
                const badge = formatNavBadge(badgeValue);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      'flex items-center gap-3 rounded-sm border-l-2 border-transparent px-3 py-2.5 text-sm transition-colors',
                      active ? 'border-fcs-500 bg-fcs-50 font-semibold text-fcs-900' : 'text-slate-600 hover:bg-ink-50 hover:text-ink',
                    )}
                  >
                    <item.icon size={16} />
                    <span className="flex-1 min-w-0">{item.label}</span>
                    {badge && (
                      <span className="inline-flex min-w-6 items-center justify-center rounded-sm bg-gold-50 px-1.5 py-0.5 text-[10px] font-semibold text-gold-700">
                        {badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-ink-100 p-4">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-ink-600 hover:text-gold-700"
        >
          <ExternalLink size={15} /> View public site
        </Link>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#f4f7fb]">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-ink-100 bg-white lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-ink-900/35" onClick={() => setMobileOpen(false)} aria-label="Close admin navigation" />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] shadow-2xl">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-ink-100 bg-white px-4 lg:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            <BrandLogo className="h-7 w-7 rounded-sm border border-ink-100 bg-white p-1 text-fcs-700" />
            <span className="font-display text-sm text-ink">SAZU FCS Admin</span>
          </Link>
          <button onClick={() => setMobileOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded-sm text-ink hover:bg-ink-50" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        <div className="sticky top-0 z-30 hidden h-16 items-center justify-between border-b border-ink-100 bg-white/95 px-8 backdrop-blur lg:flex">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Administration</p>
            <p className="mt-0.5 text-sm font-medium text-ink">Fellowship control room</p>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-fcs-50 text-xs font-semibold text-fcs-700">
                {user.fullName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}
              </span>
              <div className="leading-tight">
                <p className="text-sm font-medium text-ink">{user.fullName}</p>
                <p className="mt-1 text-[11px] text-slate-500">{user.role.replace('_', ' ')}</p>
              </div>
            </div>
          )}
        </div>
        <div className="mx-auto max-w-[1320px] px-4 py-7 sm:px-6 lg:px-10 lg:py-9">
          {user && (
            <p className="mb-6 text-xs text-slate-500 lg:hidden">
              Signed in as <span className="font-medium text-ink">{user.fullName}</span> · {user.role.replace('_', ' ')}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
