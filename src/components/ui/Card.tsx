import { cn } from '@/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export default function Card({ children, className, hover = false, padding = 'md' }: CardProps) {
  return (
    <div
      className={cn(
        'bg-bg-card border border-border rounded-2xl',
        hover && 'transition-all duration-200 hover:border-border-hover hover:shadow-card-hover cursor-pointer',
        padding === 'none' && '',
        padding === 'sm' && 'p-3',
        padding === 'md' && 'p-4 sm:p-5',
        padding === 'lg' && 'p-6',
        className
      )}
    >
      {children}
    </div>
  );
}
