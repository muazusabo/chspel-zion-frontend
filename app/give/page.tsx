'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HandCoins } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/shared/page-header';
import { CopyButton } from '@/components/shared/copy-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { ChapelAccount, GivingType } from '@/types';

const GIVING_TYPES: { value: GivingType; label: string; description: string }[] = [
  { value: 'OFFERING', label: 'Offering', description: 'A general offering to support the fellowship.' },
  { value: 'TITHE', label: 'Tithe', description: 'Your regular tithe.' },
  { value: 'DONATION', label: 'Donation', description: 'A one-time gift toward fellowship needs.' },
  { value: 'SPECIAL_CONTRIBUTION', label: 'Special Contribution', description: 'For a specific program or need.' },
  { value: 'BUILDING_PROJECT', label: 'Building / Project', description: 'Toward the chapel building or a project.' },
  { value: 'OTHER', label: 'Other', description: 'Any other form of giving.' },
];

const QUICK_AMOUNTS = [1000, 2500, 5000, 10000];

const FALLBACK_ACCOUNT: ChapelAccount = {
  id: '',
  bankName: '[CHAPEL BANK NAME]',
  accountName: '[CHAPEL ACCOUNT NAME]',
  accountNumber: '[ACCOUNT NUMBER]',
};

export default function GivePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [givingType, setGivingType] = useState<GivingType>('OFFERING');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<ChapelAccount>(FALLBACK_ACCOUNT);
  const [accountLoading, setAccountLoading] = useState(true);
  const [accountError, setAccountError] = useState(false);

  useEffect(() => {
    api.get<ChapelAccount>('/api/chapel/account', { skipAuth: true })
      .then(setAccount)
      .catch(() => setAccountError(true))
      .finally(() => setAccountLoading(false));
  }, []);

  const handleGive = async () => {
    setError(null);
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount < 100) {
      setError('Please enter an amount of at least ₦100.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await api.post<{ success: boolean; message: string; reference: string; transactionId: string; paymentMethod: string }>('/api/payments/offline-request', {
        amount: numericAmount,
        givingType,
        note: note || undefined,
      });

      if (result.success) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit your giving request. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Give"
        title="Support the fellowship"
        description="Submit your offering, tithe, or donation and complete the transfer through the chapel account details provided below. Admin approval is required before a receipt is issued."
      />

      <section className="container grid max-w-6xl gap-10 py-12 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="h-fit border-y border-ink-100 bg-white p-6 sm:p-8">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Chapel account</p>
            <h2 className="mt-1 font-display text-xl">Transfer details</h2>
            <p className="mt-2 text-sm text-slate-500">Use these details to complete your giving.</p>
          </div>
          {accountLoading && <p className="text-sm text-slate-500">Loading transfer details…</p>}
          {!accountLoading && accountError && (
            <p className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Transfer details could not be loaded. Please refresh or open the account details page.
            </p>
          )}
          {!accountLoading && <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-slate-400">Bank Name</p>
              <p className="mt-1 text-sm font-medium text-ink">{account.bankName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Account Name</p>
              <p className="mt-1 text-sm font-medium text-ink">{account.accountName}</p>
            </div>
            <div className="flex items-end justify-between gap-3 sm:block">
              <div>
                <p className="text-xs text-slate-400">Account Number</p>
                <p className="mt-1 break-all text-sm font-medium tracking-wide text-ink">{account.accountNumber}</p>
              </div>
              {!accountLoading && <CopyButton value={account.accountNumber} />}
            </div>
          </div>}
        </div>

        {!loading && !user ? (
          <div className="h-fit rounded-sm border border-ink-100 bg-white p-8 text-center">
            <HandCoins className="mx-auto mb-4 text-fcs-700" size={28} />
            <p className="font-display text-lg mb-2">Sign in to submit your giving</p>
            <p className="text-sm text-slate-600 mb-6">
              gives toward the fellowship.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/login"><Button variant="outline">Login</Button></Link>
              <Link href="/register"><Button variant="gold">Register</Button></Link>
            </div>
            <p className="text-sm text-slate-500 mt-6">
              Prefer a direct bank transfer?{' '}
              <Link href="/give/account" className="text-ink underline underline-offset-4">
                View chapel account details
              </Link>
            </p>
          </div>
        ) : (
          <div className="space-y-8 rounded-sm border border-ink-100 bg-white p-6 sm:p-8">
            <div>
              <Label>Giving Type</Label>
              <div className="grid gap-3 mt-2 sm:grid-cols-2">
                {GIVING_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    aria-pressed={givingType === type.value}
                    onClick={() => setGivingType(type.value)}
                    className={`text-left rounded-sm border p-4 transition-colors ${
                      givingType === type.value
                        ? 'border-fcs-500 bg-fcs-50'
                        : 'border-ink-100 bg-white hover:border-fcs-300'
                    }`}
                  >
                    <p className="text-sm font-medium text-ink">{type.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="amount">Amount (NGN)</Label>
              <Input
                id="amount"
                type="number"
                min={100}
                placeholder="e.g. 5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="flex gap-2 mt-3">
                {QUICK_AMOUNTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAmount(String(a))}
                    className="text-xs px-3 py-1.5 rounded-sm border border-ink-200 bg-white text-ink-600 hover:border-fcs-500"
                  >
                    ₦{a.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea id="note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>

            {error && <p className="text-sm text-red-700">{error}</p>}

            <Button variant="gold" size="lg" className="w-full" onClick={handleGive} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Giving Request'}
            </Button>

            <p className="text-sm text-slate-500 text-center leading-relaxed">
              Give joyfully and faithfully. “God loves a cheerful giver.”{' '}
              <span className="text-ink">2 Corinthians 9:7</span>
            </p>
          </div>
        )}
      </section>
    </>
  );
}
