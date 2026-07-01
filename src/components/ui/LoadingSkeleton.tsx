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
      <div className="min-h-screen bg-bg flex items-center justify-center relative">
        <div className="aurora-bg" />
        <div className="orb orb-teal w-[300px] h-[300px] -top-20 -left-20 animate-aurora-drift" />
        <div className="orb orb-pink w-[250px] h-[250px] -bottom-16 -right-16 animate-aurora-drift-2" />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent animate-pulse shadow-glow" />
          <div className="text-sm text-text-tertiary">Loading...</div>
        </div>
      </div>
    );
  }

  if (type === 'stat') {
    return (
      <div className={cn('glass-card rounded-2xl p-5 animate-pulse', className)}>
        <div className="h-4 w-20 bg-white/[0.04] rounded mb-3" />
        <div className="h-8 w-16 bg-white/[0.04] rounded mb-2" />
        <div className="h-3 w-24 bg-white/[0.04] rounded" />
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={cn('glass-card rounded-2xl p-5 animate-pulse', className)}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04]" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-white/[0.04] rounded mb-2" />
            <div className="h-3 w-20 bg-white/[0.04] rounded" />
          </div>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-3 bg-white/[0.04] rounded" style={{ width: `${85 - i * 15}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={cn('glass-card rounded-2xl p-5 animate-pulse', className)}>
        <div className="h-5 w-32 bg-white/[0.04] rounded mb-4" />
        <div className="h-48 bg-white/[0.04] rounded-xl" />
      </div>
    );
  }

  return (
    <div className={cn('animate-pulse space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 bg-white/[0.04] rounded" style={{ width: `${100 - i * 10}%` }} />
      ))}
    </div>
  );
}
