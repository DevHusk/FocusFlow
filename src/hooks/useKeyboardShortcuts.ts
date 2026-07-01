import { useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';

interface ShortcutHandlers {
  onPauseTimer?: () => void;
  onNewNote?: () => void;
  onNewTask?: () => void;
  onFocusMode?: () => void;
  onExitFocus?: () => void;
  onCommandPalette?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const { dispatch, state } = useApp();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

    // Command Palette: Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      dispatch({ type: 'TOGGLE_COMMAND_PALETTE' });
      return;
    }

    // Escape: Exit focus mode or close palette
    if (e.key === 'Escape') {
      if (state.commandPaletteOpen) {
        dispatch({ type: 'TOGGLE_COMMAND_PALETTE' });
      } else if (state.focusMode) {
        dispatch({ type: 'SET_FOCUS_MODE', payload: false });
      }
      return;
    }

    // Don't process single-key shortcuts if command palette is open
    if (state.commandPaletteOpen) return;

    switch (e.key.toLowerCase()) {
      case ' ':
        e.preventDefault();
        handlers.onPauseTimer?.();
        break;
      case 'n':
        if (!e.ctrlKey && !e.metaKey) {
          handlers.onNewNote?.();
        }
        break;
      case 't':
        if (!e.ctrlKey && !e.metaKey) {
          handlers.onNewTask?.();
        }
        break;
      case 'f':
        if (!e.ctrlKey && !e.metaKey) {
          if (state.focusMode) {
            dispatch({ type: 'SET_FOCUS_MODE', payload: false });
          } else {
            dispatch({ type: 'SET_FOCUS_MODE', payload: true });
          }
        }
        break;
    }
  }, [handlers, dispatch, state.commandPaletteOpen, state.focusMode]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
