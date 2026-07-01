import { motion } from 'framer-motion';
import { X, Timer, CheckSquare } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { MOTIVATIONAL_QUOTES } from '@/constants';
import { useState, useEffect } from 'react';

export default function FocusMode() {
  const { state, dispatch } = useApp();
  const [quote] = useState(() => {
    const idx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    return MOTIVATIONAL_QUOTES[idx];
  });

  const [currentQuote, setCurrentQuote] = useState(quote);
  useEffect(() => {
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
      setCurrentQuote(MOTIVATIONAL_QUOTES[idx]);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!state.focusMode) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-bg flex flex-col items-center justify-center"
    >
      {/* Aurora background for focus mode */}
      <div className="aurora-bg" />

      {/* Floating orbs */}
      <div className="orb orb-teal w-[500px] h-[500px] -top-40 -left-40 animate-aurora-drift" />
      <div className="orb orb-pink w-[400px] h-[400px] -bottom-32 -right-32 animate-aurora-drift-2" />
      <div className="orb orb-purple w-[300px] h-[300px] top-1/3 right-1/4 animate-aurora-drift-3" />

      {/* Exit button */}
      <button
        onClick={() => dispatch({ type: 'SET_FOCUS_MODE', payload: false })}
        className="absolute top-6 right-6 p-2.5 rounded-xl glass-light text-text-secondary hover:text-text transition-colors"
      >
        <X size={20} />
      </button>

      {/* Focus content */}
      <div className="relative z-10 text-center max-w-lg px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-aurora-strong">
            <Timer size={36} className="text-bg" />
          </div>
          <h1 className="text-4xl font-display font-bold text-text mb-2">Focus Mode</h1>
          <p className="text-text-secondary">Eliminate all distractions and concentrate on what matters.</p>
        </motion.div>

        {/* Motivational quote */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl glass-card"
        >
          <p className="text-lg text-text-secondary italic mb-3">"{currentQuote.text}"</p>
          <p className="text-sm text-text-tertiary">— {currentQuote.author}</p>
        </motion.div>

        {/* Quick task */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex items-center justify-center gap-3"
        >
          <button
            onClick={() => { dispatch({ type: 'SET_FOCUS_MODE', payload: false }); }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-bg text-sm font-semibold hover:shadow-aurora-strong transition-all"
          >
            <CheckSquare size={16} />
            Start Studying
          </button>
        </motion.div>

        {/* Keyboard hint */}
        <p className="mt-8 text-xs text-text-muted">
          Press <kbd className="px-1.5 py-0.5 rounded-md glass-light text-text-tertiary font-mono">ESC</kbd> to exit focus mode
        </p>
      </div>
    </motion.div>
  );
}
