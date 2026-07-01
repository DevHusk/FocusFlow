import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, LayoutDashboard, Timer, BookOpen, CheckSquare,
  StickyNote, Target, Trophy, Calendar, BarChart3, Library,
  Settings, Zap, Plus,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
  shortcut?: string;
}

export default function CommandPalette() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = () => dispatch({ type: 'TOGGLE_COMMAND_PALETTE' });

  const commands: CommandItem[] = useMemo(() => [
    { id: 'dashboard', label: 'Go to Dashboard', icon: <LayoutDashboard size={16} />, action: () => { navigate('/dashboard'); close(); }, category: 'Navigation' },
    { id: 'pomodoro', label: 'Go to Pomodoro', icon: <Timer size={16} />, action: () => { navigate('/pomodoro'); close(); }, category: 'Navigation' },
    { id: 'planner', label: 'Go to Study Planner', icon: <BookOpen size={16} />, action: () => { navigate('/planner'); close(); }, category: 'Navigation' },
    { id: 'tasks', label: 'Go to Tasks', icon: <CheckSquare size={16} />, action: () => { navigate('/tasks'); close(); }, category: 'Navigation' },
    { id: 'notes', label: 'Go to Notes', icon: <StickyNote size={16} />, action: () => { navigate('/notes'); close(); }, category: 'Navigation' },
    { id: 'habits', label: 'Go to Habits', icon: <Target size={16} />, action: () => { navigate('/habits'); close(); }, category: 'Navigation' },
    { id: 'goals', label: 'Go to Goals', icon: <Trophy size={16} />, action: () => { navigate('/goals'); close(); }, category: 'Navigation' },
    { id: 'calendar', label: 'Go to Calendar', icon: <Calendar size={16} />, action: () => { navigate('/calendar'); close(); }, category: 'Navigation' },
    { id: 'analytics', label: 'Go to Analytics', icon: <BarChart3 size={16} />, action: () => { navigate('/analytics'); close(); }, category: 'Navigation' },
    { id: 'resources', label: 'Go to Resources', icon: <Library size={16} />, action: () => { navigate('/resources'); close(); }, category: 'Navigation' },
    { id: 'settings', label: 'Go to Settings', icon: <Settings size={16} />, action: () => { navigate('/settings'); close(); }, category: 'Navigation' },
    { id: 'focus', label: 'Enter Focus Mode', icon: <Zap size={16} />, action: () => { dispatch({ type: 'SET_FOCUS_MODE', payload: true }); close(); }, category: 'Actions', shortcut: 'F' },
    { id: 'new-task', label: 'New Task', icon: <Plus size={16} />, action: () => { navigate('/tasks'); close(); }, category: 'Actions', shortcut: 'T' },
    { id: 'new-note', label: 'New Note', icon: <Plus size={16} />, action: () => { navigate('/notes'); close(); }, category: 'Actions', shortcut: 'N' },
  ], [navigate, dispatch, close]);

  const filtered = useMemo(() => {
    if (!query) return commands;
    const q = query.toLowerCase();
    return commands.filter(c => c.label.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
  }, [query, commands]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        filtered[selectedIndex]?.action();
        break;
    }
  };

  const categories = [...new Set(filtered.map(c => c.category))];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh]"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15 }}
        className="relative w-full max-w-lg bg-bg-card border border-border rounded-2xl shadow-modal overflow-hidden"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-border">
          <Search size={18} className="text-text-tertiary shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent text-sm text-text placeholder:text-text-muted outline-none"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-bg-elevated text-xs text-text-muted border border-border">ESC</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[320px] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-text-tertiary">
              No commands found
            </div>
          ) : (
            categories.map(cat => (
              <div key={cat}>
                <div className="px-4 py-1.5 text-xs font-medium text-text-muted uppercase tracking-wider">{cat}</div>
                {filtered.filter(c => c.category === cat).map((cmd) => {
                  const idx = filtered.indexOf(cmd);
                  return (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                        idx === selectedIndex
                          ? 'bg-primary/10 text-primary'
                          : 'text-text-secondary hover:bg-bg-elevated'
                      )}
                    >
                      {cmd.icon}
                      <span className="flex-1 text-left">{cmd.label}</span>
                      {cmd.shortcut && (
                        <kbd className="px-1.5 py-0.5 rounded bg-bg-elevated text-xs text-text-muted border border-border">
                          {cmd.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
