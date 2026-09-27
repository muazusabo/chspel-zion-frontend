'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api, uploadImage } from '@/lib/api';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSavedMessage } from '@/lib/use-saved-message';
import type { FellowshipSettings } from '@/types';

export default function AdminSettingsPage() {
  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm<FellowshipSettings>();
  const { message, error, save, setError } = useSavedMessage();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  useEffect(() => {
    api.get<FellowshipSettings>('/api/settings', { skipAuth: true }).then(reset);
  }, [reset]);

  const onSubmit = async (values: FellowshipSettings) => {
    try {
      await api.put('/api/admin/settings', values);
      save('Settings updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
    }
  };

  const onLogoChange = async () => {
    const file = logoInputRef.current?.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const { url } = await uploadImage(file, 'settings');
      setValue('logoUrl', url, { shouldDirty: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logo upload failed.');
    } finally {
      setIsUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  return (
    <>
      <AdminPageHeader title="Settings" description="Fellowship name, logo, contact info, and social links" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fcsName">Fellowship Name</Label>
            <Input id="fcsName" {...register('fcsName')} />
          </div>
          <div>
            <Label htmlFor="chapelName">Chapel Name</Label>
            <Input id="chapelName" {...register('chapelName')} />
          </div>
        </div>
        <div>
          <Label htmlFor="logoFile">Logo Image</Label>
          <input
            ref={logoInputRef}
            id="logoFile"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-gold-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
            onChange={onLogoChange}
          />
          {isUploadingLogo && <p className="mt-2 text-sm text-ink-600">Uploading logo…</p>}
          <Label htmlFor="logoUrl" className="mt-3">Logo URL</Label>
          <Input id="logoUrl" type="url" placeholder="https://.../logo.png" {...register('logoUrl')} />
          <p className="mt-1 text-xs text-slate-500">Upload a logo or paste an image URL, then save settings.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input id="contactEmail" type="email" {...register('contactEmail')} />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" {...register('phoneNumber')} />
          </div>
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" {...register('address')} />
        </div>
        <div className="pt-2">
          <p className="text-sm font-medium text-ink mb-3">Social Links</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="facebookUrl">Facebook</Label>
              <Input id="facebookUrl" {...register('facebookUrl')} />
            </div>
            <div>
              <Label htmlFor="instagramUrl">Instagram</Label>
              <Input id="instagramUrl" {...register('instagramUrl')} />
            </div>
            <div>
              <Label htmlFor="twitterUrl">Twitter / X</Label>
              <Input id="twitterUrl" {...register('twitterUrl')} />
            </div>
            <div>
              <Label htmlFor="whatsappUrl">WhatsApp</Label>
              <Input id="whatsappUrl" {...register('whatsappUrl')} />
            </div>
            <div>
              <Label htmlFor="youtubeUrl">YouTube</Label>
              <Input id="youtubeUrl" {...register('youtubeUrl')} />
            </div>
          </div>
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        {message && <p className="text-sm text-forest-700">{message}</p>}
        <Button type="submit" variant="gold" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save Changes'}</Button>
      </form>
    </>
  );
}
