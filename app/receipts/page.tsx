'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Printer, Receipt as ReceiptIcon } from 'lucide-react';
import { api, downloadReceiptPdf } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { RequireAuth } from '@/components/shared/require-auth';
import { EmptyState } from '@/components/shared/empty-state';
import { Loading } from '@/components/shared/loading';
import { Button } from '@/components/ui/button';
import type { Receipt, ReceiptRequest } from '@/types';

function ReceiptsInner() {
  const [receipts, setReceipts] = useState<Receipt[] | null>(null);
  const [requests, setRequests] = useState<ReceiptRequest[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get<Receipt[]>('/api/receipts'),
      api.get<ReceiptRequest[]>('/api/receipts/requests'),
    ])
      .then(([receiptData, requestData]) => {
        setReceipts(receiptData);
        setRequests(requestData);
      })
      .catch(() => {
        setError(true);
        setReceipts([]);
        setRequests([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const renderRequestState = (req: ReceiptRequest) => {
    if (req.status === 'PENDING') return 'Waiting for admin approval.';
    if (req.status === 'REJECTED') return req.adminNote || 'Your request was rejected.';
    return 'Approved and available.';
  };

  return (
    <section className="container max-w-5xl py-14">
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-gold-700">FCS portal</p>
          <h1 className="text-3xl">My Receipts</h1>
        </div>
        <Link href="/receipts/request" className="inline-flex items-center gap-2 text-sm font-medium text-ink underline underline-offset-4">
          Request official receipt <ArrowRight size={15} />
        </Link>
      </div>

      <div className="mb-10 border border-gold-200 bg-gold-50 px-5 py-4 text-sm leading-relaxed text-ink-700">
        Please make the transfer to the chapel account after submission, then wait for approval before downloading your receipt.{' '}
        <Link href="/give/account" className="font-medium text-ink underline underline-offset-4">
          View chapel account details
        </Link>
      </div>

      {error && (
        <p className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          We could not load your receipts. Please refresh and try again.
        </p>
      )}

      {loading && <Loading />}

      {!loading && requests && requests.length > 0 && (
        <div className="mb-12 space-y-5">
          <h2 className="text-xl font-semibold text-ink">Receipt Requests</h2>
          {requests.map((req) => (
            <div key={req.id} className="rounded-md border border-ink-100 bg-paper p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">Received From: {req.requestedName}</p>
                  <p className="mt-1 text-xs text-slate-500">Amount: {formatCurrency(req.transaction.amount)} · Payment: {req.transaction.givingType.replace('_', ' ')}</p>
                </div>
                <span className="inline-flex rounded-full border border-ink-200 bg-ink-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">
                  {req.status}
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-600">{renderRequestState(req)}</p>
              {req.status === 'REJECTED' && req.adminNote && (
                <p className="mt-2 text-sm text-red-700">Reason: {req.adminNote}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && receipts && receipts.length === 0 && requests && requests.length === 0 && (
        <EmptyState icon={ReceiptIcon} title="No receipts found." description="Receipts appear here after a successful payment and admin approval." />
      )}

      {!loading && receipts && receipts.length > 0 && (
        <div className="space-y-5">
          <h2 className="text-xl font-semibold text-ink">Approved Receipts</h2>
          <div className="rounded-md border border-ink-100 bg-paper divide-y divide-ink-100">
            {receipts.map((r) => (
              <div key={r.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">{r.receiptNumber}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Received From: {r.requestedName || r.user?.fullName || '—'} · {r.paymentType ? r.paymentType.replace('_', ' ') : r.transaction.givingType.replace('_', ' ')}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{formatDate(r.issuedAt ?? r.createdAt)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm font-semibold text-ink">{formatCurrency(Number(r.amount ?? r.transaction.amount))}</p>
                  <Link href={`/receipts/${r.id}`} className="text-sm font-medium text-ink underline underline-offset-4">View Receipt</Link>
                  <Button variant="outline" size="sm" onClick={() => downloadReceiptPdf(r.id, `${r.receiptNumber}.pdf`)}>
                    Download PDF
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => window.print()} className="hidden sm:inline-flex">
                    <Printer size={14} /> Print
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default function ReceiptsPage() {
  return (
    <RequireAuth>
      <ReceiptsInner />
    </RequireAuth>
  );
}
