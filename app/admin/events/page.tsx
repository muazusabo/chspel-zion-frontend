'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, CalendarDays } from 'lucide-react';
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
import type { FcsEvent, Paginated } from '@/types';

interface FormValues {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime?: string;
  venue: string;
  organizer?: string;
  imageUrl?: string;
}

export default function AdminEventsPage() {
  const [data, setData] = useState<Paginated<FcsEvent> | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FcsEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm<FormValues>();

  const load = () => {
    setLoading(true);
    api.get<Paginated<FcsEvent>>('/api/events?limit=50', { skipAuth: true }).then(setData).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const uploadImageFile = async () => {
    const file = imageInputRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file, 'events');
      setValue('imageUrl', url, { shouldDirty: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const openCreate = () => { setEditing(null); reset({ title: '', description: '', date: '', startTime: '', venue: '', imageUrl: '' }); setDialogOpen(true); };
  const openEdit = (e: FcsEvent) => {
    setEditing(e);
    reset({
      title: e.title, description: e.description, date: e.date.slice(0, 10),
      startTime: e.startTime, endTime: e.endTime ?? '', venue: e.venue,
      organizer: e.organizer ?? '', imageUrl: e.imageUrl ?? '',
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      if (editing) await api.patch(`/api/admin/events/${editing.id}`, values);
      else await api.post('/api/admin/events', values);
      setDialogOpen(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save event.');
    }
  };

  const remove = async (e: FcsEvent) => {
    if (!confirm(`Delete "${e.title}"?`)) return;
    await api.delete(`/api/admin/events/${e.id}`);
    load();
  };

  return (
    <>
      <AdminPageHeader
        title="Events"
        description="Manage fellowship events and programs"
        action={<Button variant="gold" onClick={openCreate}><Plus size={15} /> New Event</Button>}
      />

      {loading && <Loading />}
      {!loading && data && data.items.length === 0 && <EmptyState icon={CalendarDays} title="No events yet." />}

      {!loading && data && data.items.length > 0 && (
        <div className="rounded-md border border-ink-100 overflow-hidden bg-paper">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Venue</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {data.items.map((e) => (
                <tr key={e.id}>
                  <td className="px-4 py-3 max-w-xs truncate">{e.title}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(e.date)}</td>
                  <td className="px-4 py-3 text-slate-500">{e.venue}</td>
                  <td className="px-4 py-3"><Badge variant={e.status === 'CANCELLED' ? 'urgent' : 'default'}>{e.status}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(e)} title="Edit"><Pencil size={15} /></Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(e)} title="Delete"><Trash2 size={15} className="text-red-700" /></Button>
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
          <DialogHeader><DialogTitle>{editing ? 'Edit Event' : 'New Event'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title', { required: true })} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} {...register('description', { required: true })} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" {...register('date', { required: true })} />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input id="startTime" placeholder="4:00 PM" {...register('startTime', { required: true })} />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input id="endTime" placeholder="6:00 PM" {...register('endTime')} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="venue">Venue</Label>
                <Input id="venue" {...register('venue', { required: true })} />
              </div>
              <div>
                <Label htmlFor="organizer">Organizer</Label>
                <Input id="organizer" {...register('organizer')} />
              </div>
            </div>
            <div>
              <Label>Event Image</Label>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-gold-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
                onChange={uploadImageFile}
              />
              <Input
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
              <Button type="submit" variant="gold" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : editing ? 'Save Changes' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
