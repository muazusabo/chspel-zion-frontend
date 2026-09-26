'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSavedMessage } from '@/lib/use-saved-message';
import type { Scripture } from '@/types';

export default function AdminScripturePage() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Scripture>();
  const { message, error, save, setError } = useSavedMessage();

  useEffect(() => {
    api.get<Scripture>('/api/scripture', { skipAuth: true }).then(reset);
  }, [reset]);

  const onSubmit = async (values: Scripture) => {
    try {
      await api.put('/api/admin/scripture', values);
      save('Scripture updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
    }
  };

  return (
    <>
      <AdminPageHeader title="Scripture" description="The verse shown in the homepage scripture strip" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl">
        <div>
          <Label htmlFor="verseText">Verse Text</Label>
          <Textarea id="verseText" rows={3} {...register('verseText', { required: true })} />
        </div>
        <div>
          <Label htmlFor="reference">Reference</Label>
          <Input id="reference" placeholder="e.g. John 3:16" {...register('reference', { required: true })} />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        {message && <p className="text-sm text-forest-700">{message}</p>}
        <Button type="submit" variant="gold" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save Changes'}</Button>
      </form>
    </>
  );
}
