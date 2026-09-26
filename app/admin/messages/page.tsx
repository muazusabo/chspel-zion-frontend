'use client';

import { useEffect, useState } from 'react';
import { Mail, Archive, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/shared/loading';
import { EmptyState } from '@/components/shared/empty-state';
import { Pagination } from '@/components/shared/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'ARCHIVED';
  createdAt: string;
}
interface Paged { items: ContactMessage[]; page: number; totalPages: number }

export default function AdminMessagesPage() {
  const [data, setData] = useState<Paged | null>(null);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const load = () => {
    api.get<Paged>(`/api/admin/contact-messages?page=${page}&limit=15`).then(setData);
  };
  useEffect(load, [page]);

  const openMessage = async (m: ContactMessage) => {
    const full = await api.get<ContactMessage>(`/api/admin/contact-messages/${m.id}`);
    setSelected(full);
    load();
  };

  const archive = async (id: string) => {
    await api.patch(`/api/admin/contact-messages/${id}/archive`);
    setSelected(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await api.delete(`/api/admin/contact-messages/${id}`);
    setSelected(null);
    load();
  };

  return (
    <>
      <AdminPageHeader title="Contact Messages" description="Messages submitted through the contact form" />

      {!data && <Loading />}
      {data && data.items.length === 0 && <EmptyState icon={Mail} title="No messages yet." />}

      {data && data.items.length > 0 && (
        <>
          <div className="rounded-md border border-ink-100 overflow-hidden bg-paper divide-y divide-ink-100">
            {data.items.map((m) => (
              <button
                key={m.id}
                onClick={() => openMessage(m)}
                className="w-full text-left flex items-center justify-between p-4 hover:bg-ink-50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {m.status === 'UNREAD' && <span className="h-2 w-2 rounded-full bg-gold-500 shrink-0" />}
                    <p className="text-sm font-medium truncate">{m.subject}</p>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{m.name} · {m.email}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <Badge variant={m.status === 'ARCHIVED' ? 'default' : m.status === 'UNREAD' ? 'gold' : 'forest'}>{m.status}</Badge>
                  <span className="text-xs text-slate-400">{formatDate(m.createdAt)}</span>
                </div>
              </button>
            ))}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.subject}</DialogTitle>
                <p className="text-sm text-slate-500 mt-1">{selected.name} · {selected.email}</p>
              </DialogHeader>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed mb-6">{selected.message}</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => archive(selected.id)}><Archive size={14} /> Archive</Button>
                <Button variant="destructive" size="sm" onClick={() => remove(selected.id)}><Trash2 size={14} /> Delete</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
