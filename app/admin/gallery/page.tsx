'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Star, Images } from 'lucide-react';
import { api, uploadImage } from '@/lib/api';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/shared/loading';
import { EmptyState } from '@/components/shared/empty-state';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { GalleryCategory, GalleryImage, Paginated } from '@/types';

const CATEGORIES: GalleryCategory[] = [
  'WORSHIP', 'BIBLE_STUDY', 'PRAYER', 'EVANGELISM', 'RETREAT', 'FELLOWSHIP', 'OUTREACH', 'EVENTS', 'EXECUTIVES',
];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryImage[] | null>(null);
  const [category, setCategory] = useState<GalleryCategory>('FELLOWSHIP');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    api.get<Paginated<GalleryImage>>('/api/gallery?limit=60', { skipAuth: true }).then((r) => setItems(r.items));
  };
  useEffect(load, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const { url } = await uploadImage(file, 'gallery');
      await api.post('/api/admin/gallery', { imageUrl: url, category });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const toggleFeatured = async (img: GalleryImage) => {
    await api.patch(`/api/admin/gallery/${img.id}`, { isFeatured: !img.isFeatured });
    load();
  };

  const remove = async (img: GalleryImage) => {
    if (!confirm('Remove this image?')) return;
    await api.delete(`/api/admin/gallery/${img.id}`);
    load();
  };

  return (
    <>
      <AdminPageHeader
        title="Gallery"
        description="Upload and organize photos from fellowship life"
        action={
          <div className="flex gap-2">
            <Select value={category} onValueChange={(v) => setCategory(v as GalleryCategory)}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c.replace('_', ' ')}</SelectItem>)}
              </SelectContent>
            </Select>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            <Button variant="gold" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <Plus size={15} /> {uploading ? 'Uploading…' : 'Upload'}
            </Button>
          </div>
        }
      />

      {error && <p className="text-sm text-red-700 mb-4">{error}</p>}

      {!items && <Loading />}
      {items && items.length === 0 && <EmptyState icon={Images} title="No images uploaded yet." />}

      {items && items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((img) => (
            <div key={img.id} className="relative group rounded-md overflow-hidden aspect-square bg-ink-50">
              <Image src={img.imageUrl} alt={img.caption ?? ''} fill className="object-cover" />
              <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => toggleFeatured(img)}
                  className={`p-2 rounded-full ${img.isFeatured ? 'bg-gold-500 text-ink' : 'bg-paper/90 text-ink'}`}
                  title="Toggle featured"
                >
                  <Star size={14} fill={img.isFeatured ? 'currentColor' : 'none'} />
                </button>
                <button onClick={() => remove(img)} className="p-2 rounded-full bg-paper/90 text-red-700" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
              <span className="absolute bottom-1.5 left-1.5 text-[10px] bg-ink-900/70 text-paper px-1.5 py-0.5 rounded">
                {img.category.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
