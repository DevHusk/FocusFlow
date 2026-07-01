import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          // Variants
          variant === 'primary' && 'bg-gradient-to-r from-primary to-accent text-bg hover:shadow-aurora-strong focus:ring-primary/50 font-semibold',
          variant === 'secondary' && 'glass-light hover:bg-white/[0.08] text-text-secondary border border-white/[0.06] hover:border-white/[0.1] hover:text-text focus:ring-primary/30',
          variant === 'ghost' && 'bg-transparent hover:bg-white/[0.05] text-text-secondary hover:text-text focus:ring-primary/30',
          variant === 'danger' && 'bg-danger/10 hover:bg-danger/20 text-danger focus:ring-danger/50',
          variant === 'accent' && 'bg-accent hover:bg-accent-hover text-white focus:ring-accent/50 shadow-glow-accent',
          // Sizes
          size === 'sm' && 'h-8 px-3 text-xs gap-1.5',
          size === 'md' && 'h-10 px-4 text-sm gap-2',
          size === 'lg' && 'h-12 px-6 text-base gap-2.5',
          size === 'icon' && 'h-10 w-10 p-0',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
