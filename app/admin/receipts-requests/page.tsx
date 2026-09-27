'use client';

import { useEffect, useState } from 'react';
import { Check, Eye, X } from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { RequireAuth } from '@/components/shared/require-auth';
import { Loading } from '@/components/shared/loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ReceiptRequest } from '@/types';

function AdminReceiptRequestsInner() {
  const [requests, setRequests] = useState<ReceiptRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await api.get<{ items: ReceiptRequest[]; total: number; page: number; totalPages: number }>('/api/admin/receipts/requests?page=1&limit=50');
      setRequests(data.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load receipt requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRequests(); }, []);

  const approve = async (id: string) => {
    setProcessingId(id);
    try {
      await api.patch(`/api/admin/receipts/${id}/approve`);
      await loadRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not approve the request.');
    } finally {
      setProcessingId(null);
    }
  };

  const reject = async (id: string) => {
    setProcessingId(id);
    try {
      const note = window.prompt('Add a reason for rejection (optional):');
      await api.patch(`/api/admin/receipts/${id}/reject`, { adminNote: note ?? '' });
      await loadRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reject the request.');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <Loading label="Loading receipt requests…" />;

  return (
    <>
      <AdminPageHeader title="Receipt requests" description="Review member-submitted transfers and approve or reject receipt requests." />
      {error && <p className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
        <span>{requests.length} requests</span>
        <span>{requests.filter((request) => request.status === 'PENDING').length} pending review</span>
      </div>

      <div className="space-y-3 lg:hidden">
        {requests.length === 0 ? (
          <div className="border-y border-ink-100 bg-white px-4 py-10 text-center text-sm text-slate-500">No receipt requests found.</div>
        ) : requests.map((req) => (
          <article key={req.id} className="rounded-sm border border-ink-100 bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3 border-b border-ink-100 pb-4">
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{req.user?.fullName ?? 'Unknown user'}</p>
                <p className="mt-1 truncate text-xs text-slate-500">{req.user?.email ?? '—'}</p>
              </div>
              <Badge variant={req.status === 'APPROVED' ? 'forest' : req.status === 'REJECTED' ? 'urgent' : 'gold'}>{req.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 py-4 text-sm">
              <div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Receipt name</p><p className="mt-1 truncate font-medium text-ink">{req.requestedName}</p></div>
              <div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Amount</p><p className="mt-1 font-medium tabular-nums text-ink">{formatCurrency(req.transaction.amount)}</p></div>
              <div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Transaction</p><p className="mt-1 truncate text-slate-600">{req.transaction.reference}</p></div>
              <div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Giving type</p><p className="mt-1 truncate text-slate-600">{req.transaction.givingType.replace('_', ' ')}</p></div>
              <div className="col-span-2"><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Requested</p><p className="mt-1 text-slate-600">{formatDate(req.requestedAt)}</p></div>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-ink-100 pt-4">
              <Button variant="outline" size="sm" onClick={() => {}}><Eye size={14} /> View</Button>
              <Button variant="success" size="sm" disabled={processingId === req.id || req.status !== 'PENDING'} onClick={() => approve(req.id)}><Check size={14} /> Approve</Button>
              <Button variant="destructive" size="sm" disabled={processingId === req.id || req.status !== 'PENDING'} onClick={() => reject(req.id)}><X size={14} /> Reject</Button>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-sm border border-ink-100 bg-white lg:block">
        <table className="min-w-full text-sm">
          <thead className="bg-[#f4f7fb] text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Requested Name</th>
              <th className="px-4 py-3">Transaction</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Payment Type</th>
              <th className="px-4 py-3">Request Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {requests.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500">No receipt requests found.</td></tr>
            ) : requests.map((req) => (
              <tr key={req.id} className="transition-colors hover:bg-[#f8fafc]">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{req.user?.fullName ?? 'Unknown user'}</p>
                  <p className="text-xs text-slate-500">{req.user?.email ?? '—'}</p>
                </td>
                <td className="px-4 py-3 font-medium text-ink">{req.requestedName}</td>
                <td className="px-4 py-3 text-slate-600">{req.transaction.reference}</td>
                <td className="px-4 py-3 font-medium text-ink">{formatCurrency(req.transaction.amount)}</td>
                <td className="px-4 py-3 text-slate-600">{req.transaction.givingType.replace('_', ' ')}</td>
                <td className="px-4 py-3 text-slate-600">{formatDate(req.requestedAt)}</td>
                <td className="px-4 py-3"><Badge variant={req.status === 'APPROVED' ? 'forest' : req.status === 'REJECTED' ? 'urgent' : 'gold'}>{req.status}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => {}}>
                      <Eye size={14} /> View
                    </Button>
                    <Button variant="success" size="sm" disabled={processingId === req.id || req.status !== 'PENDING'} onClick={() => approve(req.id)}>
                      <Check size={14} /> Approve
                    </Button>
                    <Button variant="destructive" size="sm" disabled={processingId === req.id || req.status !== 'PENDING'} onClick={() => reject(req.id)}>
                      <X size={14} /> Reject
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function AdminReceiptRequestsPage() {
  return (
    <RequireAuth roles={['ADMIN', 'SUPER_ADMIN']}>
      <AdminReceiptRequestsInner />
    </RequireAuth>
  );
}
