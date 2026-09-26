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

const schema = z
  .object({
    fullName: z.string().min(2, 'Enter your full name'),
    email: z.string().email('Enter a valid email'),
    phoneNumber: z.string().optional(),
    studentId: z.string().optional(),
    department: z.string().optional(),
    faculty: z.string().optional(),
    level: z.string().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/((?=.*\d)|(?=.*\W+))(?=.*[A-Z])(?=.*[a-z])/, 'Include an uppercase, lowercase, and number or symbol'),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((accepted) => accepted, 'You must accept the Terms and Conditions'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
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
      const { confirmPassword, termsAccepted, ...payload } = data;
      await registerUser(payload);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  };

  return (
    <GuestOnly>
      <AuthShell title="Join SAZU FCS" subtitle="Create your fellowship account">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" {...register('fullName')} />
          {errors.fullName && <p className="text-xs text-red-700 mt-1.5">{errors.fullName.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="text-xs text-red-700 mt-1.5">{errors.email.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" {...register('phoneNumber')} />
          </div>
          <div>
            <Label htmlFor="studentId">Matric Number</Label>
            <Input id="studentId" {...register('studentId')} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="department">Department</Label>
            <Input id="department" {...register('department')} />
          </div>
          <div>
            <Label htmlFor="faculty">Faculty</Label>
            <Input id="faculty" {...register('faculty')} />
          </div>
          <div>
            <Label htmlFor="level">Level</Label>
            <Input id="level" placeholder="e.g. 200" {...register('level')} />
          </div>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password')} />
          {errors.password && <p className="text-xs text-red-700 mt-1.5">{errors.password.message}</p>}
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && (
            <p className="text-xs text-red-700 mt-1.5">{errors.confirmPassword.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="termsAccepted" className="flex items-start gap-3 text-sm text-slate-600">
            <input
              id="termsAccepted"
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 accent-gold-600"
              {...register('termsAccepted')}
            />
            <span>
              I agree to the{' '}
              <Link href="/terms" target="_blank" className="text-ink underline underline-offset-4">
                Terms and Conditions
              </Link>
              .
            </span>
          </label>
          {errors.termsAccepted && <p className="mt-1.5 text-xs text-red-700">{errors.termsAccepted.message}</p>}
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <Button type="submit" variant="gold" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create Account'}
        </Button>
        </form>
        <p className="text-sm text-slate-500 text-center mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-ink underline underline-offset-4">Sign in</Link>
        </p>
      </AuthShell>
    </GuestOnly>
  );
}
