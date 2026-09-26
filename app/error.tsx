'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log client-side for now; wire to a monitoring service in production.
    // Stack traces are never shown to the user, per spec.
    console.error(error);
  }, [error]);

  return (
    <section className="container py-32 text-center max-w-md">
      <AlertTriangle className="mx-auto text-red-700 mb-6" size={36} />
      <p className="text-red-700 text-sm mb-3">Something went wrong</p>
      <h1 className="text-2xl md:text-3xl mb-4">We hit a snag</h1>
      <p className="text-slate-600 mb-8">
        An unexpected error occurred. Please try again, and contact us if the problem continues.
      </p>
      <Button variant="gold" onClick={reset}>Try Again</Button>
    </section>
  );
}
