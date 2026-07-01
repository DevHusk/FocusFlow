import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useState, useRef } from 'react';

export default function OTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Brain size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold text-text">FocusFlow</span>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-8">
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={24} className="text-success" />
          </div>
          <h1 className="text-2xl font-bold text-text mb-2 text-center">Verify your email</h1>
          <p className="text-sm text-text-secondary text-center mb-8">
            We've sent a 6-digit code to your email address
          </p>

          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-bold bg-bg-elevated border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            ))}
          </div>

          <Link to="/dashboard">
            <button className="w-full h-11 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium text-sm transition-all shadow-glow">
              Verify
            </button>
          </Link>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Didn't receive the code?{' '}
              <button className="text-primary hover:text-primary-hover font-medium transition-colors">
                Resend
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
