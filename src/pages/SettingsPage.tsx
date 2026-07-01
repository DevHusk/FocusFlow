import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Palette, Timer, Bell, Volume2, Download,
  Upload, Trash2, Moon, Sun, Keyboard, Shield, AlertTriangle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { storage } from '@/services/storage';
import { SUBJECT_COLORS, POMODORO_PRESETS } from '@/constants';
import { cn, exportToJSON, exportToCSV } from '@/utils';
import { format } from 'date-fns';

export default function SettingsPage() {
  const { state, dispatch } = useApp();
  const { settings } = state;
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handlePresetChange = (preset: string) => {
    const p = preset as keyof typeof POMODORO_PRESETS;
    if (POMODORO_PRESETS[p]) {
      dispatch({
        type: 'UPDATE_SETTINGS',
        payload: {
          pomodoro: {
            ...settings.pomodoro,
            preset: p as any,
            focusMinutes: POMODORO_PRESETS[p].focus,
            shortBreakMinutes: POMODORO_PRESETS[p].shortBreak,
            longBreakMinutes: POMODORO_PRESETS[p].longBreak,
          },
        },
      });
    }
  };

  const handleExportJSON = () => {
    const data = storage.exportAll();
    exportToJSON(data, `focusflow-backup-${format(new Date(), 'yyyy-MM-dd')}`);
  };

  const handleExportCSV = () => {
    const headers = ['Type', 'Title', 'Status', 'Date'];
    const rows: (string | number)[][] = [];
    state.tasks.forEach(t => rows.push(['Task', t.title, t.completed ? 'Done' : 'Pending', t.createdAt]));
    state.notes.forEach(n => rows.push(['Note', n.title, 'Created', n.createdAt]));
    state.habits.forEach(h => rows.push(['Habit', h.name, `${h.completedDates.length} completions`, h.createdAt]));
    exportToCSV(headers, rows, `focusflow-data-${format(new Date(), 'yyyy-MM-dd')}`);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          storage.importAll(data);
          window.location.reload();
        } catch { alert('Invalid file format'); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    storage.clear();
    window.location.reload();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-text">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">Customize your study experience</p>
      </div>

      {/* Appearance */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Palette size={18} className="text-primary" />
          <h2 className="text-base font-semibold text-text">Appearance</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Accent Color</label>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_COLORS.slice(0, 10).map(color => (
                <button
                  key={color}
                  onClick={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { accentColor: color } })}
                  className={cn(
                    'w-8 h-8 rounded-lg transition-all',
                    settings.accentColor === color && 'ring-2 ring-offset-2 ring-offset-bg-card scale-110'
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Theme</label>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary text-primary text-sm font-medium">
                <Moon size={16} /> Dark
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-white/[0.06] text-text-secondary text-sm font-medium" disabled>
                <Sun size={16} /> Light (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Timer Preferences */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Timer size={18} className="text-accent" />
          <h2 className="text-base font-semibold text-text">Timer Preferences</h2>
        </div>
        <div className="space-y-4">
          <Select
            label="Default Preset"
            value={settings.pomodoro.preset}
            onChange={(e) => handlePresetChange(e.target.value)}
            options={[
              { value: '25/5', label: '25/5 (Pomodoro)' },
              { value: '50/10', label: '50/10 (Deep Work)' },
              { value: '90/20', label: '90/20 (Marathon)' },
              { value: 'custom', label: 'Custom' },
            ]}
          />
          {settings.pomodoro.preset === 'custom' && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Focus (min)</label>
                <input type="number" value={settings.pomodoro.focusMinutes} min={1} max={180}
                  onChange={e => dispatch({ type: 'UPDATE_SETTINGS', payload: { pomodoro: { ...settings.pomodoro, focusMinutes: Number(e.target.value) } } })}
                  className="w-full h-10 px-3 bg-card border border-white/[0.06] rounded-xl text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/[0.3]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Short Break</label>
                <input type="number" value={settings.pomodoro.shortBreakMinutes} min={1} max={60}
                  onChange={e => dispatch({ type: 'UPDATE_SETTINGS', payload: { pomodoro: { ...settings.pomodoro, shortBreakMinutes: Number(e.target.value) } } })}
                  className="w-full h-10 px-3 bg-card border border-white/[0.06] rounded-xl text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/[0.3]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Long Break</label>
                <input type="number" value={settings.pomodoro.longBreakMinutes} min={1} max={60}
                  onChange={e => dispatch({ type: 'UPDATE_SETTINGS', payload: { pomodoro: { ...settings.pomodoro, longBreakMinutes: Number(e.target.value) } } })}
                  className="w-full h-10 px-3 bg-card border border-white/[0.06] rounded-xl text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/[0.3]" />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Auto start breaks</span>
            <input type="checkbox" checked={settings.pomodoro.autoBreak}
              onChange={e => dispatch({ type: 'UPDATE_SETTINGS', payload: { pomodoro: { ...settings.pomodoro, autoBreak: e.target.checked } } })}
              className="w-4 h-4 rounded border-white/[0.06] bg-card text-primary focus:ring-primary/[0.3]" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Auto start focus sessions</span>
            <input type="checkbox" checked={settings.pomodoro.autoFocus}
              onChange={e => dispatch({ type: 'UPDATE_SETTINGS', payload: { pomodoro: { ...settings.pomodoro, autoFocus: e.target.checked } } })}
              className="w-4 h-4 rounded border-white/[0.06] bg-card text-primary focus:ring-primary/[0.3]" />
          </div>
        </div>
      </Card>

      {/* Notifications & Sound */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Bell size={18} className="text-success" />
          <h2 className="text-base font-semibold text-text">Notifications & Sound</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Enable notifications</span>
            <input type="checkbox" checked={settings.notifications}
              onChange={e => dispatch({ type: 'UPDATE_SETTINGS', payload: { notifications: e.target.checked } })}
              className="w-4 h-4 rounded border-white/[0.06] bg-card text-primary focus:ring-primary/[0.3]" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Timer sounds</span>
            <input type="checkbox" checked={settings.sound}
              onChange={e => dispatch({ type: 'UPDATE_SETTINGS', payload: { sound: e.target.checked } })}
              className="w-4 h-4 rounded border-white/[0.06] bg-card text-primary focus:ring-primary/[0.3]" />
          </div>
        </div>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Keyboard size={18} className="text-warning" />
          <h2 className="text-base font-semibold text-text">Keyboard Shortcuts</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { keys: 'Space', action: 'Pause/Resume timer' },
            { keys: 'N', action: 'New note' },
            { keys: 'T', action: 'New task' },
            { keys: 'F', action: 'Toggle focus mode' },
            { keys: 'Ctrl + K', action: 'Command palette' },
            { keys: 'Esc', action: 'Exit focus / close modal' },
          ].map(shortcut => (
            <div key={shortcut.keys} className="flex items-center justify-between py-2 px-3 rounded-lg bg-card">
              <span className="text-sm text-text-secondary">{shortcut.action}</span>
              <kbd className="px-2 py-0.5 rounded bg-card text-xs text-text-tertiary border border-white/[0.06]">{shortcut.keys}</kbd>
            </div>
          ))}
        </div>
      </Card>

      {/* Data Management */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Download size={18} className="text-primary" />
          <h2 className="text-base font-semibold text-text">Data Management</h2>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={handleExportJSON}>
              <Download size={16} /> Export JSON
            </Button>
            <Button variant="secondary" onClick={handleExportCSV}>
              <Download size={16} /> Export CSV
            </Button>
          </div>
          <Button variant="secondary" onClick={handleImport} className="w-full">
            <Upload size={16} /> Import Data (JSON)
          </Button>
          <Button variant="danger" onClick={() => setShowResetConfirm(true)} className="w-full">
            <Trash2 size={16} /> Reset All Data
          </Button>
        </div>
      </Card>

      {/* Reset Confirmation */}
      {showResetConfirm && (
        <Card className="border-danger/30 bg-danger/5">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-danger shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-danger mb-1">Are you sure?</h3>
              <p className="text-sm text-text-secondary mb-3">This will permanently delete all your data including tasks, notes, habits, and settings.</p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setShowResetConfirm(false)}>Cancel</Button>
                <Button variant="danger" size="sm" onClick={handleReset}>Delete Everything</Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* App info */}
      <div className="text-center py-4">
        <p className="text-xs text-text-muted">FocusFlow v1.0.0 — Built with care for focused students</p>
      </div>
    </div>
  );
}
