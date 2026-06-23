/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-light': 'var(--primary-light)',
        secondary: 'var(--accent)',
        dark: 'var(--bg-main)',
        glass: 'rgba(255, 255, 255, 0.03)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '24px',
        '3xl': '40px',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'glow-pulse': 'subtlePulse 3s ease-in-out infinite',
        'border-glow': 'borderGlow 3s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
      keyframes: {
        subtlePulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 168, 132, 0.1)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 168, 132, 0.2)' },
        },
        borderGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'glow-sm': '0 0 15px rgba(0, 168, 132, 0.15)',
        'glow-md': '0 0 30px rgba(0, 168, 132, 0.2)',
        'glow-lg': '0 0 60px rgba(0, 168, 132, 0.25)',
      },
    },
  },
  plugins: [],
};
