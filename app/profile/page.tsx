'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { RequireAuth } from '@/components/shared/require-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const profileSchema = z.object({
  fullName: z.string().min(2),
  phoneNumber: z.string().optional(),
  department: z.string().optional(),
  faculty: z.string().optional(),
  level: z.string().optional(),
  studentId: z.string().optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/((?=.*\d)|(?=.*\W+))(?=.*[A-Z])(?=.*[a-z])/, 'Include an uppercase, lowercase, and number or symbol'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type PasswordForm = z.infer<typeof passwordSchema>;

function ProfileInner() {
  const { user, refresh, logout } = useAuth();
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { isSubmitting: savingProfile },
  } = useForm<ProfileForm>({ resolver: zodResolver(profileSchema) });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: pwErrors, isSubmitting: savingPassword },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    if (user) {
      resetProfile({
        fullName: user.fullName,
        phoneNumber: user.phoneNumber ?? '',
        department: user.department ?? '',
        faculty: user.faculty ?? '',
        level: user.level ?? '',
        studentId: user.studentId ?? '',
      });
    }
  }, [user, resetProfile]);

  const onSaveProfile = async (data: ProfileForm) => {
    setError(null);
    setSavedMsg(null);
    try {
      await api.patch('/api/users/me', data);
      await refresh();
      setSavedMsg('Profile updated successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update profile.');
    }
  };

  const onChangePassword = async (data: PasswordForm) => {
    setPwError(null);
    setPwMsg(null);
    try {
      await api.patch('/api/users/me/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setPwMsg('Password changed successfully.');
      resetPassword();
    } catch (err) {
      setPwError(err instanceof Error ? err.message : 'Could not change password.');
    }
  };

  return (
    <section className="container py-14 max-w-2xl">
      <h1 className="text-2xl mb-10">Profile</h1>

      <form onSubmit={handleProfileSubmit(onSaveProfile)} className="space-y-5 mb-16">
        <h2 className="text-lg font-display mb-2">Personal Information</h2>
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" {...registerProfile('fullName')} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" {...registerProfile('phoneNumber')} />
          </div>
          <div>
            <Label htmlFor="studentId">Matric Number</Label>
            <Input id="studentId" {...registerProfile('studentId')} />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="department">Department</Label>
            <Input id="department" {...registerProfile('department')} />
          </div>
          <div>
            <Label htmlFor="faculty">Faculty</Label>
            <Input id="faculty" {...registerProfile('faculty')} />
          </div>
          <div>
            <Label htmlFor="level">Level</Label>
            <Input id="level" {...registerProfile('level')} />
          </div>
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        {savedMsg && <p className="text-sm text-forest-700">{savedMsg}</p>}
        <Button type="submit" variant="gold" disabled={savingProfile}>
          {savingProfile ? 'Saving…' : 'Save Changes'}
        </Button>
      </form>

      <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-5 mb-16 pt-10 border-t border-ink-100">
        <h2 className="text-lg font-display mb-2">Change Password</h2>
        <div>
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input id="currentPassword" type="password" {...registerPassword('currentPassword')} />
          {pwErrors.currentPassword && <p className="text-xs text-red-700 mt-1.5">{pwErrors.currentPassword.message}</p>}
        </div>
        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <Input id="newPassword" type="password" {...registerPassword('newPassword')} />
          {pwErrors.newPassword && <p className="text-xs text-red-700 mt-1.5">{pwErrors.newPassword.message}</p>}
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input id="confirmPassword" type="password" {...registerPassword('confirmPassword')} />
          {pwErrors.confirmPassword && <p className="text-xs text-red-700 mt-1.5">{pwErrors.confirmPassword.message}</p>}
        </div>
        {pwError && <p className="text-sm text-red-700">{pwError}</p>}
        {pwMsg && <p className="text-sm text-forest-700">{pwMsg}</p>}
        <Button type="submit" variant="outline" disabled={savingPassword}>
          {savingPassword ? 'Updating…' : 'Change Password'}
        </Button>
      </form>

      <div className="pt-6 border-t border-ink-100">
        <Button variant="destructive" onClick={logout}>Logout</Button>
      </div>
    </section>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileInner />
    </RequireAuth>
  );
}
