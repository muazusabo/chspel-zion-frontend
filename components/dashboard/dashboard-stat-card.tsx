import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardStatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: string;
}

export function DashboardStatCard({ label, value, icon: Icon, tone }: DashboardStatCardProps) {
  return (
    <Card className="shadow-[0_8px_24px_rgba(16,26,43,0.04)]">
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-3 text-2xl font-display text-ink">{value}</p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-sm ${tone}`}>
          <Icon size={18} />
        </span>
      </CardContent>
    </Card>
  );
}
