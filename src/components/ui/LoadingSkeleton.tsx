import { cn } from '@/utils';

interface LoadingSkeletonProps {
  fullPage?: boolean;
  className?: string;
  lines?: number;
  type?: 'text' | 'card' | 'chart' | 'stat';
}

export default function LoadingSkeleton({ fullPage, className, lines = 3, type = 'text' }: LoadingSkeletonProps) {
  if (fullPage) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent animate-pulse" />
          <div className="text-sm text-text-tertiary">Loading...</div>
        </div>
      </div>
    );
  }

  if (type === 'stat') {
    return (
      <div className={cn('bg-bg-card border border-border rounded-2xl p-5 animate-pulse', className)}>
        <div className="h-4 w-20 bg-bg-elevated rounded mb-3" />
        <div className="h-8 w-16 bg-bg-elevated rounded mb-2" />
        <div className="h-3 w-24 bg-bg-elevated rounded" />
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={cn('bg-bg-card border border-border rounded-2xl p-5 animate-pulse', className)}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-bg-elevated" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-bg-elevated rounded mb-2" />
            <div className="h-3 w-20 bg-bg-elevated rounded" />
          </div>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-3 bg-bg-elevated rounded" style={{ width: `${85 - i * 15}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={cn('bg-bg-card border border-border rounded-2xl p-5 animate-pulse', className)}>
        <div className="h-5 w-32 bg-bg-elevated rounded mb-4" />
        <div className="h-48 bg-bg-elevated rounded-xl" />
      </div>
    );
  }

  return (
    <div className={cn('animate-pulse space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 bg-bg-elevated rounded" style={{ width: `${100 - i * 10}%` }} />
      ))}
    </div>
  );
}
