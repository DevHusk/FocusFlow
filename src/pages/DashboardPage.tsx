import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Clock, CheckSquare, Target, Flame, TrendingUp,
  Timer, BookOpen, ArrowRight, Quote, Plus, Star,
  Calendar, BarChart3, Trophy, Zap,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import { formatMinutes, formatRelativeDate, getLevelProgress, withOpacity } from '@/utils';
import { format } from 'date-fns';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';

// ─── Stat Card ─────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, subValue, color, link }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
  link?: string;
}) {
  return (
    <Link to={link ?? '#'}>
      <motion.div
        whileHover={{ y: -2 }}
        className="p-5 rounded-2xl glass-card hover:border-white/[0.12] transition-all group"
      >
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: withOpacity(color, 0.1) }}
          >
            <Icon size={20} style={{ color }} />
          </div>
          {link && <ArrowRight size={14} className="text-text-muted group-hover:text-text-secondary transition-colors mt-1" />}
        </div>
        <p className="text-2xl font-display font-bold text-text mb-0.5">{value}</p>
        <p className="text-sm text-text-tertiary">{label}</p>
        {subValue && <p className="text-xs text-text-muted mt-1">{subValue}</p>}
      </motion.div>
    </Link>
  );
}

// ─── Custom Tooltip ────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-3 py-2">
      <p className="text-xs text-text-tertiary">{label}</p>
      <p className="text-sm font-semibold text-primary">{formatMinutes(payload[0].value)}</p>
    </div>
  );
}

