'use client';

import { useEffect, useState } from 'react';
import { History } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Loading } from '@/components/shared/loading';
import { EmptyState } from '@/components/shared/empty-state';
import { Pagination } from '@/components/shared/pagination';

interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string | null;
  createdAt: string;
  admin: { fullName: string; email: string };
}
interface Paged { logs: ActivityLog[]; page: number; totalPages: number }

function formatAction(action: string): string {
  return action.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

export default function AdminLogsPage() {
  const [data, setData] = useState<Paged | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get<Paged>(`/api/admin/activity?page=${page}&limit=30`).then(setData);
  }, [page]);

  return (
    <>
      <AdminPageHeader title="Activity Logs" description="A record of every administrative action taken" />

      {!data && <Loading />}
      {data && data.logs.length === 0 && <EmptyState icon={History} title="No activity recorded yet." />}

      {data && data.logs.length > 0 && (
        <>
          <div className="rounded-md border border-ink-100 overflow-hidden bg-paper divide-y divide-ink-100">
            {data.logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 text-sm">
                <div>
                  <p className="font-medium">{formatAction(log.action)} <span className="text-slate-400">· {log.entity}</span></p>
                  <p className="text-xs text-slate-400 mt-0.5">{log.admin.fullName}</p>
                </div>
                <p className="text-xs text-slate-400 shrink-0">{formatDate(log.createdAt)}</p>
              </div>
            ))}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
}
