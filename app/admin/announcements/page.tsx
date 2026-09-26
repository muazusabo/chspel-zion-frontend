'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { api, uploadImage } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { CATEGORY_LABELS } from '@/lib/announcement-meta';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loading } from '@/components/shared/loading';
import { EmptyState } from '@/components/shared/empty-state';
import { Megaphone } from 'lucide-react';
import type { Announcement, AnnouncementCategory, AnnouncementPriority, Paginated } from '@/types';

interface FormValues {
  title: string;
  description: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  imageUrl?: string;
}

const CATEGORIES: AnnouncementCategory[] = [
  'GENERAL', 'MEETING', 'PRAYER', 'BIBLE_STUDY', 'EVANGELISM', 'FELLOWSHIP', 'IMPORTANT', 'EMERGENCY',
];
const PRIORITIES: AnnouncementPriority[] = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];

export default function AdminAnnouncementsPage() {
  const [data, setData] = useState<Paginated<Announcement> | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } =
    useForm<FormValues>({ defaultValues: { category: 'GENERAL', priority: 'NORMAL' } });

  const load = () => {
    setLoading(true);
    api.get<Paginated<Announcement>>('/api/admin/announcements?limit=50').then(setData).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const uploadImageFile = async () => {
    const file = imageInputRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file, 'announcements');
      setValue('imageUrl', url, { shouldDirty: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const openCreate = () => {
    setEditing(null);
    reset({ title: '', description: '', category: 'GENERAL', priority: 'NORMAL', imageUrl: '' });
    setDialogOpen(true);
  };

  const openEdit = (a: Announcement) => {
    setEditing(a);
    reset({ title: a.title, description: a.description, category: a.category, priority: a.priority, imageUrl: a.imageUrl ?? '' });
    setDialogOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      if (editing) {
        await api.patch(`/api/admin/announcements/${editing.id}`, values);
      } else {
        await api.post('/api/admin/announcements', { ...values, status: 'PUBLISHED' });
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save announcement.');
    }
  };

  const togglePublish = async (a: Announcement) => {
    const action = a.status === 'PUBLISHED' ? 'unpublish' : 'publish';
    await api.patch(`/api/admin/announcements/${a.id}/${action}`);
    load();
  };

  const remove = async (a: Announcement) => {
    if (!confirm(`Delete "${a.title}"? This cannot be undone.`)) return;
    await api.delete(`/api/admin/announcements/${a.id}`);
    load();
  };

  return (
    <>
      <AdminPageHeader
        title="Announcements"
        description="Create announcements and homepage advertisements"
        action={<Button variant="gold" onClick={openCreate}><Plus size={15} /> New Announcement</Button>}
      />

      {loading && <Loading />}
      {!loading && data && data.items.length === 0 && (
        <EmptyState icon={Megaphone} title="No announcements yet." description="Create your first one to get started." />
      )}

      {!loading && data && data.items.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-ink-100 bg-paper">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {data.items.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 max-w-xs truncate">{a.title}</td>
                  <td className="px-4 py-3">{CATEGORY_LABELS[a.category]}</td>
                  <td className="px-4 py-3">
                    <Badge variant={a.status === 'PUBLISHED' ? 'forest' : 'default'}>{a.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(a.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <Button variant="ghost" size="icon" onClick={() => togglePublish(a)} title={a.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}>
                        {a.status === 'PUBLISHED' ? <EyeOff size={15} /> : <Eye size={15} />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(a)} title="Edit">
                        <Pencil size={15} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(a)} title="Delete">
                        <Trash2 size={15} className="text-red-700" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title', { required: true })} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={4} {...register('description', { required: true })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={watch('category')} onValueChange={(v) => setValue('category', v as AnnouncementCategory)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={watch('priority')} onValueChange={(v) => setValue('priority', v as AnnouncementPriority)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Announcement Image</Label>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-gold-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
                onChange={uploadImageFile}
              />
              <Input
                id="imageUrl"
                value={watch('imageUrl') ?? ''}
                onChange={(e) => setValue('imageUrl', e.target.value)}
                className="mt-2"
                placeholder="Uploaded image URL will appear here"
              />
              {uploading && <p className="mt-2 text-sm text-ink-600">Uploading image…</p>}
            </div>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" variant="gold" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : editing ? 'Save Changes' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
