'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { formatCurrency, formatDate } from '@/lib/utils';
import { RequireAuth } from '@/components/shared/require-auth';
import { Loading } from '@/components/shared/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Transaction } from '@/types';

interface ReceiptRequestFormState {
  transactionId: string;
  fullName: string;
}

function RequestReceiptInner() {
  const router = useRouter();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [form, setForm] = useState<ReceiptRequestFormState>({ transactionId: '', fullName: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.fullName) {
      setForm((prev) => ({ ...prev, fullName: prev.fullName || user.fullName }));
    }
  }, [user?.fullName]);

  useEffect(() => {
    api.get<Transaction[]>('/api/payments/mine')
      .then((items) => {
        const eligible = items.filter((item) => item.status === 'SUCCESSFUL' && !item.receipt);
        setTransactions(eligible);
        if (eligible[0]) {
          setSelected(eligible[0]);
          setForm((prev) => ({ ...prev, transactionId: eligible[0].id }));
        }
      })
      .catch(() => setError('We could not load your successful transactions.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const requestedName = form.fullName.trim();

    try {
      await api.post('/api/receipts/request', {
        transactionId: form.transactionId,
        requestedName,
      });
      router.push('/receipts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit your receipt request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading label="Loading eligible transactions…" />;

  return (
    <section className="container max-w-4xl py-14">
      <div className="mb-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-gold-700">FCS portal</p>
        <h1 className="text-3xl">REQUEST OFFICIAL RECEIPT</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">Submit your payment details to request an official FCS receipt.</p>
      </div>

      {error && <p className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {transactions.length === 0 ? (
        <div className="rounded-md border border-ink-100 bg-paper p-8 text-sm text-slate-600">
          No successful payment is currently eligible for a receipt request.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-md border border-ink-100 bg-paper p-6 shadow-[0_10px_30px_rgba(16,26,43,0.04)]">
          <div className="mb-6 rounded-md border border-gold-100 bg-gold-50 p-4 text-sm text-ink-700">
            Select a successful payment below and provide the exact name to appear on the final official receipt.
          </div>

          <div className="space-y-5">
            <div>
              <Label htmlFor="transactionId">Eligible Transaction</Label>
              <select
                id="transactionId"
                className="mt-2 block w-full rounded-md border border-ink-200 bg-paper px-3 py-2.5 text-sm text-ink"
                value={form.transactionId}
                onChange={(event) => {
                  const next = transactions.find((item) => item.id === event.target.value) ?? null;
                  setSelected(next);
                  setForm((prev) => ({ ...prev, transactionId: event.target.value }));
                }}
              >
                <option value="">Select a transaction</option>
                {transactions.map((transaction) => (
                  <option key={transaction.id} value={transaction.id}>
                    {transaction.reference} · {transaction.givingType.replace('_', ' ')} · {formatCurrency(transaction.amount)}
                  </option>
                ))}
              </select>
            </div>

            {selected && (
              <div className="grid gap-4 rounded-md border border-ink-100 bg-ink-50 p-4 md:grid-cols-2">
                <div><p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Transaction</p><p className="mt-1 font-medium text-ink">{selected.reference}</p></div>
                <div><p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Payment Type</p><p className="mt-1 font-medium text-ink">{selected.givingType.replace('_', ' ')}</p></div>
                <div><p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Amount</p><p className="mt-1 font-medium text-ink">{formatCurrency(selected.amount)}</p></div>
                <div><p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Date</p><p className="mt-1 font-medium text-ink">{formatDate(selected.createdAt)}</p></div>
                <div className="md:col-span-2"><p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Transaction Reference</p><p className="mt-1 font-medium text-ink break-all">{selected.reference}</p></div>
              </div>
            )}

            <div>
              <div>
                <Label htmlFor="fullName">FULL NAME</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                  placeholder="Enter your full name"
                  className="mt-2"
                  required
                />
              </div>
            </div>

            <div className="mt-2 text-xs text-slate-500">
              Name on receipt: {form.fullName.trim() || 'Full name preview'}.
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="gold" disabled={submitting || !form.transactionId || !form.fullName.trim()}>
                {submitting ? 'Submitting…' : 'Submit Receipt Request'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}

export default function RequestReceiptPage() {
  return (
    <RequireAuth>
      <RequestReceiptInner />
    </RequireAuth>
  );
}
