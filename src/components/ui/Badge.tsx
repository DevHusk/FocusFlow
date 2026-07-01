import { cn } from '@/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
}

const variants = {
  default: 'glass-light text-text-secondary',
  primary: 'bg-primary/[0.12] text-primary border border-primary/[0.08]',
  accent: 'bg-accent/[0.12] text-accent border border-accent/[0.08]',
  success: 'bg-success/[0.12] text-success border border-success/[0.08]',
  warning: 'bg-warning/[0.12] text-warning border border-warning/[0.08]',
  danger: 'bg-danger/[0.12] text-danger border border-danger/[0.08]',
};

export default function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-lg',
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-2.5 py-1 text-sm',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
