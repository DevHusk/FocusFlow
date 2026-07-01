import React, { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react';
import { storage } from '@/services/storage';
import { DEFAULT_SETTINGS } from '@/constants';
import {
  type User, type Subject, type Task, type Note, type NoteFolder,
  type Habit, type Goal, type CalendarEvent, type Resource,
  type PomodoroSession, type Settings, type Quote,
  type DailyStudyData,
} from '@/types';
import { generateId, getLevelFromXP } from '@/utils';
import { MOTIVATIONAL_QUOTES } from '@/constants';

// ─── State Shape ───────────────────────────────────────────────
interface AppState {
  user: User | null;
  settings: Settings;
  subjects: Subject[];
  tasks: Task[];
  notes: Note[];
  noteFolders: NoteFolder[];
  habits: Habit[];
  goals: Goal[];
  calendarEvents: CalendarEvent[];
  resources: Resource[];
  pomodoroSessions: PomodoroSession[];
  dailyStudy: DailyStudyData[];
  favoriteQuotes: string[];
  sidebarOpen: boolean;
  focusMode: boolean;
  commandPaletteOpen: boolean;
}

type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_FOCUS_MODE'; payload: boolean }
  | { type: 'TOGGLE_COMMAND_PALETTE' }
  | { type: 'ADD_SUBJECT'; payload: Subject }
  | { type: 'UPDATE_SUBJECT'; payload: Subject }
  | { type: 'DELETE_SUBJECT'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'REORDER_TASKS'; payload: Task[] }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'ADD_NOTE_FOLDER'; payload: NoteFolder }
  | { type: 'DELETE_NOTE_FOLDER'; payload: string }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'UPDATE_HABIT'; payload: Habit }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'ADD_CALENDAR_EVENT'; payload: CalendarEvent }
  | { type: 'UPDATE_CALENDAR_EVENT'; payload: CalendarEvent }
  | { type: 'DELETE_CALENDAR_EVENT'; payload: string }
  | { type: 'ADD_RESOURCE'; payload: Resource }
  | { type: 'UPDATE_RESOURCE'; payload: Resource }
  | { type: 'DELETE_RESOURCE'; payload: string }
  | { type: 'ADD_POMODORO_SESSION'; payload: PomodoroSession }
  | { type: 'ADD_STUDY_TIME'; payload: { date: string; minutes: number } }
  | { type: 'TOGGLE_FAVORITE_QUOTE'; payload: string }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

const defaultUser: User = {
  id: 'user-1',
  name: 'Student',
  email: 'student@example.com',
  joinedAt: new Date().toISOString(),
  level: 1,
  xp: 0,
  streak: 0,
};

const initialState: AppState = {
  user: defaultUser,
  settings: DEFAULT_SETTINGS,
  subjects: [],
  tasks: [],
  notes: [],
  noteFolders: [],
  habits: [],
  goals: [],
  calendarEvents: [],
  resources: [],
  pomodoroSessions: [],
  dailyStudy: [],
  favoriteQuotes: [],
  sidebarOpen: true,
  focusMode: false,
  commandPaletteOpen: false,
};

