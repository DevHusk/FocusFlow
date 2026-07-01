import { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { generateId } from '@/utils';
import type { TimerMode } from '@/types';

export function usePomodoro() {
  const { state, dispatch } = useApp();
  const { pomodoro: settings } = state.settings;

  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalTime = mode === 'focus'
    ? settings.focusMinutes * 60
    : mode === 'shortBreak'
      ? settings.shortBreakMinutes * 60
      : settings.longBreakMinutes * 60;

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (mode === 'focus') {
      // Log completed session
      const session = {
        id: generateId(),
        startedAt: new Date(Date.now() - settings.focusMinutes * 60 * 1000).toISOString(),
        endedAt: new Date().toISOString(),
        duration: settings.focusMinutes * 60,
        mode: 'focus' as const,
        completed: true,
      };
      dispatch({ type: 'ADD_POMODORO_SESSION', payload: session });
      dispatch({ type: 'ADD_STUDY_TIME', payload: { date: new Date().toISOString().slice(0, 10), minutes: settings.focusMinutes } });
      dispatch({ type: 'ADD_XP', payload: 15 });
      setSessionsCompleted(prev => prev + 1);

      // Auto break
      if (settings.autoBreak) {
        const newSessions = sessionsCompleted + 1;
        if (newSessions % 4 === 0) {
          setMode('longBreak');
          setTimeLeft(settings.longBreakMinutes * 60);
        } else {
          setMode('shortBreak');
          setTimeLeft(settings.shortBreakMinutes * 60);
        }
        setIsRunning(true);
      }
    } else {
      // Break completed, auto focus or stop
      if (settings.autoFocus) {
        setMode('focus');
        setTimeLeft(settings.focusMinutes * 60);
        setIsRunning(true);
      } else {
        setMode('focus');
        setTimeLeft(settings.focusMinutes * 60);
      }
    }
  }, [mode, sessionsCompleted, settings, dispatch]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const resume = useCallback(() => setIsRunning(true), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(settings.focusMinutes * 60);
    setMode('focus');
  }, [settings.focusMinutes]);

  const skip = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (mode === 'focus') {
      setMode('shortBreak');
      setTimeLeft(settings.shortBreakMinutes * 60);
    } else {
      setMode('focus');
      setTimeLeft(settings.focusMinutes * 60);
    }
  }, [mode, settings]);

  const setCustomTime = useCallback((focus: number, shortBreak: number, longBreak: number) => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMode('focus');
    setTimeLeft(focus * 60);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return {
    mode,
    timeLeft,
    isRunning,
    progress,
    totalTime,
    sessionsCompleted,
    isFullscreen,
    start,
    pause,
    resume,
    reset,
    skip,
    setMode,
    setCustomTime,
    toggleFullscreen,
  };
}
