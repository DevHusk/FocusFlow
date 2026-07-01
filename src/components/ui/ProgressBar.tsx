import { cn } from '@/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const colorMap: Record<string, string> = {
  aurora: 'linear-gradient(90deg, #00E5C7, #D946EF)',
  primary: 'linear-gradient(90deg, #00E5C7, #2EFDDB)',
  accent: 'linear-gradient(90deg, #D946EF, #E471F3)',
  success: 'linear-gradient(90deg, #34D399, #6EE7B7)',
  warning: 'linear-gradient(90deg, #FBBF24, #FDE68A)',
  danger: 'linear-gradient(90deg, #FB7185, #FDA4AF)',
};

export default function ProgressBar({ value, max = 100, color = 'aurora', size = 'md', showLabel = false, className }: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  const bgStyle = colorMap[color] || color;

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-text-secondary">{value} / {max}</span>
          <span className="text-xs font-medium text-text font-mono">{percentage}%</span>
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full overflow-hidden bg-white/[0.04]',
          size === 'sm' && 'h-1.5',
          size === 'md' && 'h-2',
          size === 'lg' && 'h-3',
        )}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            background: bgStyle,
          }}
        />
      </div>
    </div>
  );
}
