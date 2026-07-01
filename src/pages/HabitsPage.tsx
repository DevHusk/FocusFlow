import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Trash2, Flame, TrendingUp, CheckCircle2, XCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { generateId, cn, calculateStreak, withOpacity } from '@/utils';
import { format, subDays, startOfWeek, addDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Habit } from '@/types';
import { SUBJECT_COLORS } from '@/constants';

export default function HabitsPage() {
  const { state, dispatch } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habitColor, setHabitColor] = useState(SUBJECT_COLORS[0]);

  const today = format(new Date(), 'yyyy-MM-dd');

  // Weekly data for chart
  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const completedCount = state.habits.filter(h => h.completedDates.includes(dateStr)).length;
      days.push({ day: format(d, 'EEE'), count: completedCount });
    }
    return days;
  }, [state.habits]);

  // Monthly completion rate
  const monthlyRate = useMemo(() => {
    if (state.habits.length === 0) return 0;
    const now = new Date();
    let totalExpected = 0;
    let totalCompleted = 0;
    state.habits.forEach(h => {
      for (let i = 29; i >= 0; i--) {
        const d = subDays(now, i);
        const dateStr = format(d, 'yyyy-MM-dd');
        if (dateStr <= today) {
          totalExpected++;
          if (h.completedDates.includes(dateStr)) totalCompleted++;
        }
      }
    });
    return totalExpected > 0 ? Math.round((totalCompleted / totalExpected) * 100) : 0;
  }, [state.habits, today]);

  const longestStreak = useMemo(() => {
    return Math.max(0, ...state.habits.map(h => calculateStreak(h.completedDates)));
  }, [state.habits]);

  const handleCreate = () => {
    if (!habitName.trim()) return;
    dispatch({
      type: 'ADD_HABIT',
      payload: {
        id: generateId(),
        name: habitName,
        color: habitColor,
        frequency: 'daily',
        completedDates: [],
        createdAt: new Date().toISOString(),
      },
    });
    setHabitName('');
    setShowModal(false);
  };

  const toggleHabit = (habit: Habit) => {
    const completed = habit.completedDates.includes(today);
    const newDates = completed
      ? habit.completedDates.filter(d => d !== today)
      : [...habit.completedDates, today];

    dispatch({
      type: 'UPDATE_HABIT',
      payload: { ...habit, completedDates: newDates },
    });

    if (!completed) {
      dispatch({ type: 'ADD_XP', payload: 5 });
    }
  };

  // Generate last 30 days heatmap for each habit
  const getHeatmapData = (habit: Habit) => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const dateStr = format(d, 'yyyy-MM-dd');
      days.push({
        date: dateStr,
        completed: habit.completedDates.includes(dateStr),
      });
    }
    return days;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Habit Tracker</h1>
          <p className="text-sm text-text-secondary mt-1">Build consistent daily habits</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} /> New Habit
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-text">{state.habits.length}</p>
              <p className="text-xs text-text-tertiary">Active Habits</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-text">{monthlyRate}%</p>
              <p className="text-xs text-text-tertiary">Monthly Rate</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Flame size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-xl font-bold text-text">{longestStreak}</p>
              <p className="text-xs text-text-tertiary">Longest Streak</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-xl font-bold text-text">
                {state.habits.filter(h => h.completedDates.includes(today)).length}/{state.habits.length}
              </p>
              <p className="text-xs text-text-tertiary">Done Today</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly chart */}
      {state.habits.length > 0 && (
        <Card>
          <h2 className="text-base font-semibold text-text mb-4">This Week</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141A26', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: '#94A3B8' }}
                />
                <Bar dataKey="count" fill="#7C5CFF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Habits */}
      {state.habits.length === 0 ? (
        <EmptyState
          icon={<Target size={28} />}
          title="No habits yet"
          description="Start building positive habits that will transform your study routine"
          action={<Button onClick={() => setShowModal(true)}><Plus size={16} /> Create Habit</Button>}
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {state.habits.map(habit => {
              const todayDone = habit.completedDates.includes(today);
              const streak = calculateStreak(habit.completedDates);
              const heatmap = getHeatmapData(habit);

              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card hover>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleHabit(habit)}
                        className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center transition-all shrink-0',
                          todayDone
                            ? 'text-white'
                            : 'border-2 border-text-muted hover:border-primary'
                        )}
                        style={todayDone ? { backgroundColor: habit.color } : {}}
                      >
                        {todayDone ? <CheckCircle2 size={22} /> : <Target size={18} className="text-text-muted" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-text">{habit.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-text-tertiary flex items-center gap-1">
                            <Flame size={12} className="text-warning" /> {streak} day streak
                          </span>
                        </div>
                        {/* 30-day heatmap */}
                        <div className="flex gap-0.5 mt-2">
                          {heatmap.map((day, i) => (
                            <div
                              key={i}
                              className={cn('w-3 h-3 rounded-sm transition-all hover:scale-125', day.completed ? 'opacity-100' : 'opacity-20')}
                              style={{ backgroundColor: habit.color }}
                              title={`${day.date}: ${day.completed ? 'Done' : 'Missed'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => dispatch({ type: 'DELETE_HABIT', payload: habit.id })}
                        className="text-text-muted hover:text-danger transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Habit" size="sm">
        <div className="space-y-4">
          <Input label="Habit Name" value={habitName} onChange={(e) => setHabitName(e.target.value)} placeholder="e.g. Study 2 hours" />
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Color</label>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setHabitColor(color)}
                  className={cn('w-8 h-8 rounded-lg transition-all', habitColor === color && 'ring-2 ring-offset-2 ring-offset-bg-card')}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleCreate} className="flex-1">Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
