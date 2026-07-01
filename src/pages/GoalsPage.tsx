import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trophy, Target, CheckCircle2, Trash2, Edit3,
  Calendar, TrendingUp, Star, ChevronDown, ChevronRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import EmptyState from '@/components/ui/EmptyState';
import { generateId, cn, calculateProgress } from '@/utils';
import type { Goal, GoalType, Milestone } from '@/types';

export default function GoalsPage() {
  const { state, dispatch } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [selectedType, setSelectedType] = useState<GoalType | 'all'>('all');
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalType, setGoalType] = useState<GoalType>('daily');
  const [targetValue, setTargetValue] = useState(10);
  const [unit, setUnit] = useState('hours');

  const filteredGoals = selectedType === 'all'
    ? state.goals
    : state.goals.filter(g => g.type === selectedType);

  const completedGoals = state.goals.filter(g => g.completed).length;
  const totalGoals = state.goals.length;

  const handleSave = () => {
    if (!title.trim()) return;
    if (editingGoal) {
      dispatch({
        type: 'UPDATE_GOAL',
        payload: {
          ...editingGoal, title, description, type: goalType,
          targetValue, unit, currentValue: editingGoal.currentValue,
          updatedAt: new Date().toISOString(),
        },
      });
    } else {
      dispatch({
        type: 'ADD_GOAL',
        payload: {
          id: generateId(), title, description, type: goalType,
          targetValue, currentValue: 0, unit,
          milestones: [], completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle(''); setDescription(''); setGoalType('daily'); setTargetValue(10); setUnit('hours');
    setEditingGoal(null);
  };

  const toggleGoalComplete = (goal: Goal) => {
    dispatch({
      type: 'UPDATE_GOAL',
      payload: { ...goal, completed: !goal.completed, updatedAt: new Date().toISOString() },
    });
    if (!goal.completed) dispatch({ type: 'ADD_XP', payload: 25 });
  };

  const updateGoalProgress = (goal: Goal, increment: number) => {
    const newValue = Math.max(0, Math.min(goal.targetValue, goal.currentValue + increment));
    dispatch({
      type: 'UPDATE_GOAL',
      payload: {
        ...goal,
        currentValue: newValue,
        completed: newValue >= goal.targetValue,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const toggleMilestone = (goal: Goal, milestoneId: string) => {
    dispatch({
      type: 'UPDATE_GOAL',
      payload: {
        ...goal,
        milestones: goal.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m),
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const addMilestone = (goal: Goal) => {
    const name = prompt('Milestone name:');
    if (!name) return;
    dispatch({
      type: 'UPDATE_GOAL',
      payload: {
        ...goal,
        milestones: [...goal.milestones, { id: generateId(), title: name, completed: false }],
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const goalTypeColors: Record<GoalType, string> = {
    daily: '#4F8CFF',
    weekly: '#7C5CFF',
    monthly: '#22C55E',
    'long-term': '#F59E0B',
  };

  const goalTypeLabels: Record<GoalType, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    'long-term': 'Long Term',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Goals</h1>
          <p className="text-sm text-text-secondary mt-1">{completedGoals}/{totalGoals} goals completed</p>
        </div>
        <Button onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={16} /> New Goal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(['daily', 'weekly', 'monthly', 'long-term'] as const).map(type => {
          const count = state.goals.filter(g => g.type === type).length;
          const done = state.goals.filter(g => g.type === type && g.completed).length;
          return (
            <Card key={type} hover onClick={() => setSelectedType(selectedType === type ? 'all' : type)}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${goalTypeColors[type]}15` }}>
                  <Trophy size={20} style={{ color: goalTypeColors[type] }} />
                </div>
                <div>
                  <p className="text-lg font-bold text-text">{done}/{count}</p>
                  <p className="text-xs text-text-tertiary">{goalTypeLabels[type]}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Type filter */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectedType('all')}
          className={cn('px-3 py-1.5 rounded-xl text-sm font-medium transition-all',
            selectedType === 'all' ? 'bg-primary text-white' : 'bg-bg-card text-text-secondary hover:text-text border border-border'
          )}
        >All</button>
        {(['daily', 'weekly', 'monthly', 'long-term'] as const).map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(selectedType === type ? 'all' : type)}
            className={cn('px-3 py-1.5 rounded-xl text-sm font-medium transition-all',
              selectedType === type ? 'text-white' : 'bg-bg-card text-text-secondary hover:text-text border border-border'
            )}
            style={selectedType === type ? { backgroundColor: goalTypeColors[type] } : {}}
          >{goalTypeLabels[type]}</button>
        ))}
      </div>

      {/* Goals list */}
      {filteredGoals.length === 0 ? (
        <EmptyState
          icon={<Trophy size={28} />}
          title="No goals yet"
          description="Set your first goal and start tracking your progress"
          action={<Button onClick={() => setShowModal(true)}><Plus size={16} /> Create Goal</Button>}
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredGoals.map(goal => {
              const progress = calculateProgress(goal.currentValue, goal.targetValue);
              const isExpanded = expandedGoal === goal.id;
              return (
                <motion.div key={goal.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Card className={cn(goal.completed && 'border-success/20')}>
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleGoalComplete(goal); }}
                        className={cn('w-8 h-8 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all',
                          goal.completed ? 'bg-success border-success' : 'border-text-muted hover:border-primary'
                        )}
                      >
                        {goal.completed && <CheckCircle2 size={16} className="text-white" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className={cn('text-sm font-semibold', goal.completed ? 'line-through text-text-muted' : 'text-text')}>{goal.title}</h3>
                          <Badge variant="primary" size="sm">{goalTypeLabels[goal.type]}</Badge>
                        </div>
                        <div className="mt-1.5">
                          <ProgressBar value={goal.currentValue} max={goal.targetValue} color={goalTypeColors[goal.type]} size="sm" showLabel />
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {!goal.completed && (
                          <>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); updateGoalProgress(goal, -1); }}>-</Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); updateGoalProgress(goal, 1); }}>+</Button>
                          </>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-danger" onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DELETE_GOAL', payload: goal.id }); }}>
                          <Trash2 size={14} />
                        </Button>
                        {isExpanded ? <ChevronDown size={16} className="text-text-tertiary" /> : <ChevronRight size={16} className="text-text-tertiary" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border">
                        {goal.description && <p className="text-sm text-text-secondary mb-3">{goal.description}</p>}
                        <div className="flex items-center gap-4 text-xs text-text-tertiary mb-3">
                          <span>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                          <span>{progress}% complete</span>
                        </div>

                        {/* Milestones */}
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-text-secondary">Milestones</h4>
                            <Button variant="ghost" size="sm" onClick={() => addMilestone(goal)}>+ Add</Button>
                          </div>
                          {goal.milestones.length === 0 ? (
                            <p className="text-xs text-text-muted">No milestones yet</p>
                          ) : (
                            <div className="space-y-1">
                              {goal.milestones.map(m => (
                                <div key={m.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-bg-elevated">
                                  <button
                                    onClick={() => toggleMilestone(goal, m.id)}
                                    className={cn('w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all',
                                      m.completed ? 'border-success bg-success' : 'border-text-muted'
                                    )}
                                  >
                                    {m.completed && <CheckCircle2 size={12} className="text-white" />}
                                  </button>
                                  <span className={cn('text-sm', m.completed ? 'line-through text-text-muted' : 'text-text')}>{m.title}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingGoal ? 'Edit Goal' : 'New Goal'}>
        <div className="space-y-4">
          <Input label="Goal Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Study 2 hours daily" />
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What do you want to achieve?" rows={3}
              className="w-full px-3 py-2.5 bg-bg-elevated border border-border rounded-xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Type" value={goalType} onChange={e => setGoalType(e.target.value as GoalType)}
              options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }, { value: 'long-term', label: 'Long Term' }]} />
            <Input label="Target" type="number" value={String(targetValue)} onChange={e => setTargetValue(Number(e.target.value))} />
          </div>
          <Input label="Unit" value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g. hours, pages, sessions" />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSave} className="flex-1">{editingGoal ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
