'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Loading } from '@/components/shared/loading';
import type { Role } from '@/types';

export function RequireAuth({
  children,
  roles,
}: {
  children: React.ReactNode;
  /** If provided, only these roles may view the page (e.g. admin pages). */
  roles?: Role[];
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (roles && !roles.includes(user.role)) {
      router.replace('/dashboard');
    }
  }, [user, loading, roles, router]);

  if (loading || !user || (roles && !roles.includes(user.role))) {
    return <Loading label="Loading…" />;
  }

  return <>{children}</>;
}
