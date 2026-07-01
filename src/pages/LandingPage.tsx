import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, Timer, Target, BarChart3, Calendar, StickyNote,
  Zap, ArrowRight, Star, Sparkles,
} from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '@/constants';
import { useState } from 'react';

const features = [
  { icon: Timer, title: 'Pomodoro Timer', description: 'Focus sessions with auto-breaks, fullscreen mode, and ambient sounds.' },
  { icon: Target, title: 'Study Planner', description: 'Organize subjects, set goals, track topics, and manage deadlines.' },
  { icon: StickyNote, title: 'Smart Notes', description: 'Rich markdown editor with folders, tags, code blocks, and pinning.' },
  { icon: BarChart3, title: 'Analytics', description: 'Beautiful charts showing daily, weekly, and monthly study patterns.' },
  { icon: Calendar, title: 'Calendar', description: 'Visual calendar with color-coded events, exams, and assignments.' },
  { icon: Brain, title: 'Habit Tracker', description: 'Build consistent study habits with streaks and completion tracking.' },
];

const stats = [
  { value: '10K+', label: 'Students' },
  { value: '500K+', label: 'Focus Hours' },
  { value: '98%', label: 'Satisfaction' },
  { value: '4.9', label: 'Rating' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Medical Student', text: 'FocusFlow transformed how I study. The Pomodoro timer and analytics help me stay on track.' },
  { name: 'Marcus Williams', role: 'CS Major', text: 'The command palette and keyboard shortcuts make this feel like a pro tool. Love it.' },
  { name: 'Aisha Patel', role: 'Law Student', text: 'Finally, a study app that looks premium and actually works. The habit tracker is a game-changer.' },
];

export default function LandingPage() {
  const dayIndex = new Date().getDate() % MOTIVATIONAL_QUOTES.length;
  const [quote] = useState(MOTIVATIONAL_QUOTES[dayIndex]);

  return (
    <div className="min-h-screen bg-bg relative overflow-hidden">
      {/* Aurora background */}
      <div className="aurora-bg" />

      {/* Floating orbs — decorative */}
      <div className="orb orb-teal w-[600px] h-[600px] -top-60 -left-60 animate-aurora-drift" />
      <div className="orb orb-pink w-[500px] h-[500px] top-1/3 -right-40 animate-aurora-drift-2" />
      <div className="orb orb-purple w-[400px] h-[400px] -bottom-40 left-1/3 animate-aurora-drift-3" />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
              <Brain size={18} className="text-bg" />
            </div>
            <span className="text-lg font-display font-bold text-text">FocusFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text transition-colors">
              Log in
            </Link>
            <Link to="/register" className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-primary to-accent text-bg rounded-xl transition-all shadow-glow hover:shadow-aurora-strong">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 overflow-hidden relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light border border-primary/[0.12] text-primary text-sm font-medium mb-8">
              <Sparkles size={14} />
              Your focused study companion
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-text leading-tight mb-6"
          >
            Study with
            <span className="gradient-text"> zero </span>
            distractions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            A premium, distraction-free study dashboard built for focused students.
            Track your progress, build habits, and achieve your academic goals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link
              to="/register"
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary to-accent text-bg rounded-xl font-semibold transition-all shadow-glow hover:shadow-aurora-strong text-base"
            >
              Start Studying Free
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-8 py-3.5 glass-card text-text-secondary hover:text-text rounded-xl font-medium transition-all text-base"
            >
              View Dashboard
            </Link>
          </motion.div>

          {/* Daily quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-lg mx-auto"
          >
            <div className="p-5 rounded-2xl glass-card">
              <p className="text-text-secondary italic text-sm">"{quote.text}"</p>
              <p className="text-text-tertiary text-xs mt-2">— {quote.author}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 border-y border-white/[0.04] relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-display font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-text-tertiary">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mb-4">Everything you need to focus</h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Powerful features designed to help you study smarter, not harder.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl glass-card transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/[0.1] flex items-center justify-center mb-4 group-hover:bg-primary/[0.15] transition-colors">
                  <feature.icon size={22} className="text-primary" />
                </div>
                <h3 className="text-base font-semibold text-text mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl glass-card p-1"
          >
            <div className="rounded-xl bg-white/[0.02] aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                  <BarChart3 size={28} className="text-primary" />
                </div>
                <p className="text-sm text-text-tertiary">Dashboard Preview</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 border-t border-white/[0.04] relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-text mb-4">Loved by students worldwide</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-6 rounded-2xl glass-card"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={14} className="fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-bg text-xs font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">{t.name}</p>
                    <p className="text-xs text-text-tertiary">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 sm:p-14 rounded-3xl glass-card relative overflow-hidden"
          >
            {/* Glow effect behind CTA */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-accent/[0.05]" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mb-4">Ready to study smarter?</h2>
              <p className="text-text-secondary mb-8 max-w-lg mx-auto">
                Join thousands of students who use FocusFlow to stay focused and achieve their goals.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary to-accent text-bg rounded-xl font-semibold transition-all shadow-glow hover:shadow-aurora-strong"
              >
                Get Started — It's Free
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 border-t border-white/[0.04] relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Brain size={14} className="text-bg" />
            </div>
            <span className="text-sm font-display font-semibold text-text">FocusFlow</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-text-tertiary hover:text-text-secondary transition-colors">Privacy</a>
            <a href="#" className="text-sm text-text-tertiary hover:text-text-secondary transition-colors">Terms</a>
            <a href="#" className="text-sm text-text-tertiary hover:text-text-secondary transition-colors">Contact</a>
          </div>
          <p className="text-xs text-text-muted">Made with focus in mind.</p>
        </div>
      </footer>
    </div>
  );
}
