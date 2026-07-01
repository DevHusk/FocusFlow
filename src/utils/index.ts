import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isToday, isTomorrow, isThisWeek, parseISO } from 'date-fns';
import { LEVEL_THRESHOLDS } from '@/constants';

// ─── Class Name Utility ─────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── ID Generator ──────────────────────────────────────────────
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Date Formatting ───────────────────────────────────────────
export function formatDate(date: string | Date, fmt: string = 'MMM dd, yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, fmt);
}

export function formatRelativeDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  if (isThisWeek(d)) return format(d, 'EEEE');
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatTimer(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ─── Math Utilities ────────────────────────────────────────────
export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
}

export function calculateFocusScore(sessions: { duration: number; completed: boolean }[]): number {
  if (sessions.length === 0) return 0;
  const completed = sessions.filter(s => s.completed).length;
  const totalDuration = sessions.reduce((acc, s) => acc + s.duration, 0);
  const avgDuration = totalDuration / sessions.length;
  const completionRate = completed / sessions.length;
  const durationScore = Math.min(avgDuration / (25 * 60), 1); // normalize to 25 min
  return Math.round((completionRate * 60 + durationScore * 40));
}

// ─── XP & Levels ───────────────────────────────────────────────
export function getLevelFromXP(xp: number): number {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return level;
}

export function getXPForNextLevel(level: number): number {
  if (level >= LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  return LEVEL_THRESHOLDS[level];
}

export function getLevelProgress(xp: number): number {
  const level = getLevelFromXP(xp);
  const currentThreshold = level > 1 ? LEVEL_THRESHOLDS[level - 1] : 0;
  const nextThreshold = getXPForNextLevel(level);
  const range = nextThreshold - currentThreshold;
  return Math.round(((xp - currentThreshold) / range) * 100);
}

// ─── Streak Calculator ─────────────────────────────────────────
export function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;
  const sorted = [...completedDates].sort().reverse();
  const today = format(new Date(), 'yyyy-MM-dd');
  let streak = 0;
  let currentDate = new Date(today);

  for (const dateStr of sorted) {
    const expected = format(currentDate, 'yyyy-MM-dd');
    if (dateStr === expected) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (dateStr < expected) {
      break;
    }
  }
  return streak;
}

// ─── Color Utilities ───────────────────────────────────────────
export function hexToRGB(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

export function withOpacity(hex: string, opacity: number): string {
  const rgb = hexToRGB(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

// ─── Data Export ───────────────────────────────────────────────
export function exportToJSON(data: Record<string, unknown>, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToCSV(headers: string[], rows: (string | number)[][], filename: string): void {
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Search Utility ────────────────────────────────────────────
export function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

// ─── Sort Utility ──────────────────────────────────────────────
export type SortDirection = 'asc' | 'desc';

export function sortByDate<T>(items: T[], key: keyof T, direction: SortDirection = 'desc'): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a[key] as string).getTime();
    const dateB = new Date(b[key] as string).getTime();
    return direction === 'asc' ? dateA - dateB : dateB - dateA;
  });
}

export function sortByPriority<T extends { priority: string }>(items: T[]): T[] {
  const order = { urgent: 0, high: 1, medium: 2, low: 3 };
  return [...items].sort((a, b) => (order[a.priority as keyof typeof order] ?? 4) - (order[b.priority as keyof typeof order] ?? 4));
}
