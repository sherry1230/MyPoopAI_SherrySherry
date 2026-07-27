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
      /* 실제 HEX는 design/tokens/colors.css 의 CSS 변수가 원본.
         변수 참조라서 [data-theme="dark"] 전환 시 자동으로 다크 값이 적용된다. */
      colors: {
        bg: { base: 'var(--color-bg-base)', card: 'var(--color-bg-card)' },
        line: 'var(--color-border-default)',
        ink: {
          DEFAULT: 'var(--color-text-primary)',
          soft: 'var(--color-text-secondary)',
          mute: 'var(--color-text-placeholder)',
          head: 'var(--color-text-heading)',
        },
        star: 'var(--color-accent-star)',
        badge: 'var(--color-accent-badge)',
        good: 'var(--color-status-good)',
        caution: 'var(--color-status-caution)',
        warn: 'var(--color-status-warning)',
        adult: 'var(--color-mode-adult)',
        baby: 'var(--color-mode-baby)',
        link: 'var(--color-action-link)',
        focus: 'var(--color-state-focus)',
        overlay: 'var(--color-overlay)',
        chat: {
          cat: 'var(--color-chat-cat)',
          'cat-text': 'var(--color-chat-cat-text)',
          'user-adult': 'var(--color-chat-user-adult)',
          'user-baby': 'var(--color-chat-user-baby)',
          'user-text': 'var(--color-chat-user-text)',
        },
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
