import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <Card>
      <CardContent className="p-5 sm:p-6">
        <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-sm bg-fcs-50 text-fcs-700">
          <Icon size={17} />
        </div>
        <p className="text-2xl font-display tabular-nums">{value}</p>
        <p className="mt-1 text-sm text-slate-500">{label}</p>
      </CardContent>
    </Card>
  );
}