// ─── Reducer ───────────────────────────────────────────────────
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case 'SET_FOCUS_MODE':
      return { ...state, focusMode: action.payload };

    case 'TOGGLE_COMMAND_PALETTE':
      return { ...state, commandPaletteOpen: !state.commandPaletteOpen };

    case 'ADD_SUBJECT':
      return { ...state, subjects: [...state.subjects, action.payload] };

    case 'UPDATE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.map(s => s.id === action.payload.id ? action.payload : s),
      };

    case 'DELETE_SUBJECT':
      return { ...state, subjects: state.subjects.filter(s => s.id !== action.payload) };

    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t),
      };

    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };

    case 'REORDER_TASKS':
      return { ...state, tasks: action.payload };

    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.payload] };

    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(n => n.id === action.payload.id ? action.payload : n),
      };

    case 'DELETE_NOTE':
      return { ...state, notes: state.notes.filter(n => n.id !== action.payload) };

    case 'ADD_NOTE_FOLDER':
      return { ...state, noteFolders: [...state.noteFolders, action.payload] };

    case 'DELETE_NOTE_FOLDER':
      return { ...state, noteFolders: state.noteFolders.filter(f => f.id !== action.payload) };

    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };

    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map(h => h.id === action.payload.id ? action.payload : h),
      };

    case 'DELETE_HABIT':
      return { ...state, habits: state.habits.filter(h => h.id !== action.payload) };

    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };

    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(g => g.id === action.payload.id ? action.payload : g),
      };

    case 'DELETE_GOAL':
      return { ...state, goals: state.goals.filter(g => g.id !== action.payload) };

    case 'ADD_CALENDAR_EVENT':
      return { ...state, calendarEvents: [...state.calendarEvents, action.payload] };

    case 'UPDATE_CALENDAR_EVENT':
      return {
        ...state,
        calendarEvents: state.calendarEvents.map(e => e.id === action.payload.id ? action.payload : e),
      };

    case 'DELETE_CALENDAR_EVENT':
      return { ...state, calendarEvents: state.calendarEvents.filter(e => e.id !== action.payload) };

    case 'ADD_RESOURCE':
      return { ...state, resources: [...state.resources, action.payload] };

    case 'UPDATE_RESOURCE':
      return {
        ...state,
        resources: state.resources.map(r => r.id === action.payload.id ? action.payload : r),
      };

    case 'DELETE_RESOURCE':
      return { ...state, resources: state.resources.filter(r => r.id !== action.payload) };

    case 'ADD_POMODORO_SESSION':
      return { ...state, pomodoroSessions: [...state.pomodoroSessions, action.payload] };

    case 'ADD_STUDY_TIME': {
      const existing = state.dailyStudy.find(d => d.date === action.payload.date);
      if (existing) {
        return {
          ...state,
          dailyStudy: state.dailyStudy.map(d =>
            d.date === action.payload.date
              ? { ...d, minutes: d.minutes + action.payload.minutes }
              : d
          ),
        };
      }
      return {
        ...state,
        dailyStudy: [...state.dailyStudy, {
          date: action.payload.date,
          minutes: action.payload.minutes,
          sessions: 1,
          focusScore: 75,
        }],
      };
    }

    case 'TOGGLE_FAVORITE_QUOTE': {
      const isFav = state.favoriteQuotes.includes(action.payload);
      return {
        ...state,
        favoriteQuotes: isFav
          ? state.favoriteQuotes.filter(id => id !== action.payload)
          : [...state.favoriteQuotes, action.payload],
      };
    }

    case 'ADD_XP': {
      const newXp = (state.user?.xp ?? 0) + action.payload;
      const newLevel = getLevelFromXP(newXp);
      return {
        ...state,
        user: state.user ? { ...state.user, xp: newXp, level: newLevel } : null,
      };
    }

    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────────
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  todayQuote: Quote;
  getSubjectById: (id: string) => Subject | undefined;
  getTodayStudyMinutes: () => number;
  getTodayTasks: () => Task[];
  getUpcomingDeadlines: () => CalendarEvent[];
  getCompletionPercentage: () => number;
  getWeeklyStudyData: () => DailyStudyData[];
}

const AppContext = createContext<AppContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load persisted state on mount
  useEffect(() => {
    const saved = storage.get<Partial<AppState>>('state');
    if (saved) {
      dispatch({ type: 'LOAD_STATE', payload: saved });
    }
  }, []);

  // Persist on state change
  useEffect(() => {
    const toSave = { ...state };
    delete (toSave as Record<string, unknown>).commandPaletteOpen;
    delete (toSave as Record<string, unknown>).sidebarOpen;
    delete (toSave as Record<string, unknown>).focusMode;
    storage.set('state', toSave);
  }, [state]);

  // Daily quote
  const dayIndex = new Date().getDate() % MOTIVATIONAL_QUOTES.length;
  const todayQuote: Quote = {
    id: `quote-${dayIndex}`,
    ...MOTIVATIONAL_QUOTES[dayIndex],
    favorite: state.favoriteQuotes.includes(`quote-${dayIndex}`),
  };

  // Helper: get subject by ID
  const getSubjectById = useCallback((id: string) => {
    return state.subjects.find(s => s.id === id);
  }, [state.subjects]);

  // Helper: today's study minutes
  const getTodayStudyMinutes = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayData = state.dailyStudy.find(d => d.date === today);
    return todayData?.minutes ?? 0;
  }, [state.dailyStudy]);

  // Helper: today's tasks
  const getTodayTasks = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    return state.tasks.filter(t => {
      if (!t.dueDate) return false;
      return t.dueDate.slice(0, 10) === today;
    });
  }, [state.tasks]);

  // Helper: upcoming deadlines
  const getUpcomingDeadlines = useCallback(() => {
    const now = new Date();
    return state.calendarEvents
      .filter(e => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }, [state.calendarEvents]);

  // Helper: completion percentage
  const getCompletionPercentage = useCallback(() => {
    if (state.tasks.length === 0) return 0;
    const completed = state.tasks.filter(t => t.completed).length;
    return Math.round((completed / state.tasks.length) * 100);
  }, [state.tasks]);

  // Helper: weekly study data
  const getWeeklyStudyData = useCallback(() => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return state.dailyStudy.filter(d => new Date(d.date) >= weekAgo);
  }, [state.dailyStudy]);

  const value: AppContextValue = {
    state,
    dispatch,
    todayQuote,
    getSubjectById,
    getTodayStudyMinutes,
    getTodayTasks,
    getUpcomingDeadlines,
    getCompletionPercentage,
    getWeeklyStudyData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─── Hook ──────────────────────────────────────────────────────
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
