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
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
    secondary: 'border border-brand-600 text-brand-700 hover:bg-brand-50',
    ghost: 'text-brand-700 hover:bg-brand-50',
  };

  const classes = cn(
    'inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-colors',
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
