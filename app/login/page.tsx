'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/auth-context';
import { AuthShell } from '@/components/shared/auth-shell';
import { GuestOnly } from '@/components/shared/guest-only';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      const signedInUser = await login(data.email, data.password);
      router.push(signedInUser.role === 'ADMIN' || signedInUser.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  return (
    <GuestOnly>
      <AuthShell title="Welcome back" subtitle="Sign in to your SAZU FCS account">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
          {errors.email && <p className="text-xs text-red-700 mt-1.5">{errors.email.message}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label htmlFor="password" className="mb-0">Password</Label>
            <Link href="/forgot-password" className="text-xs text-ink underline underline-offset-4">
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
          {errors.password && <p className="text-xs text-red-700 mt-1.5">{errors.password.message}</p>}
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <Button type="submit" variant="gold" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign In'}
        </Button>
        </form>
        <p className="text-sm text-slate-500 text-center mt-8">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-ink underline underline-offset-4">Register</Link>
        </p>
      </AuthShell>
    </GuestOnly>
  );
}
