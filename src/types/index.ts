// ─── User & Auth ────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
  level: number;
  xp: number;
  streak: number;
}

// ─── Pomodoro ───────────────────────────────────────────────────
export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export type PomodoroPreset = '25/5' | '50/10' | '90/20' | 'custom';

export interface PomodoroSettings {
  preset: PomodoroPreset;
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  autoBreak: boolean;
  autoFocus: boolean;
  tickingSound: boolean;
}

export interface PomodoroSession {
  id: string;
  startedAt: string;
  endedAt?: string;
  duration: number; // in seconds
  mode: TimerMode;
  completed: boolean;
  subjectId?: string;
}

// ─── Subjects ───────────────────────────────────────────────────
export interface Subject {
  id: string;
  name: string;
  color: string;
  priority: 'low' | 'medium' | 'high';
  targetHours: number;
  completedHours: number;
  topics: Topic[];
  deadlines: Deadline[];
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  name: string;
  completed: boolean;
  subjectId: string;
}

export interface Deadline {
  id: string;
  title: string;
  date: string;
  subjectId: string;
  type: 'exam' | 'assignment' | 'project' | 'other';
  completed: boolean;
}

// ─── Tasks ──────────────────────────────────────────────────────
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate?: string;
  subjectId?: string;
  category?: string;
  reminder?: string;
  createdAt: string;
  updatedAt: string;
  order: number;
}

// ─── Notes ──────────────────────────────────────────────────────
export interface Note {
  id: string;
  title: string;
  content: string;
  folderId?: string;
  tags: string[];
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  order: number;
}

export interface NoteFolder {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
}

// ─── Habits ─────────────────────────────────────────────────────
export interface Habit {
  id: string;
  name: string;
  color: string;
  icon?: string;
  frequency: 'daily' | 'weekly';
  completedDates: string[];
  createdAt: string;
}

// ─── Goals ──────────────────────────────────────────────────────
export type GoalType = 'daily' | 'weekly' | 'monthly' | 'long-term';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  unit: string;
  milestones: Milestone[];
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

// ─── Calendar ───────────────────────────────────────────────────
export type EventType = 'exam' | 'assignment' | 'study' | 'event' | 'deadline';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  endTime?: string;
  type: EventType;
  color: string;
  subjectId?: string;
  description?: string;
  allDay?: boolean;
}

// ─── Resources ──────────────────────────────────────────────────
export type ResourceType = 'pdf' | 'youtube' | 'website' | 'note' | 'book';

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url?: string;
  content?: string;
  category: string;
  subjectId?: string;
  favorite: boolean;
  tags: string[];
  createdAt: string;
}

// ─── Quotes ─────────────────────────────────────────────────────
export interface Quote {
  id: string;
  text: string;
  author: string;
  favorite: boolean;
}

// ─── Settings ───────────────────────────────────────────────────
export type Theme = 'dark' | 'light';

export interface Settings {
  theme: Theme;
  accentColor: string;
  pomodoro: PomodoroSettings;
  notifications: boolean;
  sound: boolean;
  volume: number;
}

// ─── Analytics ──────────────────────────────────────────────────
export interface DailyStudyData {
  date: string;
  minutes: number;
  sessions: number;
  focusScore: number;
}

export interface WeeklyStudyData {
  week: string;
  totalMinutes: number;
  averageFocus: number;
  tasksCompleted: number;
}

export interface StudyHeatmapData {
  date: string;
  count: number;
  level: number;
}

// ─── Achievements & XP ─────────────────────────────────────────
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  requirement: number;
  current: number;
}

export interface XPAction {
  type: string;
  xp: number;
  timestamp: string;
}

// ─── Music ──────────────────────────────────────────────────────
export type AmbientSound = 'rain' | 'forest' | 'cafe' | 'brown-noise' | 'white-noise' | 'nature';

export interface MusicSettings {
  sound: AmbientSound | null;
  volume: number;
  loop: boolean;
  playing: boolean;
}

// ─── Command Palette ────────────────────────────────────────────
export interface CommandAction {
  id: string;
  label: string;
  shortcut?: string;
  category: string;
  action: () => void;
  icon?: string;
}
