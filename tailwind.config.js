/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        body: ['Source Sans 3', 'system-ui', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            fontFamily: 'Source Sans 3, system-ui, sans-serif',
            a: {
              color: '#3b82f6',
              '&:hover': {
                color: '#2563eb',
              },
            },
            'h1, h2, h3, h4, h5, h6': {
              color: 'inherit',
              marginTop: '0.5em',
              marginBottom: '0.1em',
              fontFamily: 'Montserrat, system-ui, sans-serif',
            },
            h2: {
              marginTop: '0.5em',
              marginBottom: '0.1em',
              '@screen sm': {
                marginTop: '1.0666667em',
                marginBottom: '0.0666667em',
              },
              '@screen lg': {
                marginTop: '1.0666667em',
                marginBottom: '0.0666667em',
              },
            },
            blockquote: {
              borderLeftColor: '#e5e7eb',
              color: 'inherit',
            },
            hr: {
              borderColor: '#e5e7eb',
            },
            'ol > li::before': {
              color: 'inherit',
            },
            'ul > li::before': {
              backgroundColor: 'currentColor',
            },
            code: {
              color: 'inherit',
              backgroundColor: 'rgba(107, 114, 128, 0.1)',
              borderRadius: '0.25rem',
              padding: '0.25rem',
            },
            pre: {
              backgroundColor: '#1f2937',
              color: '#e5e7eb',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};