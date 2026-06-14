import Link from 'next/link';
import { cn } from '@/lib/utils';

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  external?: boolean;
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  external,
  className,
}: ButtonProps) {
  const styles = {
    primary: 'bg-accent-600 text-white hover:bg-accent-500 shadow-sm focus-visible:ring-accent-600/40',
    secondary: 'border-2 border-brand-600 text-brand-700 hover:bg-brand-50 focus-visible:ring-brand-600/30',
    ghost: 'text-brand-700 hover:bg-brand-50 focus-visible:ring-brand-600/30',
  };

  const classes = cn(
    'inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl px-6 py-3 text-base font-semibold transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2',
    styles[variant],
    className,
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
