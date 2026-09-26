'use client';

import { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Loading } from '@/components/shared/loading';
import { EmptyState } from '@/components/shared/empty-state';
import { Pagination } from '@/components/shared/pagination';

interface OfferingRow {
  id: string;
  amount: string;
  createdAt: string;
  transaction: { reference: string; givingType: string; user?: { fullName: string; email: string } | null };
}
interface Paged { items: OfferingRow[]; page: number; totalPages: number }

export default function AdminOfferingsPage() {
  const [data, setData] = useState<Paged | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get<Paged>(`/api/admin/offerings?page=${page}&limit=20`).then(setData);
  }, [page]);

  return (
    <>
      <AdminPageHeader title="Offerings" description="Offerings and tithes given by members" />

      {!data && <Loading />}
      {data && data.items.length === 0 && <EmptyState icon={Wallet} title="No offerings recorded yet." />}

      {data && data.items.length > 0 && (
        <>
          <div className="rounded-md border border-ink-100 overflow-hidden bg-paper divide-y divide-ink-100">
            {data.items.map((o) => (
              <div key={o.id} className="flex items-center justify-between p-4 text-sm">
                <div>
                  <p className="font-medium">{o.transaction.user?.fullName ?? 'Anonymous'}</p>
                  <p className="text-xs text-slate-400">{o.transaction.givingType.replace('_', ' ')} · {formatDate(o.createdAt)}</p>
                </div>
                <p className="font-medium">{formatCurrency(o.amount)}</p>
              </div>
            ))}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
}
