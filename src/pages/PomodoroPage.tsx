import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play, Pause, SkipForward, RotateCcw, Maximize2,
  Volume2, VolumeX, Settings, Timer, Zap,
} from 'lucide-react';
import { usePomodoro } from '@/hooks/usePomodoro';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatTimer, formatMinutes, cn } from '@/utils';
import { POMODORO_PRESETS } from '@/constants';
import type { PomodoroPreset } from '@/types';

export default function PomodoroPage() {
  const { state, dispatch } = useApp();
  const {
    mode, timeLeft, isRunning, progress, totalTime,
    sessionsCompleted, start, pause, reset, skip,
    isFullscreen, toggleFullscreen,
  } = usePomodoro();

  const [selectedPreset, setSelectedPreset] = useState<PomodoroPreset>(state.settings.pomodoro.preset);

  const todaySessions = state.pomodoroSessions.filter(s => {
    const today = new Date().toISOString().slice(0, 10);
    return s.startedAt.startsWith(today);
  });

  const todayFocusMinutes = todaySessions
    .filter(s => s.completed)
    .reduce((acc, s) => acc + s.duration, 0) / 60;

  // Circular progress
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const modeColors = {
    focus: '#00E5C7',
    shortBreak: '#34D399',
    longBreak: '#D946EF',
  };

  const modeLabels = {
    focus: 'Focus Time',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-text">Pomodoro Timer</h1>
          <p className="text-sm text-text-secondary mt-1">Stay focused with timed study sessions</p>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
          <Maximize2 size={18} />
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timer */}
        <div className="lg:col-span-2">
          <Card className="flex flex-col items-center py-10">
            {/* Mode selector */}
            <div className="flex items-center gap-2 mb-8">
              {(['focus', 'shortBreak', 'longBreak'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => {
                    if (m === 'focus') reset();
                  }}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    mode === m
                      ? 'text-white'
                      : 'text-text-secondary hover:text-text hover:bg-card',
                  )}
                  style={mode === m ? { backgroundColor: modeColors[m] } : {}}
                >
                  {modeLabels[m]}
                </button>
              ))}
            </div>

            {/* Timer circle */}
            <div className="relative w-[280px] h-[280px] mb-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
                <circle
                  cx="130" cy="130" r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="6"
                />
                <circle
                  cx="130" cy="130" r={radius}
                  fill="none"
                  stroke={modeColors[mode]}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-display font-bold text-text font-mono tracking-wider">
                  {formatTimer(timeLeft)}
                </span>
                <span className="text-sm text-text-secondary mt-2">{modeLabels[mode]}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <Button variant="secondary" size="icon" onClick={reset}>
                <RotateCcw size={18} />
              </Button>
              <Button
                size="lg"
                onClick={isRunning ? pause : start}
                className="w-48"
                style={{ backgroundColor: modeColors[mode] }}
              >
                {isRunning ? (
                  <><Pause size={18} /> Pause</>
                ) : (
                  <><Play size={18} /> {mode === 'focus' ? 'Start Focus' : 'Start Break'}</>
                )}
              </Button>
              <Button variant="secondary" size="icon" onClick={skip}>
                <SkipForward size={18} />
              </Button>
            </div>

            {/* Session indicator */}
            <div className="flex items-center gap-2 mt-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-2.5 h-2.5 rounded-full transition-colors',
                    i < (sessionsCompleted % 4)
                      ? 'bg-primary'
                      : 'bg-card'
                  )}
                />
              ))}
              <span className="text-xs text-text-muted ml-2">
                Session {(sessionsCompleted % 4) + 1} of 4
              </span>
            </div>
          </Card>
        </div>

        {/* Sidebar stats */}
        <div className="space-y-4">
          {/* Preset selector */}
          <Card>
            <h3 className="text-sm font-semibold text-text mb-3">Timer Preset</h3>
            <div className="grid grid-cols-2 gap-2">
              {(['25/5', '50/10', '90/20'] as const).map(preset => (
                <button
                  key={preset}
                  onClick={() => setSelectedPreset(preset)}
                  className={cn(
                    'p-2.5 rounded-xl text-sm font-medium border transition-all',
                    selectedPreset === preset
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/[0.06] bg-card text-text-secondary hover:border-white/[0.12]'
                  )}
                >
                  {preset}
                </button>
              ))}
              <button
                onClick={() => setSelectedPreset('custom')}
                className={cn(
                  'p-2.5 rounded-xl text-sm font-medium border transition-all',
                  selectedPreset === 'custom'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-white/[0.06] bg-card text-text-secondary hover:border-white/[0.12]'
                )}
              >
                Custom
              </button>
            </div>
          </Card>

          {/* Today's stats */}
          <Card>
            <h3 className="text-sm font-semibold text-text mb-3">Today's Sessions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Focus Time</span>
                <span className="text-sm font-medium text-primary">{formatMinutes(Math.round(todayFocusMinutes))}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Sessions Done</span>
                <span className="text-sm font-medium text-text">{todaySessions.filter(s => s.completed).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Focus Score</span>
                <span className="text-sm font-medium text-success">
                  {todaySessions.length > 0
                    ? Math.round((todaySessions.filter(s => s.completed).length / todaySessions.length) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </Card>

          {/* XP earned */}
          <Card className="bg-accent/5 border-accent/10">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-accent" />
              <h3 className="text-sm font-semibold text-text">XP Earned Today</h3>
            </div>
            <p className="text-2xl font-display font-bold text-accent">
              {todaySessions.filter(s => s.completed).length * 15} XP
            </p>
          </Card>

          {/* Settings */}
          <Card>
            <h3 className="text-sm font-semibold text-text mb-3">Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Auto Break</span>
                <input
                  type="checkbox"
                  defaultChecked={state.settings.pomodoro.autoBreak}
                  onChange={(e) => dispatch({
                    type: 'UPDATE_SETTINGS',
                    payload: { pomodoro: { ...state.settings.pomodoro, autoBreak: e.target.checked } }
                  })}
                  className="w-4 h-4 rounded border-white/[0.06] bg-card text-primary focus:ring-primary/[0.3]"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Auto Focus</span>
                <input
                  type="checkbox"
                  defaultChecked={state.settings.pomodoro.autoFocus}
                  onChange={(e) => dispatch({
                    type: 'UPDATE_SETTINGS',
                    payload: { pomodoro: { ...state.settings.pomodoro, autoFocus: e.target.checked } }
                  })}
                  className="w-4 h-4 rounded border-white/[0.06] bg-card text-primary focus:ring-primary/[0.3]"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Ticking Sound</span>
                <input
                  type="checkbox"
                  defaultChecked={state.settings.pomodoro.tickingSound}
                  onChange={(e) => dispatch({
                    type: 'UPDATE_SETTINGS',
                    payload: { pomodoro: { ...state.settings.pomodoro, tickingSound: e.target.checked } }
                  })}
                  className="w-4 h-4 rounded border-white/[0.06] bg-card text-primary focus:ring-primary/[0.3]"
                />
              </label>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
