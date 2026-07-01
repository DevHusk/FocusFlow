import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, CheckSquare, Circle, Trash2, Edit3,
  Calendar, Flag, Tag, X, SortDesc,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import { generateId, cn, sortByPriority, sortByDate } from '@/utils';
import { TASK_CATEGORIES } from '@/constants';
import type { Task, TaskPriority } from '@/types';

export default function TasksPage() {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Study');

  const filteredTasks = useMemo(() => {
    let tasks = [...state.tasks];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      tasks = tasks.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
      );
    }

    // Filter priority
    if (filterPriority !== 'all') {
      tasks = tasks.filter(t => t.priority === filterPriority);
    }

    // Filter category
    if (filterCategory !== 'all') {
      tasks = tasks.filter(t => t.category === filterCategory);
    }

    // Sort
    if (sortBy === 'priority') {
      tasks = sortByPriority(tasks);
    } else {
      tasks = sortByDate(tasks, 'createdAt', 'desc');
    }

    return tasks;
  }, [state.tasks, searchQuery, filterPriority, filterCategory, sortBy]);

  const completedCount = state.tasks.filter(t => t.completed).length;
  const totalCount = state.tasks.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const openCreate = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setCategory('Study');
    setShowModal(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority);
    setDueDate(task.dueDate || '');
    setCategory(task.category || 'Study');
    setShowModal(true);
  };

  const handleSave = () => {
    if (!title.trim()) return;

    if (editingTask) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: { ...editingTask, title, description, priority, dueDate, category, updatedAt: new Date().toISOString() },
      });
    } else {
      dispatch({
        type: 'ADD_TASK',
        payload: {
          id: generateId(),
          title,
          description,
          completed: false,
          priority,
          dueDate: dueDate || undefined,
          category,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          order: state.tasks.length,
        },
      });
    }
    setShowModal(false);
  };

  const toggleComplete = (task: Task) => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: { ...task, completed: !task.completed, updatedAt: new Date().toISOString() },
    });
    if (!task.completed) {
      dispatch({ type: 'ADD_XP', payload: 10 });
    }
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const priorityColors: Record<string, string> = {
    urgent: '#FB7185',
    high: '#FBBF24',
    medium: '#00E5C7',
    low: '#34D399',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text">Tasks</h1>
          <p className="text-sm text-text-secondary mt-1">
            {completedCount}/{totalCount} tasks completed ({progressPct}%)
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> New Task
        </Button>
      </div>

      {/* Progress bar */}
      <Card padding="sm">
        <div className="h-2 bg-card rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
        <Select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          options={[
            { value: 'all', label: 'All Priorities' },
            { value: 'urgent', label: 'Urgent' },
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' },
          ]}
        />
        <Select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          options={[
            { value: 'all', label: 'All Categories' },
            ...TASK_CATEGORIES.map(c => ({ value: c, label: c })),
          ]}
        />
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'priority')}
          options={[
            { value: 'date', label: 'Sort by Date' },
            { value: 'priority', label: 'Sort by Priority' },
          ]}
        />
      </div>

      {/* Task list */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare size={28} />}
          title={searchQuery ? "No tasks found" : "No tasks yet"}
          description={searchQuery ? "Try adjusting your search or filters" : "Create your first task to get started"}
          action={!searchQuery ? <Button onClick={openCreate}><Plus size={16} /> Create Task</Button> : undefined}
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filteredTasks.map(task => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                layout
              >
                <Card hover className="flex items-center gap-3">
                  <button
                    onClick={() => toggleComplete(task)}
                    className={cn(
                      'w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all',
                      task.completed
                        ? 'bg-success border-success'
                        : 'border-text-muted hover:border-primary'
                    )}
                  >
                    {task.completed && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-medium', task.completed ? 'line-through text-text-muted' : 'text-text')}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-text-tertiary mt-0.5 truncate">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      {task.dueDate && (
                        <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                          <Calendar size={10} /> {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                      {task.category && (
                        <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                          <Tag size={10} /> {task.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant={task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : task.priority === 'medium' ? 'primary' : 'success'}>
                    {task.priority}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(task)}>
                      <Edit3 size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-danger hover:text-danger" onClick={() => deleteTask(task.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingTask ? 'Edit Task' : 'New Task'}>
        <div className="space-y-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
          />
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
              className="w-full px-3 py-2.5 bg-card border border-white/[0.06] rounded-xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/[0.3] focus:border-primary/[0.15] transition-all resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' },
              ]}
            />
            <Input
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={TASK_CATEGORIES.map(c => ({ value: c, label: c }))}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSave} className="flex-1">{editingTask ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
