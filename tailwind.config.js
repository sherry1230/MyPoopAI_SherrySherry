/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      sm: '600px',   // tablet
      md: '1024px',  // desktop
      lg: '1440px',  // wide
    },
    extend: {
      colors: {
        bg: { base: '#F4F0E6', card: '#E9E3D4' },
        line: '#D6CFBF',
        ink: { DEFAULT: '#3B362F', soft: '#6E655A', mute: '#A79E8F', head: '#221F1A' },
        star: '#E3C87E',
        badge: '#C9A227',
        good: '#7C7B45',
        caution: '#C1704A',
        warn: '#8C4A3C',
        adult: '#7590A2',
        baby: '#BE8A8A',
        link: '#576F82',
        focus: '#9D7F9B',
      },
      borderRadius: { chip: '8px', card: '12px', modal: '16px', pill: '999px' },
      maxWidth: { tablet: '720px', desktop: '1080px', wide: '1200px' },
      fontFamily: {
        sans: ['Pretendard', 'Noto Sans KR', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
