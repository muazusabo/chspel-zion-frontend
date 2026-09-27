import Link from 'next/link';
import { Landmark, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OfflineRequestPage() {
  return (
    <section className="container max-w-md py-24 text-center">
      <Landmark className="mx-auto mb-5 text-gold-700" size={40} />
      <h1 className="mb-3 text-2xl">give generosely</h1>
      <p className="mb-8 text-sm leading-relaxed text-slate-600">
Luke 6:38: Promises that generosity is met with abundant return.      </p>
      <div className="flex justify-center gap-3">
        <Link href="/give/account"><Button variant="outline"><Landmark size={16} /> Account details</Button></Link>
        <Link href="/dashboard"><Button variant="gold"><Receipt size={16} /> Dashboard</Button></Link>
      </div>
    </section>
  );
}
