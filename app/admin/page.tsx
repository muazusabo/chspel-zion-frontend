'use client';

import { useEffect, useState } from 'react';
import {
  Users, HandCoins, Wallet, CreditCard, Clock,
  CalendarDays, Mail, TrendingUp, Receipt,
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { StatCard } from '@/components/admin/stat-card';
import { Loading } from '@/components/shared/loading';

interface DashboardStats {
  totalMembers: number;
  totalDonations: number;
  totalOfferings: number;
  successfulPayments: number;
  pendingPayments: number;
  pendingReceiptRequests: number;
  upcomingEvents: number;
  unreadMessages: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [donationsMonthly, setDonationsMonthly] = useState<Record<string, number>>({});
  const [offeringsMonthly, setOfferingsMonthly] = useState<Record<string, number>>({});

  useEffect(() => {
    api.get<DashboardStats>('/api/admin/dashboard').then(setStats).catch(() => {});
    api.get<Record<string, number>>('/api/admin/donations/monthly').then(setDonationsMonthly).catch(() => {});
    api.get<Record<string, number>>('/api/admin/offerings/monthly').then(setOfferingsMonthly).catch(() => {});
  }, []);

  if (!stats) return <Loading />;

  const months = Array.from(new Set([...Object.keys(donationsMonthly), ...Object.keys(offeringsMonthly)])).sort();
  const maxValue = Math.max(1, ...months.map((m) => (donationsMonthly[m] ?? 0) + (offeringsMonthly[m] ?? 0)));

  return (
    <>
      <AdminPageHeader title="Fellowship overview" description="A live view of membership, giving, and what needs attention." />

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Members" value={stats.totalMembers} icon={Users} />
        <StatCard label="Total Donations" value={formatCurrency(stats.totalDonations)} icon={HandCoins} />
        <StatCard label="Total Offerings" value={formatCurrency(stats.totalOfferings)} icon={Wallet} />
        <StatCard label="Successful Payments" value={stats.successfulPayments} icon={CreditCard} />
        <StatCard label="Pending Payments" value={stats.pendingPayments} icon={Clock} />
        <StatCard label="Pending Receipt Requests" value={stats.pendingReceiptRequests} icon={Receipt} />
        <StatCard label="Upcoming Events" value={stats.upcomingEvents} icon={CalendarDays} />
        <StatCard label="Unread Messages" value={stats.unreadMessages} icon={Mail} />
      </div>

      {months.length > 0 && (
        <div className="rounded-sm border border-ink-100 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={16} className="text-fcs-600" />
            <h2 className="text-lg font-display">Giving activity <span className="font-sans text-sm font-normal text-slate-500">· last {months.length} months</span></h2>
          </div>
          <div className="flex items-end gap-4 h-48">
            {months.map((m) => {
              const donationH = ((donationsMonthly[m] ?? 0) / maxValue) * 100;
              const offeringH = ((offeringsMonthly[m] ?? 0) / maxValue) * 100;
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center gap-1 h-40">
                    <div className="w-1/2 rounded-t-sm bg-fcs-500" style={{ height: `${donationH}%` }} />
                    <div className="w-1/2 rounded-t-sm bg-gold-500" style={{ height: `${offeringH}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400">{m.slice(5)}/{m.slice(2, 4)}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex gap-5 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-fcs-500" /> Donations</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-gold-500" /> Offerings</span>
          </div>
        </div>
      )}
    </>
  );
}
