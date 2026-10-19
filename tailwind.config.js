/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
        jp: ['var(--font-noto-jp)', 'Hiragino Sans', 'Yu Gothic', 'sans-serif'],
        dot: ['var(--font-dot)', 'var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        'wf-out': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'wf-arrive': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      colors: {
        // Wayfinding palette (light only). Values live as CSS variables in globals.css.
        wf: {
          bg: 'var(--wf-bg)',
          sheet: 'var(--wf-sheet)',
          ink: 'var(--wf-ink)',
          muted: 'var(--wf-muted)',
          line: 'var(--wf-line)',
          sea: 'var(--wf-sea)',
          tyo: 'var(--wf-tyo)',
          exit: 'var(--wf-exit)',
          'led-bg': 'var(--wf-led-bg)',
          led: 'var(--wf-led)',
          'xfer-bg': 'var(--wf-xfer-bg)',
          'xfer-ink': 'var(--wf-xfer-ink)',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
} 