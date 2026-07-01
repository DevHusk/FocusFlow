# FocusFlow — Study Dashboard

A premium, distraction-free study dashboard built for focused students. Track your progress, build habits, and achieve your academic goals with a clean, modern interface.

## Features

- **Pomodoro Timer** — 25/5, 50/10, 90/20 presets, custom mode, auto-break, auto-focus
- **Study Planner** — Subjects with colors, priorities, topics, deadlines, and progress tracking
- **Smart Notes** — Markdown editor, folders, tags, pinned notes, code blocks
- **Task Manager** — Create, edit, delete, filter, sort, priority, categories, due dates
- **Habit Tracker** — Daily habits, 30-day heatmaps, streak tracking, weekly charts
- **Goal Tracker** — Daily/weekly/monthly/long-term goals with milestones and progress bars
- **Calendar** — Month view, agenda view, color-coded events, exam countdown
- **Analytics** — Daily/weekly/monthly charts, subject distribution, study heatmap, streak charts
- **Resources** — Store PDFs, YouTube links, websites, books with favorites
- **Quotes** — 25+ motivational quotes, daily rotation, favorites
- **Focus Music** — Rain, forest, cafe, brown/white noise, nature sounds
- **Command Palette** — Ctrl+K for global search and navigation
- **Focus Mode** — One-click distraction-free mode
- **XP & Levels** — Gamified learning with experience points and level progression
- **Keyboard Shortcuts** — Space (pause), N (note), T (task), F (focus), Esc (exit)

## Tech Stack

- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- React Router (routing)
- TanStack React Query (data fetching)
- Recharts (charts)
- Lucide React (icons)
- Zod (validation)
- React Hook Form (forms)

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/focusflow.git
cd focusflow

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
focusflow/
├── public/
│   ├── vite.svg
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI: Button, Card, Modal, Input, etc.
│   │   ├── layout/          # Sidebar, DashboardLayout, FocusMode
│   │   └── command-palette/ # Command palette (Ctrl+K)
│   ├── pages/               # All page components
│   │   ├── auth/            # Login, Register, OTP, Forgot Password, Profile
│   │   ├── LandingPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── PomodoroPage.tsx
│   │   ├── StudyPlannerPage.tsx
│   │   ├── TasksPage.tsx
│   │   ├── NotesPage.tsx
│   │   ├── HabitsPage.tsx
│   │   ├── GoalsPage.tsx
│   │   ├── CalendarPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   ├── ResourcesPage.tsx
│   │   ├── QuotesPage.tsx
│   │   ├── MusicPage.tsx
│   │   └── SettingsPage.tsx
│   ├── hooks/               # usePomodoro, useKeyboardShortcuts
│   ├── context/             # AppContext (global state)
│   ├── services/            # Storage abstraction layer
│   ├── types/               # TypeScript type definitions
│   ├── constants/           # Colors, quotes, presets, shortcuts
│   ├── utils/               # Helpers, formatting, calculations
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Architecture

The app uses a **service abstraction pattern** for data persistence. Currently backed by localStorage, but the architecture allows swapping to Supabase/Firebase with minimal changes:

```
Context (AppContext) → Service (storage.ts) → Backend (localStorage / Supabase / Firebase)
```

To migrate to a cloud backend:

1. Create a new service file (e.g., `services/supabase.ts`)
2. Implement the same `get`, `set`, `remove`, `exportAll`, `importAll` interface
3. Swap the import in `AppContext.tsx`

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Pause/Resume timer |
| `N` | New note |
| `T` | New task |
| `F` | Toggle focus mode |
| `Ctrl+K` | Command palette |
| `Esc` | Exit focus / close modal |

## Deployment

### Vercel

```bash
npm i -g vercel
vercel
```

Or connect your GitHub repository at [vercel.com/new](https://vercel.com/new).

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod
```

Or drag-and-drop the `dist/` folder at [app.netlify.com/drop](https://app.netlify.com/drop).

### GitHub Pages

```bash
# In vite.config.ts, add: base: '/focusflow/'
npm run build
# Deploy dist/ to gh-pages branch
```

## Configuration

### Tailwind Theme

Edit `tailwind.config.js` to customize colors, fonts, shadows, and animations.

### Pomodoro Presets

Edit `src/constants/index.ts` to change default timer presets.

### Motivational Quotes

Add or modify quotes in `src/constants/index.ts` under `MOTIVATIONAL_QUOTES`.

## Future Enhancements

- Backend integration (Supabase/Firebase)
- User authentication with JWT
- Real-time sync across devices
- Push notifications for Pomodoro breaks
- AI-powered study recommendations
- Team/study group features
- Spaced repetition for notes
- Dark/Light theme toggle
- Mobile app (React Native)

## License

MIT

---

Built with care for focused students.
