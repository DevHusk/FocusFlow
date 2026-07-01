import { cn } from '@/utils';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="w-16 h-16 rounded-2xl glass-light flex items-center justify-center text-text-tertiary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-display font-semibold text-text mb-1">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
