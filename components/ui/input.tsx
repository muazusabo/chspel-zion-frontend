import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-12 w-full rounded-sm border border-ink-200 bg-white px-3.5 py-2 text-sm text-ink placeholder:text-slate-400 transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fcs-500/25 focus-visible:border-fcs-500',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export { Input };
