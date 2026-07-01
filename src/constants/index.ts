export const COLORS = {
  primary: '#00E5C7',
  accent: '#D946EF',
  auroraPurple: '#8B5CF6',
  auroraBlue: '#3B82F6',
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#FB7185',
  bg: '#06080F',
  card: '#0C101C',
} as const;

export const SUBJECT_COLORS = [
  '#00E5C7', '#D946EF', '#8B5CF6', '#3B82F6', '#F43F5E',
  '#34D399', '#FBBF24', '#FB923C', '#38BDF8', '#A78BFA',
  '#F472B6', '#2DD4BF', '#818CF8', '#FB7185', '#FCD34D',
] as const;

export const POMODORO_PRESETS = {
  '25/5': { focus: 25, shortBreak: 5, longBreak: 20 },
  '50/10': { focus: 50, shortBreak: 10, longBreak: 30 },
  '90/20': { focus: 90, shortBreak: 20, longBreak: 40 },
  custom: { focus: 25, shortBreak: 5, longBreak: 20 },
} as const;

export const TASK_CATEGORIES = [
  'Study', 'Assignment', 'Project', 'Review', 'Practice', 'Reading', 'Other',
] as const;

export const MOTIVATIONAL_QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It is not enough to be busy. The question is: what are we busy about?", author: "Henry David Thoreau" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "What we learn with pleasure we never forget.", author: "Alfred Mercier" },
  { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.", author: "Richard Feynman" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "I have no special talents. I am only passionately curious.", author: "Albert Einstein" },
  { text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.", author: "Abigail Adams" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
] as const;

export const AMBIENT_SOUNDS = [
  { id: 'rain', label: 'Rain', icon: 'CloudRain' },
  { id: 'forest', label: 'Forest', icon: 'Trees' },
  { id: 'cafe', label: 'Café', icon: 'Coffee' },
  { id: 'brown-noise', label: 'Brown Noise', icon: 'Volume2' },
  { id: 'white-noise', label: 'White Noise', icon: 'Radio' },
  { id: 'nature', label: 'Nature', icon: 'Leaf' },
] as const;

export const DEFAULT_SETTINGS = {
  theme: 'dark' as const,
  accentColor: '#00E5C7',
  pomodoro: {
    preset: '25/5' as const,
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 20,
    autoBreak: true,
    autoFocus: false,
    tickingSound: false,
  },
  notifications: true,
  sound: true,
  volume: 0.5,
};

export const XP_VALUES = {
  completeTask: 10,
  completePomodoro: 15,
  completeHabit: 5,
  studyHour: 20,
  completeGoal: 25,
  streakBonus: 5,
} as const;

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000,
  7000, 9500, 12500, 16000, 20000,
] as const;

export const KEYBOARD_SHORTCUTS = {
  pauseTimer: ' ',
  newNote: 'n',
  newTask: 't',
  focusMode: 'f',
  exitFocus: 'Escape',
  commandPalette: 'k',
  search: '/',
} as const;
