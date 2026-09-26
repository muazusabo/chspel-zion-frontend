'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSavedMessage } from '@/lib/use-saved-message';
import type { ChapelAccount } from '@/types';

export default function AdminChapelPage() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Omit<ChapelAccount, 'id'>>();
  const { message, error, save, setError } = useSavedMessage();

  useEffect(() => {
    api.get<ChapelAccount>('/api/chapel/account', { skipAuth: true }).then(reset);
  }, [reset]);

  const onSubmit = async (values: Omit<ChapelAccount, 'id'>) => {
    try {
      await api.put('/api/admin/chapel/account', values);
      save('Chapel account details updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
    }
  };

  return (
    <>
      <AdminPageHeader title="Chapel Account" description="Bank details shown on the public giving page" />
      <p className="mb-6 max-w-md border border-gold-200 bg-gold-50 px-4 py-3 text-sm leading-relaxed text-ink-700">
        Replace the bracketed placeholder values with the fellowship&apos;s real bank details. These values appear on member dashboards and the giving page.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md">
        <div>
          <Label htmlFor="bankName">Bank Name</Label>
          <Input id="bankName" {...register('bankName', { required: true })} />
        </div>
        <div>
          <Label htmlFor="accountName">Account Name</Label>
          <Input id="accountName" {...register('accountName', { required: true })} />
        </div>
        <div>
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input id="accountNumber" {...register('accountNumber', { required: true })} />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        {message && <p className="text-sm text-forest-700">{message}</p>}
        <Button type="submit" variant="gold" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save Changes'}</Button>
      </form>
    </>
  );
}
