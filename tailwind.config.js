/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Glass Aurora — deep space backgrounds
        bg: {
          DEFAULT: '#06080F',
          card: 'rgba(12, 16, 28, 0.7)',
          solid: '#0C101C',
          elevated: 'rgba(18, 24, 42, 0.6)',
          hover: 'rgba(24, 32, 55, 0.7)',
        },
        // Aurora teal/cyan — primary glow
        primary: {
          DEFAULT: '#00E5C7',
          hover: '#2EFDDB',
          deep: '#00B89E',
          light: 'rgba(0, 229, 199, 0.12)',
        },
        // Aurora pink/magenta — accent
        accent: {
          DEFAULT: '#D946EF',
          hover: '#E471F3',
          deep: '#C026D3',
          light: 'rgba(217, 70, 239, 0.12)',
        },
        // Aurora purple — secondary accent
        aurora: {
          purple: '#8B5CF6',
          blue: '#3B82F6',
          rose: '#F43F5E',
        },
        success: {
          DEFAULT: '#34D399',
          light: 'rgba(52, 211, 153, 0.12)',
        },
        warning: {
          DEFAULT: '#FBBF24',
          light: 'rgba(251, 191, 36, 0.12)',
        },
        danger: {
          DEFAULT: '#FB7185',
          light: 'rgba(251, 113, 133, 0.12)',
        },
        text: {
          DEFAULT: '#F0F2F8',
          secondary: '#8B92A8',
          tertiary: '#5C6378',
          muted: '#3D4255',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.06)',
          glow: 'rgba(0, 229, 199, 0.15)',
          hover: 'rgba(255, 255, 255, 0.12)',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'aurora': '0 0 40px rgba(0, 229, 199, 0.08), 0 0 80px rgba(217, 70, 239, 0.05)',
        'aurora-strong': '0 0 40px rgba(0, 229, 199, 0.15), 0 0 80px rgba(217, 70, 239, 0.1)',
        'glow': '0 0 20px rgba(0, 229, 199, 0.2)',
        'glow-accent': '0 0 20px rgba(217, 70, 239, 0.2)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 255, 255, 0.05)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.5), 0 0 1px rgba(0, 229, 199, 0.1)',
        'modal': '0 24px 64px rgba(0, 0, 0, 0.6)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'aurora-drift': 'auroraDrift 20s ease-in-out infinite',
        'aurora-drift-2': 'auroraDrift2 25s ease-in-out infinite',
        'aurora-drift-3': 'auroraDrift3 22s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        auroraDrift: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)' },
          '25%': { transform: 'translate(5%, -3%) scale(1.05)' },
          '50%': { transform: 'translate(-3%, 5%) scale(0.95)' },
          '75%': { transform: 'translate(3%, 2%) scale(1.02)' },
        },
        auroraDrift2: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)' },
          '33%': { transform: 'translate(-4%, 4%) scale(1.08)' },
          '66%': { transform: 'translate(4%, -2%) scale(0.92)' },
        },
        auroraDrift3: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)' },
          '50%': { transform: 'translate(3%, -4%) scale(1.06)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '20px',
        'heavy': '40px',
      },
    },
  },
  plugins: [],
}
