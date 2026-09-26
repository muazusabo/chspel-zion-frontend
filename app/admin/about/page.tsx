'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSavedMessage } from '@/lib/use-saved-message';
import type { AboutContent } from '@/types';

export default function AdminAboutPage() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<AboutContent>();
  const { message, error, save, setError } = useSavedMessage();

  useEffect(() => {
    api.get<AboutContent>('/api/about', { skipAuth: true }).then(reset);
  }, [reset]);

  const onSubmit = async (values: AboutContent) => {
    try {
      await api.put('/api/admin/about', values);
      save('About content updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
    }
  };

  const fields: { name: keyof AboutContent; label: string }[] = [
    { name: 'whoWeAre', label: 'Who We Are' },
    { name: 'mission', label: 'Our Mission' },
    { name: 'vision', label: 'Our Vision' },
    { name: 'values', label: 'Our Values' },
    { name: 'whatWeDo', label: 'What We Do' },
  ];

  return (
    <>
      <AdminPageHeader title="About FCS" description="Edit the fellowship's about page content" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl">
        {fields.map((f) => (
          <div key={f.name}>
            <Label htmlFor={f.name}>{f.label}</Label>
            <Textarea id={f.name} rows={4} {...register(f.name)} />
          </div>
        ))}
        {error && <p className="text-sm text-red-700">{error}</p>}
        {message && <p className="text-sm text-forest-700">{message}</p>}
        <Button type="submit" variant="gold" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save Changes'}</Button>
      </form>
    </>
  );
}
