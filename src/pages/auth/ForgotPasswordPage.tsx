import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 relative overflow-hidden">
      <div className="aurora-bg" />
      <div className="orb orb-teal w-[400px] h-[400px] -top-32 left-1/4 animate-aurora-drift" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
            <Brain size={22} className="text-bg" />
          </div>
          <span className="text-xl font-display font-bold text-text">FocusFlow</span>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <h1 className="text-2xl font-display font-bold text-text mb-2 text-center">Reset password</h1>
          <p className="text-sm text-text-secondary text-center mb-8">
            Enter your email and we'll send you a link to reset your password
          </p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-11 pl-10 pr-4 glass-light rounded-xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/[0.15] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:shadow-aurora-strong text-bg rounded-xl font-semibold text-sm transition-all"
            >
              Send Reset Link
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text transition-colors">
              <ArrowLeft size={14} />
              Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
