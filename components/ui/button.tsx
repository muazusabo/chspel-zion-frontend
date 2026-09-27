import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold transition-[background-color,color,box-shadow,transform] duration-200 ease-out hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fcs-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0',
  {
    variants: {
      variant: {
        default: 'bg-fcs-600 text-white hover:bg-fcs-700',
        gold: 'bg-gold-500 text-ink-900 hover:bg-gold-300',
        outline: 'border border-ink-200 bg-white text-ink hover:border-fcs-500 hover:bg-fcs-50',
        ghost: 'bg-transparent text-ink hover:bg-ink-50',
        link: 'bg-transparent text-ink underline-offset-4 hover:underline p-0 h-auto',
        destructive: 'bg-red-700 text-white hover:bg-red-800',
        success: 'bg-forest-700 text-white hover:bg-forest-900',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
