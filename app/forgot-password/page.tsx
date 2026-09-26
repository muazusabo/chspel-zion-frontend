'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MailCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { AuthShell } from '@/components/shared/auth-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({ email: z.string().email('Enter a valid email') });
type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      await api.post('/api/auth/forgot-password', data, { skipAuth: true });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (sent) {
    return (
      <AuthShell title="Check your email">
        <div className="text-center">
          <MailCheck className="mx-auto text-forest-700 mb-4" size={32} />
          <p className="text-sm text-slate-600">
            If an account with that email exists, we&apos;ve sent a link to reset your password.
          </p>
          <Link href="/login" className="inline-block mt-6 text-sm text-ink underline underline-offset-4">
            Back to login
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Reset your password" subtitle="Enter your email and we'll send you a reset link">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="text-xs text-red-700 mt-1.5">{errors.email.message}</p>}
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <Button type="submit" variant="gold" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Send Reset Link'}
        </Button>
      </form>
      <p className="text-sm text-slate-500 text-center mt-8">
        <Link href="/login" className="text-ink underline underline-offset-4">Back to login</Link>
      </p>
    </AuthShell>
  );
}
