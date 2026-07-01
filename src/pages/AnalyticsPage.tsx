import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Clock, Target, Flame, Award,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import { formatMinutes, cn } from '@/utils';
import { format, subDays, subMonths } from 'date-fns';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

export default function AnalyticsPage() {
  const { state } = useApp();
  const { dailyStudy, pomodoroSessions, subjects, tasks, habits } = state;

  // ─── Daily study data (last 30 days) ─────────────────────────
  const dailyData = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const d = subDays(new Date(), 29 - i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const entry = dailyStudy.find(s => s.date === dateStr);
      return { day: format(d, 'MMM dd'), minutes: entry?.minutes ?? 0 };
    });
  }, [dailyStudy]);

  // ─── Weekly aggregation ──────────────────────────────────────
  const weeklyData = useMemo(() => {
    const weeks: { week: string; minutes: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const weekStart = subDays(new Date(), i * 7);
      const weekEnd = subDays(new Date(), (i - 1) * 7);
      let total = 0;
      for (let d = 0; d < 7; d++) {
        const date = subDays(weekEnd, 6 - d);
        const dateStr = format(date, 'yyyy-MM-dd');
        const entry = dailyStudy.find(s => s.date === dateStr);
        total += entry?.minutes ?? 0;
      }
      weeks.push({ week: format(weekStart, 'MMM dd'), minutes: total });
    }
    return weeks;
  }, [dailyStudy]);

  // ─── Monthly data ────────────────────────────────────────────
  const monthlyData = useMemo(() => {
    const months: { month: string; minutes: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const month = subMonths(new Date(), i);
      const monthStr = format(month, 'yyyy-MM');
      const total = dailyStudy
        .filter(s => s.date.startsWith(monthStr))
        .reduce((acc, s) => acc + s.minutes, 0);
      months.push({ month: format(month, 'MMM'), minutes: total });
    }
    return months;
  }, [dailyStudy]);

  // ─── Subject distribution ────────────────────────────────────
  const subjectData = useMemo(() => {
    return subjects.filter(s => s.completedHours > 0).map(s => ({
      name: s.name,
      value: s.completedHours,
      color: s.color,
    }));
  }, [subjects]);

  // ─── Pomodoro data ───────────────────────────────────────────
  const pomodoroData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const count = pomodoroSessions.filter(s => s.startedAt.startsWith(dateStr) && s.completed).length;
      return { day: format(d, 'EEE'), sessions: count };
    });
  }, [pomodoroSessions]);

  // ─── Heatmap data (last 12 weeks) ────────────────────────────
  const heatmapData = useMemo(() => {
    const data: { date: string; count: number; level: number }[] = [];
    for (let i = 83; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const entry = dailyStudy.find(s => s.date === dateStr);
      const minutes = entry?.minutes ?? 0;
      const level = minutes === 0 ? 0 : minutes < 30 ? 1 : minutes < 60 ? 2 : minutes < 120 ? 3 : 4;
      data.push({ date: dateStr, count: minutes, level });
    }
    return data;
  }, [dailyStudy]);

  const heatmapColors = ['#141A26', '#4F8CFF20', '#4F8CFF40', '#4F8CFF80', '#4F8CFF'];

  // ─── Stats ───────────────────────────────────────────────────
  const totalMinutes = dailyStudy.reduce((a, s) => a + s.minutes, 0);
  const totalSessions = pomodoroSessions.filter(s => s.completed).length;
  const avgDailyMinutes = dailyStudy.length > 0 ? Math.round(totalMinutes / Math.max(dailyStudy.length, 1)) : 0;
  const taskCompletion = tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  const statCards = [
    { icon: Clock, label: 'Total Study', value: formatMinutes(totalMinutes), color: '#4F8CFF' },
    { icon: Target, label: 'Sessions', value: String(totalSessions), color: '#7C5CFF' },
    { icon: TrendingUp, label: 'Daily Average', value: formatMinutes(avgDailyMinutes), color: '#22C55E' },
    { icon: Award, label: 'Task Completion', value: `${taskCompletion}%`, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Analytics</h1>
        <p className="text-sm text-text-secondary mt-1">Track your study patterns and progress</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                  <stat.icon size={20} style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-xl font-bold text-text">{stat.value}</p>
                  <p className="text-xs text-text-tertiary">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily study chart */}
        <Card>
          <h2 className="text-base font-semibold text-text mb-4">Daily Study (30 days)</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="dailyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F8CFF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F8CFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} interval={4} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} tickFormatter={v => `${v}m`} />
                <Tooltip contentStyle={{ backgroundColor: '#141A26', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="minutes" stroke="#4F8CFF" strokeWidth={2} fill="url(#dailyGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Weekly study chart */}
        <Card>
          <h2 className="text-base font-semibold text-text mb-4">Weekly Study (12 weeks)</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} interval={1} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} tickFormatter={v => `${v}m`} />
                <Tooltip contentStyle={{ backgroundColor: '#141A26', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="minutes" fill="#7C5CFF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly study chart */}
        <Card>
          <h2 className="text-base font-semibold text-text mb-4">Monthly Study</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} tickFormatter={v => `${v}m`} />
                <Tooltip contentStyle={{ backgroundColor: '#141A26', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="minutes" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Subject distribution */}
        <Card>
          <h2 className="text-base font-semibold text-text mb-4">Subject Distribution</h2>
          {subjectData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-sm text-text-muted">No subject data yet</div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={subjectData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {subjectData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#141A26', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, fontSize: 12 }} />
                  <Legend formatter={(value) => <span style={{ color: '#94A3B8', fontSize: 12 }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* Pomodoro sessions chart */}
      <Card>
        <h2 className="text-base font-semibold text-text mb-4">Pomodoro Sessions (7 days)</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pomodoroData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: '#141A26', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="sessions" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Study heatmap */}
      <Card>
        <h2 className="text-base font-semibold text-text mb-4">Study Heatmap (12 weeks)</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-[600px]">
            {heatmapData.map((day, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm heatmap-cell"
                style={{ backgroundColor: heatmapColors[day.level] }}
                title={`${day.date}: ${day.count}m`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-text-muted">
            <span>Less</span>
            {heatmapColors.map((c, i) => (
              <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
            ))}
            <span>More</span>
          </div>
        </div>
      </Card>

      {/* Streak chart */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Flame size={18} className="text-warning" />
          <h2 className="text-base font-semibold text-text">Current Streak</h2>
        </div>
        <div className="text-center py-4">
          <p className="text-5xl font-bold gradient-text">
            {(() => {
              let streak = 0;
              const sorted = [...dailyStudy].sort((a, b) => b.date.localeCompare(a.date));
              let checkDate = new Date();
              for (const d of sorted) {
                const expected = format(checkDate, 'yyyy-MM-dd');
                if (d.date === expected && d.minutes > 0) { streak++; checkDate.setDate(checkDate.getDate() - 1); }
                else if (d.date < expected) break;
              }
              return streak;
            })()}
          </p>
          <p className="text-sm text-text-secondary mt-1">consecutive days of studying</p>
        </div>
      </Card>
    </div>
  );
}
