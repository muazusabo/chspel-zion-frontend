'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Check,
  Copy,
  HandCoins,
  Landmark,
  Receipt as ReceiptIcon,
  Wallet,
} from 'lucide-react';
import { api, downloadReceiptPdf } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { formatCurrency, formatDate } from '@/lib/utils';
import { RequireAuth } from '@/components/shared/require-auth';
import { DashboardStatCard } from '@/components/dashboard/dashboard-stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ChapelAccount, Transaction } from '@/types';

interface DashboardStats {
  totalGiving: number;
  totalDonations: number;
  totalOfferings: number;
  totalReceipts: number;
}

const FALLBACK_ACCOUNT: ChapelAccount = {
  id: '',
  bankName: '[CHAPEL BANK NAME]',
  accountName: '[CHAPEL ACCOUNT NAME]',
  accountNumber: '[ACCOUNT NUMBER]',
};

function DashboardInner() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [account, setAccount] = useState<ChapelAccount>(FALLBACK_ACCOUNT);
  const [copied, setCopied] = useState(false);
  const [receiptRequested, setReceiptRequested] = useState(false);
  const [receiptSubmitting, setReceiptSubmitting] = useState(false);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const [receiptAmount, setReceiptAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      api.get<DashboardStats>('/api/users/me/dashboard').then(setStats),
      api.get<Transaction[]>('/api/payments/mine').then((items) => setTransactions(items.slice(0, 5))),
      api.get<ChapelAccount>('/api/chapel/account', { skipAuth: true }).then(setAccount),
    ]).then((results) => {
      setLoadError(results.some((result) => result.status === 'rejected'));
      setLoading(false);
    });
  }, []);

  const copyAccountNumber = async () => {
    await navigator.clipboard.writeText(account.accountNumber);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const requestReceipt = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReceiptError(null);
    setReceiptSubmitting(true);
    try {
      const formData = new FormData(event.currentTarget);
      formData.set('amount', receiptAmount);
      formData.set('givingType', 'OTHER');
      await api.postForm('/api/payments/offline-request', formData);
      const updatedRequests = await api.get<Transaction[]>('/api/payments/mine');
      setTransactions(updatedRequests.slice(0, 5));
      setReceiptRequested(true);
    } catch (error) {
      setReceiptError(error instanceof Error ? error.message : 'Could not submit the receipt request.');
    } finally {
      setReceiptSubmitting(false);
    }
  };

  const statCards = [
    { label: 'Total giving', value: stats ? formatCurrency(stats.totalGiving) : '—', icon: Landmark, tone: 'bg-gold-50 text-gold-700' },
    { label: 'Donations', value: stats ? formatCurrency(stats.totalDonations) : '—', icon: HandCoins, tone: 'bg-forest-50 text-forest-700' },
    { label: 'Offerings', value: stats ? formatCurrency(stats.totalOfferings) : '—', icon: Wallet, tone: 'bg-ink-50 text-ink-600' },
    { label: 'My receipts', value: stats ? String(stats.totalReceipts) : '—', icon: ReceiptIcon, tone: 'bg-gold-50 text-gold-700' },
  ];

  return (
    <section className="container max-w-7xl py-8 md:py-12">
      <div className="mb-9 flex flex-col gap-5 border-b border-ink-100 pb-8 md:mb-10 md:flex-row md:items-end md:justify-between md:pb-10">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold-700">Member dashboard</p>
          <h1 className="text-3xl md:text-4xl">Welcome, {user?.fullName.split(' ')[0]}</h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">Your giving records and fellowship updates, together in one place.</p>
        </div>
        <Link href="/give/account" className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-gold-700">View transfer details <ArrowUpRight size={16} /></Link>
      </div>
      {loadError && <p className="mb-6 border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-ink-700">Some dashboard information could not be loaded. Please refresh and try again.</p>}
      {loading && <p className="mb-6 text-sm text-slate-500">Loading your fellowship dashboard…</p>}

      <div className="mb-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => <DashboardStatCard key={stat.label} {...stat} />)}
      </div>

      <div className="mb-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden border-ink-100">
          <CardHeader className="border-b border-ink-100 pb-5">
            <div className="flex items-start justify-between gap-4">
              <div><CardTitle className="flex items-center gap-2 text-xl"><Landmark size={20} className="text-gold-700" /> Chapel Account Details</CardTitle><CardDescription className="mt-2">Use these details for offline bank transfers.</CardDescription></div>
              <span className="rounded-full bg-forest-50 px-3 py-1 text-xs font-medium text-forest-700">Offline giving</span>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 p-6 sm:grid-cols-3">
            <div><p className="text-xs uppercase tracking-[0.14em] text-slate-400">Bank Name</p><p className="mt-2 font-medium text-ink">{account.bankName}</p></div>
            <div><p className="text-xs uppercase tracking-[0.14em] text-slate-400">Account Name</p><p className="mt-2 font-medium text-ink">{account.accountName}</p></div>
            <div className="flex items-end justify-between gap-3 sm:block"><div><p className="text-xs uppercase tracking-[0.14em] text-slate-400">Account Number</p><p className="mt-2 font-medium tracking-wide text-ink">{account.accountNumber}</p></div><button type="button" onClick={copyAccountNumber} className="mt-2 inline-flex items-center gap-1 text-xs text-ink underline underline-offset-4 hover:text-gold-700">{copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy'}</button></div>
          </CardContent>
        </Card>

        <Card className="border-ink-100">
          <CardHeader className="pb-4"><CardTitle className="flex items-center gap-2 text-xl"><ReceiptIcon size={20} className="text-gold-700" /> Submit Transfer</CardTitle><CardDescription className="mt-2">Send your transfer evidence for admin approval. Your receipt is generated after approval.</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={requestReceipt} className="space-y-4"><div><Label htmlFor="receipt-amount">Amount transferred (NGN)</Label><Input id="receipt-amount" type="number" min={100} value={receiptAmount} onChange={(event) => setReceiptAmount(event.target.value)} placeholder="e.g. 5000" required /></div><div><Label htmlFor="transaction-screenshot">Transaction screenshot</Label><Input id="transaction-screenshot" name="transactionScreenshot" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" required /><p className="mt-1 text-xs text-slate-500">Upload a clear screenshot of your successful bank transfer.</p></div><div><Label htmlFor="receipt-date">Transfer date</Label><Input id="receipt-date" name="transferDate" type="date" required /></div><Button type="submit" variant="gold" className="w-full" disabled={receiptSubmitting}>{receiptSubmitting ? 'Submitting…' : 'Submit for approval'}</Button></form>
            {receiptError && <p className="mt-3 text-xs text-red-700">{receiptError}</p>}
            <div className="mt-4 min-h-12 border border-dashed border-ink-200 bg-ink-50/50 p-3 text-center text-xs text-slate-500">{receiptRequested ? 'Transfer submitted. An admin will review it under Payments, then your receipt will be generated.' : 'Your receipt will be generated after an admin approves the transfer.'}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="border-ink-100">
          <CardHeader className="flex flex-row items-center justify-between pb-4"><div><CardTitle className="text-xl">My Receipts</CardTitle><CardDescription className="mt-1">Track requests and download approved receipt files.</CardDescription></div><Link href="/receipts" className="text-sm font-medium text-ink underline underline-offset-4">View all</Link></CardHeader>
          <CardContent className="pt-0">{transactions.length === 0 ? <div className="border-t border-ink-100 py-8 text-sm text-slate-500">No receipt requests yet. Submit one above after your bank transfer.</div> : <div className="divide-y divide-ink-100 border-y border-ink-100">{transactions.map((transaction) => <div key={transaction.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium text-ink">Receipt request</p><p className="mt-1 text-xs text-slate-400">Transfer submitted · {transaction.metadata?.transferDate ? formatDate(transaction.metadata.transferDate) : formatDate(transaction.createdAt)}</p><Badge variant={transaction.status === 'SUCCESSFUL' ? 'forest' : transaction.status === 'PENDING' ? 'gold' : 'urgent'}>{transaction.status === 'SUCCESSFUL' ? 'APPROVED' : transaction.status === 'FAILED' ? 'REJECTED' : 'PENDING'}</Badge></div><div className="flex items-center gap-3 sm:text-right"><p className="text-sm font-medium text-ink">{formatCurrency(transaction.amount)}</p>{transaction.status === 'SUCCESSFUL' && transaction.receipt && <button type="button" onClick={() => downloadReceiptPdf(transaction.receipt!.id, `${transaction.receipt!.receiptNumber}.pdf`)} className="text-xs font-medium text-ink underline underline-offset-4 hover:text-gold-700">Download Receipt</button>}</div></div>)}</div>}</CardContent>
        </Card>

      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardInner />
    </RequireAuth>
  );
}
