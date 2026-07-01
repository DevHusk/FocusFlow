import { motion } from 'framer-motion';
import { Camera, Save, User, Mail, BookOpen, Target } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';

export default function ProfilePage() {
  const { state } = useApp();
  const { user } = state;

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold text-text mb-6 text-center">Your Profile</h1>

        <Card className="p-6">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.[0] ?? 'S'}
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text transition-colors">
                <Camera size={14} />
              </button>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text">{user?.name}</h2>
              <p className="text-sm text-text-secondary">{user?.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="p-3 rounded-xl bg-bg-elevated border border-border text-center">
              <p className="text-xl font-bold text-primary">{user?.level ?? 1}</p>
              <p className="text-xs text-text-tertiary">Level</p>
            </div>
            <div className="p-3 rounded-xl bg-bg-elevated border border-border text-center">
              <p className="text-xl font-bold text-accent">{user?.xp ?? 0}</p>
              <p className="text-xs text-text-tertiary">XP</p>
            </div>
            <div className="p-3 rounded-xl bg-bg-elevated border border-border text-center">
              <p className="text-xl font-bold text-success">{user?.streak ?? 0}</p>
              <p className="text-xs text-text-tertiary">Streak</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  defaultValue={user?.name}
                  className="w-full h-11 pl-10 pr-4 bg-bg-elevated border border-border rounded-xl text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  defaultValue={user?.email}
                  className="w-full h-11 pl-10 pr-4 bg-bg-elevated border border-border rounded-xl text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Focus Goal (hrs/day)</label>
                <div className="relative">
                  <Target size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  <input
                    type="number"
                    defaultValue={4}
                    className="w-full h-11 pl-10 pr-4 bg-bg-elevated border border-border rounded-xl text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Study Streak Goal</label>
                <div className="relative">
                  <BookOpen size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  <input
                    type="number"
                    defaultValue={30}
                    className="w-full h-11 pl-10 pr-4 bg-bg-elevated border border-border rounded-xl text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <button className="w-full h-11 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-glow">
              <Save size={16} />
              Save Changes
            </button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
