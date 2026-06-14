import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent-600 text-white hover:bg-accent-500 focus-visible:ring-accent-600/40',
  secondary: 'border-2 border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus-visible:ring-brand-600/30',
  ghost: 'text-slate-700 hover:bg-slate-100 focus-visible:ring-brand-600/30',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600/40',
};

const SIZES: Record<Size, string> = {
  sm: 'min-h-[40px] px-3 py-2 text-sm',
  md: 'min-h-[44px] px-4 py-2.5 text-base',
  lg: 'min-h-[48px] px-5 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center rounded-lg font-semibold shadow-sm transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    />
  );
});
