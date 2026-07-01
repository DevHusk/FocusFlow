import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FocusMode from '@/components/layout/FocusMode';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useApp } from '@/context/AppContext';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

// Lazy-loaded pages for code splitting
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const OTPPage = lazy(() => import('@/pages/auth/OTPPage'));
const ProfilePage = lazy(() => import('@/pages/auth/ProfilePage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const PomodoroPage = lazy(() => import('@/pages/PomodoroPage'));
const StudyPlannerPage = lazy(() => import('@/pages/StudyPlannerPage'));
const TasksPage = lazy(() => import('@/pages/TasksPage'));
const NotesPage = lazy(() => import('@/pages/NotesPage'));
const HabitsPage = lazy(() => import('@/pages/HabitsPage'));
const GoalsPage = lazy(() => import('@/pages/GoalsPage'));
const CalendarPage = lazy(() => import('@/pages/CalendarPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));
const ResourcesPage = lazy(() => import('@/pages/ResourcesPage'));
const QuotesPage = lazy(() => import('@/pages/QuotesPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

export default function App() {
  const { dispatch } = useApp();

  useKeyboardShortcuts({
    onPauseTimer: () => {},
    onNewNote: () => {},
    onNewTask: () => {},
    onFocusMode: () => dispatch({ type: 'SET_FOCUS_MODE', payload: true }),
    onExitFocus: () => dispatch({ type: 'SET_FOCUS_MODE', payload: false }),
  });

  return (
    <>
      <FocusMode />
      <Suspense fallback={<LoadingSkeleton fullPage />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Dashboard routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/pomodoro" element={<PomodoroPage />} />
            <Route path="/planner" element={<StudyPlannerPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/habits" element={<HabitsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/quotes" element={<QuotesPage />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
