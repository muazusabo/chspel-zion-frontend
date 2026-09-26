'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { AuthShell } from '@/components/shared/auth-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/((?=.*\d)|(?=.*\W+))(?=.*[A-Z])(?=.*[a-z])/, 'Include an uppercase, lowercase, and number or symbol'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordInner />
    </Suspense>
  );
}

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setError(null);
    if (!token) {
      setError('This reset link is missing a token. Please request a new one.');
      return;
    }
    try {
      await api.post('/api/auth/reset-password', { token, newPassword: data.newPassword }, { skipAuth: true });
      setDone(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'This link may have expired. Please request a new one.');
    }
  };

  if (done) {
    return (
      <AuthShell title="Password reset">
        <div className="text-center">
          <CheckCircle2 className="mx-auto text-forest-700 mb-4" size={32} />
          <p className="text-sm text-slate-600">
            Your password has been reset. Redirecting you to login…
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Set a new password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <Input id="newPassword" type="password" {...register('newPassword')} />
          {errors.newPassword && <p className="text-xs text-red-700 mt-1.5">{errors.newPassword.message}</p>}
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && (
            <p className="text-xs text-red-700 mt-1.5">{errors.confirmPassword.message}</p>
          )}
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <Button type="submit" variant="gold" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Resetting…' : 'Reset Password'}
        </Button>
      </form>
      <p className="text-sm text-slate-500 text-center mt-8">
        <Link href="/login" className="text-ink underline underline-offset-4">Back to login</Link>
      </p>
    </AuthShell>
  );
}
