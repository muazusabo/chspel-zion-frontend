import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <section className="container py-32 text-center max-w-md">
      <Compass className="mx-auto text-gold-700 mb-6" size={36} />
      <p className="text-gold-700 text-sm mb-3">404</p>
      <h1 className="text-2xl md:text-3xl mb-4">Page not found</h1>
      <p className="text-slate-600 mb-8">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link href="/">
        <Button variant="gold">Back to Home</Button>
      </Link>
    </section>
  );
}
