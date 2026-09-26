'use client';

import { useEffect, useState } from 'react';
import { Search, Shield } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loading } from '@/components/shared/loading';
import { EmptyState } from '@/components/shared/empty-state';
import type { Paginated, Role, User } from '@/types';

export default function AdminAdminsPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[] | null>(null);
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);

  const load = () => {
    const params = new URLSearchParams({ limit: '100' });
    if (search) params.set('search', search);
    api.get<Paginated<User>>(`/api/admin/users?${params}`).then((res) =>
      setUsers(showAll ? res.items : res.items.filter((u) => u.role !== 'USER')),
    );
  };
  useEffect(load, [search, showAll]);

  const setRole = async (u: User, role: Role) => {
    if (!confirm(`Change ${u.fullName}'s role to ${role.replace('_', ' ')}?`)) return;
    await api.patch(`/api/admin/users/${u.id}/role`, { role });
    load();
  };

  return (
    <>
      <AdminPageHeader
        title="Admins"
        description="Manage administrator access (Super Admin only)"
        action={
          <Button variant="outline" size="sm" onClick={() => setShowAll((s) => !s)}>
            {showAll ? 'Show Admins Only' : 'Show All Members'}
          </Button>
        }
      />

      <div className="relative max-w-sm mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input placeholder="Search by name or email…" className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {!users && <Loading />}
      {users && users.length === 0 && <EmptyState icon={Shield} title="No matching members found." />}

      {users && users.length > 0 && (
        <div className="rounded-md border border-ink-100 overflow-hidden bg-paper divide-y divide-ink-100">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium">{u.fullName}</p>
                <p className="text-xs text-slate-400">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={u.role === 'USER' ? 'default' : 'gold'}>{u.role.replace('_', ' ')}</Badge>
                {u.id !== currentUser?.id && (
                  <div className="flex gap-1.5">
                    {u.role !== 'SUPER_ADMIN' && (
                      <Button variant="outline" size="sm" onClick={() => setRole(u, 'SUPER_ADMIN')}>Make Super Admin</Button>
                    )}
                    {u.role !== 'ADMIN' && (
                      <Button variant="outline" size="sm" onClick={() => setRole(u, 'ADMIN')}>Make Admin</Button>
                    )}
                    {u.role !== 'USER' && (
                      <Button variant="ghost" size="sm" onClick={() => setRole(u, 'USER')}>Revoke</Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-400 mt-6">
        Switch to &quot;Show All Members&quot; and search to find a regular member and promote them to Admin.
      </p>
    </>
  );
}
