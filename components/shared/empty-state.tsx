import type { LucideIcon } from 'lucide-react';

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-50 text-ink-300 mb-5">
        <Icon size={24} />
      </div>
      <p className="font-display text-lg text-ink mb-1.5">{title}</p>
      {description && <p className="text-sm text-slate max-w-sm">{description}</p>}
    </div>
  );
}
