'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Download, Printer } from 'lucide-react';
import { api, downloadReceiptPdf } from '@/lib/api';
import { amountToWords, formatShortDate } from '@/lib/utils';
import { RequireAuth } from '@/components/shared/require-auth';
import { Loading } from '@/components/shared/loading';
import { Button } from '@/components/ui/button';
import { FcsReceipt } from '@/components/receipts/FcsReceipt';
import type { Receipt } from '@/types';

function ReceiptDetailInner() {
  const params = useParams<{ id: string }>();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    api.get<Receipt>(`/api/receipts/${params.id}`)
      .then(setReceipt)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <Loading label="Loading receipt…" />;
  if (error || !receipt) {
    return (
      <section className="container py-14 max-w-lg">
        <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          This receipt could not be loaded. Please return to your receipts and try again.
        </p>
      </section>
    );
  }

  const numericAmount = Number(receipt.amount ?? receipt.transaction.amount ?? 0);
  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadReceiptPdf(receipt.id, `${receipt.receiptNumber}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="container max-w-6xl py-10 md:py-14">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between print:hidden">
        <Link href="/receipts" className="text-sm font-medium text-ink underline underline-offset-4">
          Back to Receipts
        </Link>
        <div className="flex flex-wrap gap-3">
          <Button variant="gold" onClick={handleDownload} disabled={downloading}>
            <Download size={15} /> {downloading ? 'Downloading…' : 'Download Receipt'}
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer size={15} /> Print Receipt
          </Button>
        </div>
      </div>

      <FcsReceipt
        receiptNumber={receipt.receiptNumber}
        date={formatShortDate(receipt.issuedAt ?? receipt.createdAt)}
        requestedName={receipt.requestedName || receipt.user?.fullName || '—'}
        amount={numericAmount}
        amountInWords={amountToWords(numericAmount)}
        paymentType={(receipt.paymentType || receipt.transaction.givingType).replace('_', ' ')}
        paymentMethod={receipt.paymentMethod || 'Manual Transfer'}
        transactionReference={receipt.transaction.reference}
      />
    </section>
  );
}

export default function ReceiptDetailPage() {
  return (
    <RequireAuth>
      <ReceiptDetailInner />
    </RequireAuth>
  );
}
