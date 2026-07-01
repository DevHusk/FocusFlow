import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, Command } from 'lucide-react';
import Sidebar from './Sidebar';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils';
import CommandPalette from '@/components/command-palette/CommandPalette';

export default function DashboardLayout() {
  const { state, dispatch } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { sidebarOpen, focusMode } = state;

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Sidebar */}
      <AnimatePresence>
        <Sidebar onClose={() => setMobileMenuOpen(false)} />
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && <Sidebar mobile onClose={() => setMobileMenuOpen(false)} />}
      </AnimatePresence>

      {/* Main content */}
      <motion.div
        initial={false}
        animate={{
          marginLeft: focusMode ? 0 : sidebarOpen ? 260 : 72,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="min-h-screen"
      >
        {/* Top bar */}
        <header className={cn(
          'h-16 border-b border-border bg-bg-card/50 backdrop-blur-sm',
          'flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30',
          focusMode && 'hidden'
        )}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-bg-elevated text-text-secondary lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_COMMAND_PALETTE' })}
              className="flex items-center gap-2 h-9 px-3 rounded-xl bg-bg-elevated border border-border text-text-tertiary text-sm hover:border-border-hover transition-colors"
            >
              <Search size={14} />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-bg-hover text-xs text-text-muted">
                <Command size={10} />K
              </kbd>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </main>
      </motion.div>

      {/* Command Palette */}
      <AnimatePresence>
        {state.commandPaletteOpen && <CommandPalette />}
      </AnimatePresence>
    </div>
  );
}
