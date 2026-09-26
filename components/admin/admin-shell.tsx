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
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-ink-700">
        <Link href="/admin" className="flex items-center gap-2.5" onClick={onNavigate}>
          <BrandLogo className="h-8 w-8 rounded-lg bg-paper p-1.5 text-ink" />
          <span className="font-display text-base text-paper">SAZU FCS Admin</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {ADMIN_NAV.map((group, gi) => {
          const items = group.items.filter((item) => !item.roles || (user && item.roles.includes(user.role)));
          if (items.length === 0) return null;
          return (
            <div key={gi} className="mb-5">
              {group.label && (
                <p className="px-3 text-[11px] uppercase tracking-wide text-ink-400 mb-2">{group.label}</p>
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
                      'flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors',
                      active ? 'bg-gold-500 text-ink' : 'text-ink-200 hover:bg-ink-700 hover:text-paper',
                    )}
                  >
                    <item.icon size={16} />
                    <span className="flex-1 min-w-0">{item.label}</span>
                    {badge && (
                      <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-gold-500 px-1.5 py-0.5 text-[10px] font-semibold text-ink shadow-sm">
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

      <div className="p-4 border-t border-ink-700">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-ink-300 hover:text-gold-300 px-3 py-2"
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
    <div className="flex min-h-screen bg-parchment">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-ink-800">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-ink-800">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-ink-800 px-4 h-16">
          <Link href="/admin" className="flex items-center gap-2">
            <BrandLogo className="h-7 w-7 rounded-lg bg-paper p-1 text-ink" />
            <span className="font-display text-sm text-paper">SAZU FCS Admin</span>
          </Link>
          <button onClick={() => setMobileOpen(true)} className="text-paper p-2" aria-label="Open menu">
            <Menu size={22} />
          </button>
        </header>

        <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-6xl">
          {user && (
            <p className="text-xs text-slate-400 mb-6">
              Signed in as <span className="text-ink font-medium">{user.fullName}</span> · {user.role.replace('_', ' ')}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
