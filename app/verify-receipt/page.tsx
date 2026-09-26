'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Search, XCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface VerifyResult {
  valid: boolean;
  receiptNumber?: string;
  paymentType?: string;
  amount?: string;
  date?: string;
  status?: string;
  transactionReference?: string;
}

function VerifyReceiptInner() {
  const searchParams = useSearchParams();
  const [receiptNumber, setReceiptNumber] = useState(searchParams.get('number') ?? '');
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const runVerify = async (number: string) => {
    if (!number) return;
    setLoading(true);
    setChecked(false);
    try {
      const res = await api.get<VerifyResult>(`/api/verify-receipt/${encodeURIComponent(number)}`, { skipAuth: true });
      setResult(res);
    } catch {
      setResult({ valid: false });
    } finally {
      setLoading(false);
      setChecked(true);
    }
  };

  useEffect(() => {
    if (searchParams.get('number')) runVerify(searchParams.get('number')!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageHeader eyebrow="Verify" title="Verify a Receipt" description="Enter a receipt number to confirm it's genuine." />

      <section className="container py-16 max-w-lg">
        <form
          onSubmit={(e) => { e.preventDefault(); runVerify(receiptNumber); }}
          className="flex gap-3 mb-10"
        >
          <Input
            placeholder="e.g. SAZUFCS-20260101-A1B2C3"
            value={receiptNumber}
            onChange={(e) => setReceiptNumber(e.target.value)}
          />
          <Button type="submit" variant="gold" disabled={loading}>
            <Search size={15} /> Verify
          </Button>
        </form>

        {checked && result?.valid && (
          <div className="rounded-md border border-forest-100 bg-forest-50 p-6">
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle2 className="text-forest-700" size={22} />
              <p className="font-display text-lg">Receipt is valid</p>
            </div>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Receipt Number</dt><dd className="font-medium">{result.receiptNumber}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Payment Type</dt><dd className="font-medium">{result.paymentType?.replace('_', ' ')}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Amount</dt><dd className="font-medium">{result.amount && formatCurrency(result.amount)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Date</dt><dd className="font-medium">{result.date && formatDate(result.date)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Status</dt><dd className="font-medium">{result.status}</dd></div>
            </dl>
          </div>
        )}

        {checked && !result?.valid && (
          <div className="rounded-md border border-red-100 bg-red-50 p-6 flex items-center gap-2">
            <XCircle className="text-red-700" size={22} />
            <p className="text-sm text-red-800">No receipt found with that number.</p>
          </div>
        )}
      </section>
    </>
  );
}

export default function VerifyReceiptPage() {
  return (
    <Suspense fallback={null}>
      <VerifyReceiptInner />
    </Suspense>
  );
}