// ─── Dashboard Page ────────────────────────────────────────────
export default function DashboardPage() {
  const { state, todayQuote, getTodayStudyMinutes, getTodayTasks, getUpcomingDeadlines, getCompletionPercentage, getWeeklyStudyData } = useApp();
  const { subjects, tasks, habits, pomodoroSessions, dailyStudy, settings } = state;

  const todayMinutes = getTodayStudyMinutes();
  const todayTasks = getTodayTasks();
  const upcomingDeadlines = getUpcomingDeadlines();
  const completionPct = getCompletionPercentage();
  const weeklyData = getWeeklyStudyData();

  // Streak
  const streak = useMemo(() => {
    const sorted = [...dailyStudy].sort((a, b) => b.date.localeCompare(a.date));
    let count = 0;
    const today = format(new Date(), 'yyyy-MM-dd');
    let checkDate = new Date(today);

    for (const d of sorted) {
      const expected = format(checkDate, 'yyyy-MM-dd');
      if (d.date === expected && d.minutes > 0) {
        count++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (d.date < expected) break;
    }
    return count;
  }, [dailyStudy]);

  // Focus score for today
  const todayFocusScore = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todaySessions = pomodoroSessions.filter(s => s.startedAt.startsWith(today));
    if (todaySessions.length === 0) return 0;
    const completed = todaySessions.filter(s => s.completed).length;
    return Math.round((completed / Math.max(todaySessions.length, 1)) * 100);
  }, [pomodoroSessions]);

  // Chart data - last 7 days
  const chartData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const entry = dailyStudy.find(s => s.date === dateStr);
      days.push({
        day: format(d, 'EEE'),
        minutes: entry?.minutes ?? 0,
      });
    }
    return days;
  }, [dailyStudy]);

  // Subject distribution
  const subjectData = useMemo(() => {
    return subjects.slice(0, 5).map(s => ({
      name: s.name,
      hours: s.completedHours,
      color: s.color,
    }));
  }, [subjects]);

  const completedTasks = todayTasks.filter(t => t.completed).length;
  const totalTasks = todayTasks.length || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {state.user?.name}
          </h1>
          <p className="text-sm text-text-secondary mt-1">Here's your study overview for today</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/pomodoro"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-accent hover:shadow-aurora-strong text-bg rounded-xl text-sm font-semibold transition-all"
          >
            <Timer size={16} />
            Start Focus
          </Link>

        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Clock} label="Today's Study" value={formatMinutes(todayMinutes)} subValue="Keep going!" color="#00E5C7" link="/pomodoro" />
        <StatCard icon={CheckSquare} label="Tasks Today" value={`${completedTasks}/${totalTasks}`} subValue={`${completionPct}% complete`} color="#34D399" link="/tasks" />
        <StatCard icon={Flame} label="Current Streak" value={`${streak} days`} color="#FBBF24" link="/habits" />
        <StatCard icon={TrendingUp} label="Focus Score" value={`${todayFocusScore}%`} color="#D946EF" link="/analytics" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Study chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-text">Weekly Study</h2>
            <Link to="/analytics" className="text-xs text-primary hover:text-primary-hover transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5C7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00E5C7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={(v) => `${v}m`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="minutes" stroke="#00E5C7" strokeWidth={2} fill="url(#studyGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Motivation + Level */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Quote size={16} className="text-accent" />
              <h3 className="text-sm font-semibold text-text">Today's Motivation</h3>
            </div>
            <p className="text-sm text-text-secondary italic leading-relaxed">"{todayQuote.text}"</p>
            <p className="text-xs text-text-muted mt-2">— {todayQuote.author}</p>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={16} className="text-warning" />
              <h3 className="text-sm font-semibold text-text">Level {state.user?.level ?? 1}</h3>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-accent" />
              <span className="text-sm text-text-secondary">{state.user?.xp ?? 0} XP</span>
            </div>
            <ProgressBar value={getLevelProgress(state.user?.xp ?? 0)} color="#D946EF" size="sm" />
            <p className="text-xs text-text-muted mt-2">
              {100 - getLevelProgress(state.user?.xp ?? 0)} XP to next level
            </p>
          </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-text">Today's Tasks</h2>
            <Link to="/tasks" className="text-xs text-primary hover:text-primary-hover transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {todayTasks.length === 0 ? (
            <div className="py-8 text-center">
              <CheckSquare size={28} className="mx-auto text-text-muted mb-2" />
              <p className="text-sm text-text-tertiary">No tasks for today</p>
              <Link to="/tasks" className="text-xs text-primary hover:text-primary-hover mt-2 inline-block">
                + Add a task
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {todayTasks.slice(0, 5).map(task => (
                <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-card transition-colors">
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${task.completed ? 'bg-success border-success' : 'border-text-muted'}`}>
                    {task.completed && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                  <span className={`flex-1 text-sm ${task.completed ? 'line-through text-text-muted' : 'text-text'}`}>{task.title}</span>
                  <Badge variant={task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'default'}>
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-text">Upcoming Deadlines</h2>
            <Link to="/calendar" className="text-xs text-primary hover:text-primary-hover transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {upcomingDeadlines.length === 0 ? (
            <div className="py-8 text-center">
              <Calendar size={28} className="mx-auto text-text-muted mb-2" />
              <p className="text-sm text-text-tertiary">No upcoming deadlines</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingDeadlines.map(event => (
                <div key={event.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-card transition-colors">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: event.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text truncate">{event.title}</p>
                    <p className="text-xs text-text-tertiary">{formatRelativeDate(event.date)}</p>
                  </div>
                  <Badge variant={
                    event.type === 'exam' ? 'danger' :
                    event.type === 'assignment' ? 'warning' : 'default'
                  }>
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Subject progress */}
      {subjects.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-text">Subject Progress</h2>
            <Link to="/planner" className="text-xs text-primary hover:text-primary-hover transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.slice(0, 6).map(subject => (
              <div key={subject.id} className="p-3 rounded-xl bg-card border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }} />
                  <span className="text-sm font-medium text-text">{subject.name}</span>
                </div>
                <ProgressBar
                  value={subject.completedHours}
                  max={subject.targetHours}
                  color={subject.color}
                  size="sm"
                  showLabel
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: '/pomodoro', icon: Timer, label: 'Pomodoro', color: '#00E5C7' },
          { to: '/tasks', icon: CheckSquare, label: 'Tasks', color: '#34D399' },
          { to: '/notes', icon: BookOpen, label: 'Notes', color: '#D946EF' },
          { to: '/habits', icon: Target, label: 'Habits', color: '#FBBF24' },
        ].map(action => (
          <Link key={action.to} to={action.to}>
            <motion.div
              whileHover={{ y: -2 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-white/[0.06] hover:border-white/[0.12] transition-all"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: withOpacity(action.color, 0.1) }}>
                <action.icon size={20} style={{ color: action.color }} />
              </div>
              <span className="text-sm font-medium text-text">{action.label}</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
