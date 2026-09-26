'use client';

import { useEffect, useState } from 'react';
import { HandCoins } from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Loading } from '@/components/shared/loading';
import { EmptyState } from '@/components/shared/empty-state';
import { Pagination } from '@/components/shared/pagination';

interface DonationRow {
  id: string;
  amount: string;
  createdAt: string;
  transaction: { reference: string; givingType: string; user?: { fullName: string; email: string } | null };
}
interface Paged { items: DonationRow[]; page: number; totalPages: number }

export default function AdminDonationsPage() {
  const [data, setData] = useState<Paged | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get<Paged>(`/api/admin/donations?page=${page}&limit=20`).then(setData);
  }, [page]);

  return (
    <>
      <AdminPageHeader title="Donations" description="One-time gifts and special contributions" />

      {!data && <Loading />}
      {data && data.items.length === 0 && <EmptyState icon={HandCoins} title="No donations recorded yet." />}

      {data && data.items.length > 0 && (
        <>
          <div className="rounded-md border border-ink-100 overflow-hidden bg-paper divide-y divide-ink-100">
            {data.items.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-4 text-sm">
                <div>
                  <p className="font-medium">{d.transaction.user?.fullName ?? 'Anonymous'}</p>
                  <p className="text-xs text-slate-400">{d.transaction.givingType.replace('_', ' ')} · {formatDate(d.createdAt)}</p>
                </div>
                <p className="font-medium">{formatCurrency(d.amount)}</p>
              </div>
            ))}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
}
