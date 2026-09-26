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
      <CardContent className="p-6">
        <Icon size={18} className="text-gold-700 mb-4" />
        <p className="text-2xl font-display">{value}</p>
        <p className="text-sm text-slate-500 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}
