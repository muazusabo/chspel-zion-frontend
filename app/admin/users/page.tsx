'use client';

import { useEffect, useState } from 'react';
import { Search, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { formatDate } from '@/lib/utils';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/shared/loading';
import { EmptyState } from '@/components/shared/empty-state';
import { Pagination } from '@/components/shared/pagination';
import type { Paginated, User } from '@/types';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [data, setData] = useState<Paginated<User> | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.set('search', search);
    api.get<Paginated<User>>(`/api/admin/users?${params}`).then(setData).finally(() => setLoading(false));
  };

  useEffect(load, [search, page]);

  const toggleStatus = async (u: User) => {
    const action = u.status === 'ACTIVE' ? 'suspend' : 'activate';
    await api.patch(`/api/admin/users/${u.id}/${action}`);
    load();
  };

  return (
    <>
      <AdminPageHeader title="Users" description="Manage registered fellowship members" />

      <div className="relative max-w-sm mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input placeholder="Name, email, matric number…" className="pl-10" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {loading && <Loading />}
      {!loading && data && data.items.length === 0 && <EmptyState icon={Users} title="No users found." />}

      {!loading && data && data.items.length > 0 && (
        <>
          <div className="rounded-md border border-ink-100 overflow-hidden bg-paper overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {data.items.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3">{u.fullName}</td>
                    <td className="px-4 py-3 text-slate-500">{u.email}</td>
                    <td className="px-4 py-3 text-slate-500">{u.department ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={u.status === 'ACTIVE' ? 'forest' : 'urgent'}>{u.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {u.id !== currentUser?.id && u.role === 'USER' && (
                        <Button variant="outline" size="sm" onClick={() => toggleStatus(u)}>
                          {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
}
