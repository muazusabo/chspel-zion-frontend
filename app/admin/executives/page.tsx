'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, UserSquare2 } from 'lucide-react';
import { api, uploadImage } from '@/lib/api';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loading } from '@/components/shared/loading';
import { EmptyState } from '@/components/shared/empty-state';
import type { Executive } from '@/types';

interface FormValues {
  fullName: string;
  position: string;
  department?: string;
  level?: string;
  photoUrl?: string;
  biography?: string;
}

export default function AdminExecutivesPage() {
  const [items, setItems] = useState<Executive[] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Executive | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm<FormValues>();
  const photoUrl = watch('photoUrl');

  const load = () => {
    api.get<Executive[]>('/api/admin/executives').then(setItems);
  };
  useEffect(load, []);

  const uploadPhoto = async () => {
    const file = imageInputRef.current?.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const { url } = await uploadImage(file, 'executives');
      setValue('photoUrl', url, { shouldDirty: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Photo upload failed.');
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const openCreate = () => { setEditing(null); reset({ fullName: '', position: '', department: '', level: '', photoUrl: '', biography: '' }); setDialogOpen(true); };
  const openEdit = (e: Executive) => {
    setEditing(e);
    reset({ fullName: e.fullName, position: e.position, department: e.department ?? '', level: e.level ?? '', photoUrl: e.photoUrl ?? '', biography: e.biography ?? '' });
    setDialogOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    setError(null);
    if (!editing && !values.photoUrl) {
      setError('Upload an executive photo before adding this executive.');
      return;
    }
    try {
      if (editing) await api.patch(`/api/admin/executives/${editing.id}`, values);
      else await api.post('/api/admin/executives', values);
      setDialogOpen(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save executive.');
    }
  };

  const remove = async (e: Executive) => {
    if (!confirm(`Remove "${e.fullName}"?`)) return;
    await api.delete(`/api/admin/executives/${e.id}`);
    load();
  };

  const toggleActive = async (e: Executive) => {
    await api.patch(`/api/admin/executives/${e.id}`, { isActive: !e.isActive });
    load();
  };

  const move = async (index: number, direction: -1 | 1) => {
    if (!items) return;
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setItems(reordered);
    await api.patch('/api/admin/executives/reorder', {
      items: reordered.map((item, i) => ({ id: item.id, order: i + 1 })),
    });
    load();
  };

  return (
    <>
      <AdminPageHeader
        title="Executives"
        description="Manage fellowship leadership and their order of display"
        action={<Button variant="gold" onClick={openCreate}><Plus size={15} /> Add Executive</Button>}
      />

      {!items && <Loading />}
      {items && items.length === 0 && <EmptyState icon={UserSquare2} title="No executives added yet." />}

      {items && items.length > 0 && (
        <div className="rounded-md border border-ink-100 overflow-hidden bg-paper divide-y divide-ink-100">
          {items.map((e, i) => (
            <div key={e.id} className="flex items-center gap-4 p-4">
              <div className="flex flex-col gap-1">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="text-slate-400 hover:text-ink disabled:opacity-30">
                  <ArrowUp size={14} />
                </button>
                <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="text-slate-400 hover:text-ink disabled:opacity-30">
                  <ArrowDown size={14} />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{e.fullName}</p>
                <p className="text-xs text-slate-500">{e.position}</p>
              </div>
              {!e.isActive && <Badge variant="default">Inactive</Badge>}
              <div className="flex gap-1.5 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => toggleActive(e)}>
                  {e.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openEdit(e)}><Pencil size={15} /></Button>
                <Button variant="ghost" size="icon" onClick={() => remove(e)}><Trash2 size={15} className="text-red-700" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit Executive' : 'Add Executive'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...register('fullName', { required: true })} />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input id="position" placeholder="e.g. President" {...register('position', { required: true })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" {...register('department')} />
              </div>
              <div>
                <Label htmlFor="level">Level</Label>
                <Input id="level" {...register('level')} />
              </div>
            </div>
            <div>
              <Label htmlFor="executive-photo">Executive Photo</Label>
              <input
                ref={imageInputRef}
                id="executive-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                onChange={uploadPhoto}
                className="mt-2 block w-full cursor-pointer rounded-sm border border-ink-200 bg-paper px-3 py-2 text-sm text-slate-600 file:mr-3 file:border-0 file:bg-ink-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink"
              />
              {uploading && <p className="mt-2 text-xs text-slate-500">Uploading photo…</p>}
              {photoUrl && !photoUrl.startsWith('[') && <p className="mt-2 text-xs text-forest-700">Photo uploaded and ready to save.</p>}
              <p className="mt-1 text-xs text-slate-500">Upload a clear portrait photo. The image is saved when you submit the executive.</p>
            </div>
            <div>
              <Label htmlFor="biography">Short Biography</Label>
              <Textarea id="biography" rows={3} {...register('biography')} />
            </div>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" variant="gold" disabled={isSubmitting || uploading}>{isSubmitting ? 'Saving…' : editing ? 'Save Changes' : 'Add'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
