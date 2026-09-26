'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Loading } from '@/components/shared/loading';

export function GuestOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) return;
    router.replace(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard');
  }, [loading, router, user]);

  if (loading || user) return <Loading label="Checking your session…" />;

  return <>{children}</>;
}
