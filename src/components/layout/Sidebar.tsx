import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Timer, BookOpen, CheckSquare, StickyNote,
  Target, Calendar, BarChart3, Library, Settings, Zap,
  ChevronLeft, Quote, Music, Trophy, X, Brain,
} from 'lucide-react';
import { cn, getLevelProgress, formatMinutes } from '@/utils';
import { useApp } from '@/context/AppContext';
import ProgressBar from '@/components/ui/ProgressBar';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/pomodoro', icon: Timer, label: 'Pomodoro' },
  { to: '/planner', icon: BookOpen, label: 'Study Planner' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/notes', icon: StickyNote, label: 'Notes' },
  { to: '/habits', icon: Target, label: 'Habits' },
  { to: '/goals', icon: Trophy, label: 'Goals' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/resources', icon: Library, label: 'Resources' },
  { to: '/quotes', icon: Quote, label: 'Quotes' },
  { to: '/music', icon: Music, label: 'Focus Music' },
];

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobile = false, onClose }: SidebarProps) {
  const { state, dispatch } = useApp();
  const location = useLocation();
  const { sidebarOpen, user, focusMode } = state;

  const collapsed = !sidebarOpen && !mobile;
  const todayMinutes = state.dailyStudy.find(d => d.date === new Date().toISOString().slice(0, 10))?.minutes ?? 0;

  return (
    <>
      {/* Mobile overlay */}
      {mobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 72 : 260,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={cn(
          'fixed top-0 left-0 h-screen bg-bg-card border-r border-border z-50',
          'flex flex-col',
          mobile ? 'w-[260px]' : '',
          focusMode && !mobile ? 'hidden' : '',
          mobile && 'shadow-modal'
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Brain size={18} className="text-white" />
              </div>
              <span className="text-base font-bold text-text tracking-tight">FocusFlow</span>
            </motion.div>
          )}
          {mobile ? (
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg-elevated text-text-secondary">
              <X size={18} />
            </button>
          ) : (
            <button
              onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
              className="p-1.5 rounded-lg hover:bg-bg-elevated text-text-secondary"
            >
              <ChevronLeft size={16} className={cn('transition-transform', collapsed && 'rotate-180')} />
            </button>
          )}
        </div>

        {/* XP / Level card */}
        {!collapsed && (
          <div className="mx-3 mt-3 p-3 rounded-xl bg-bg-elevated border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Zap size={14} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-text">Level {user?.level ?? 1}</span>
              </div>
              <span className="text-xs text-text-tertiary">{user?.xp ?? 0} XP</span>
            </div>
            <ProgressBar
              value={getLevelProgress(user?.xp ?? 0)}
              size="sm"
              color="#7C5CFF"
            />
          </div>
        )}

        {/* Daily stat */}
        {!collapsed && (
          <div className="mx-3 mt-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Today</span>
              <span className="text-xs font-semibold text-primary">{formatMinutes(todayMinutes)}</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:text-text hover:bg-bg-elevated',
                collapsed && 'justify-center px-0'
              )}
            >
              <item.icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Settings + Focus Mode */}
        <div className="px-2 pb-3 space-y-0.5 border-t border-border pt-2">
          <button
            onClick={() => dispatch({ type: 'SET_FOCUS_MODE', payload: true })}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-all',
              'text-text-secondary hover:text-accent hover:bg-accent/10',
              collapsed && 'justify-center px-0'
            )}
          >
            <Zap size={18} />
            {!collapsed && <span>Focus Mode</span>}
          </button>
          <NavLink
            to="/settings"
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              isActive ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text hover:bg-bg-elevated',
              collapsed && 'justify-center px-0'
            )}
          >
            <Settings size={18} />
            {!collapsed && <span>Settings</span>}
          </NavLink>
        </div>
      </motion.aside>
    </>
  );
}
