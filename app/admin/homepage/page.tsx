'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api, uploadImage } from '@/lib/api';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSavedMessage } from '@/lib/use-saved-message';
import type { HomepageContent } from '@/types';

export default function AdminHomepagePage() {
  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm<HomepageContent>();
  const { message, error, save, setError } = useSavedMessage();
  const heroInputRef = useRef<HTMLInputElement>(null);
  const welcomeInputRef = useRef<HTMLInputElement>(null);
  const [uploadingField, setUploadingField] = useState<'hero' | 'welcome' | null>(null);

  useEffect(() => {
    api.get<HomepageContent>('/api/homepage', { skipAuth: true }).then(reset);
  }, [reset]);

  const uploadField = async (field: 'heroImageUrl' | 'welcomeImageUrl', ref: React.RefObject<HTMLInputElement>) => {
    const file = ref.current?.files?.[0];
    if (!file) return;
    setUploadingField(field === 'heroImageUrl' ? 'hero' : 'welcome');
    try {
      const { url } = await uploadImage(file, 'homepage');
      setValue(field, url, { shouldDirty: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploadingField(null);
      if (ref.current) ref.current.value = '';
    }
  };

  const onSubmit = async (values: HomepageContent) => {
    try {
      await api.put('/api/admin/homepage', values);
      save('Homepage content updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
    }
  };

  return (
    <>
      <AdminPageHeader title="Homepage" description="Edit the hero section and welcome message" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl">
        <div>
          <Label htmlFor="heroTitle">Hero Title</Label>
          <Input id="heroTitle" {...register('heroTitle')} />
        </div>
        <div>
          <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
          <Input id="heroSubtitle" {...register('heroSubtitle')} />
        </div>
        <div>
          <Label htmlFor="heroDescription">Hero Description</Label>
          <Textarea id="heroDescription" rows={2} {...register('heroDescription')} />
        </div>
        <div>
          <Label>Hero Image</Label>
          <input
            ref={heroInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-gold-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
            onChange={() => uploadField('heroImageUrl', heroInputRef)}
          />
          <Input id="heroImageUrl" value={watch('heroImageUrl') ?? ''} onChange={(e) => setValue('heroImageUrl', e.target.value)} className="mt-2" placeholder="Uploaded image URL will appear here" />
          {uploadingField === 'hero' && <p className="mt-2 text-sm text-ink-600">Uploading hero image…</p>}
        </div>
        <div>
          <Label htmlFor="welcomeMessage">Welcome Message</Label>
          <Textarea id="welcomeMessage" rows={4} {...register('welcomeMessage')} />
        </div>
        <div>
          <Label>Welcome Image</Label>
          <input
            ref={welcomeInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-gold-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
            onChange={() => uploadField('welcomeImageUrl', welcomeInputRef)}
          />
          <Input id="welcomeImageUrl" value={watch('welcomeImageUrl') ?? ''} onChange={(e) => setValue('welcomeImageUrl', e.target.value)} className="mt-2" placeholder="Uploaded image URL will appear here" />
          {uploadingField === 'welcome' && <p className="mt-2 text-sm text-ink-600">Uploading welcome image…</p>}
        </div>
        <div>
          <Label htmlFor="missionPreview">Mission Preview</Label>
          <Textarea id="missionPreview" rows={2} {...register('missionPreview')} />
        </div>
        <div>
          <Label htmlFor="visionPreview">Vision Preview</Label>
          <Textarea id="visionPreview" rows={2} {...register('visionPreview')} />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        {message && <p className="text-sm text-forest-700">{message}</p>}
        <Button type="submit" variant="gold" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save Changes'}</Button>
      </form>
    </>
  );
}
