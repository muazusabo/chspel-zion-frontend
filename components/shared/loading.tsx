import { Loader2 } from 'lucide-react';

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
      <Loader2 className="animate-spin" size={22} />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/3] rounded-md bg-ink-100 mb-4" />
          <div className="h-4 bg-ink-100 rounded w-2/3 mb-2" />
          <div className="h-3 bg-ink-100 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
