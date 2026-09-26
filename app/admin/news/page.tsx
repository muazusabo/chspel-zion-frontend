'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Archive, Send } from 'lucide-react';
import { api, uploadImage } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loading } from '@/components/shared/loading';
import { EmptyState } from '@/components/shared/empty-state';
import { Newspaper } from 'lucide-react';
import type { ContentStatus, NewsArticle, Paginated } from '@/types';

interface FormValues {
  title: string;
  slug?: string;
  category?: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
}

const STATUS_VARIANT: Record<ContentStatus, 'default' | 'gold' | 'forest'> = {
  DRAFT: 'gold', PUBLISHED: 'forest', ARCHIVED: 'default',
};

export default function AdminNewsPage() {
  const [data, setData] = useState<Paginated<NewsArticle> | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm<FormValues>();

  const load = () => {
    setLoading(true);
    api.get<Paginated<NewsArticle>>('/api/admin/news?limit=50').then(setData).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const uploadImageFile = async () => {
    const file = imageInputRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file, 'news');
      setValue('featuredImage', url, { shouldDirty: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const openCreate = () => { setEditing(null); reset({ title: '', content: '', excerpt: '', category: '', featuredImage: '' }); setDialogOpen(true); };
  const openEdit = (n: NewsArticle) => {
    setEditing(n);
    reset({ title: n.title, slug: n.slug, content: n.content, excerpt: n.excerpt ?? '', category: n.category ?? '', featuredImage: n.featuredImage ?? '' });
    setDialogOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      if (editing) await api.patch(`/api/admin/news/${editing.id}`, values);
      else await api.post('/api/admin/news', { ...values, status: 'PUBLISHED' });
      setDialogOpen(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save article.');
    }
  };

  const setStatus = async (n: NewsArticle, status: 'publish' | 'draft' | 'archive') => {
    await api.patch(`/api/admin/news/${n.id}/${status}`);
    load();
  };

  const remove = async (n: NewsArticle) => {
    if (!confirm(`Delete "${n.title}"?`)) return;
    await api.delete(`/api/admin/news/${n.id}`);
    load();
  };

  return (
    <>
      <AdminPageHeader
        title="News"
        description="Publish stories and updates from fellowship life"
        action={<Button variant="gold" onClick={openCreate}><Plus size={15} /> New Article</Button>}
      />

      {loading && <Loading />}
      {!loading && data && data.items.length === 0 && (
        <EmptyState icon={Newspaper} title="No articles yet." />
      )}

      {!loading && data && data.items.length > 0 && (
        <div className="rounded-md border border-ink-100 overflow-hidden bg-paper">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {data.items.map((n) => (
                <tr key={n.id}>
                  <td className="px-4 py-3 max-w-xs truncate">{n.title}</td>
                  <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[n.status]}>{n.status}</Badge></td>
                  <td className="px-4 py-3 text-slate-500">
                    {n.publishedAt ? formatDate(n.publishedAt) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      {n.status !== 'PUBLISHED' && (
                        <Button variant="ghost" size="icon" title="Publish" onClick={() => setStatus(n, 'publish')}>
                          <Send size={14} />
                        </Button>
                      )}
                      {n.status !== 'ARCHIVED' && (
                        <Button variant="ghost" size="icon" title="Archive" onClick={() => setStatus(n, 'archive')}>
                          <Archive size={14} />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => openEdit(n)} title="Edit"><Pencil size={15} /></Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(n)} title="Delete"><Trash2 size={15} className="text-red-700" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? 'Edit Article' : 'New Article'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title', { required: true })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input id="category" {...register('category')} />
              </div>
              <div>
                <Label>Featured Image</Label>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-gold-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
                  onChange={uploadImageFile}
                />
                <Input
                  id="featuredImage"
                  value={watch('featuredImage') ?? ''}
                  onChange={(e) => setValue('featuredImage', e.target.value)}
                  className="mt-2"
                  placeholder="Uploaded image URL will appear here"
                />
                {uploading && <p className="mt-2 text-sm text-ink-600">Uploading image…</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" rows={2} {...register('excerpt')} />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" rows={10} {...register('content', { required: true })} />
            </div>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" variant="gold" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : editing ? 'Save Changes' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
