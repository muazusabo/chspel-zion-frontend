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
      <AdminPageHeader title="RECEIPT REQUESTS" description="Review FCS receipt requests from members and approve or reject them." />
      {error && <p className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="overflow-x-auto rounded-md border border-ink-100 bg-paper">
        <table className="min-w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-[0.12em] text-slate-500">
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
              <tr key={req.id}>
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
