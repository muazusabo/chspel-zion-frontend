import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-ink-50 text-ink-700',
        gold: 'bg-gold-50 text-gold-700',
        forest: 'bg-forest-50 text-forest-700',
        urgent: 'bg-red-50 text-red-700',
        outline: 'border border-ink-200 text-ink',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
