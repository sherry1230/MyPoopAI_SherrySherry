import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'mypoop.theme'

/** 저장값 > OS 설정 순서로 초기 테마를 정한다 */
function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* 프라이빗 모드 등 접근 불가 시 무시 */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  // 모바일 브라우저 주소창 색상도 함께 전환
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#232220' : '#F4F0E6')
}

/**
 * 테마 토글 훅.
 * <html data-theme="..."> 를 갱신하면 design/tokens/colors.css 의
 * CSS 변수가 바뀌어 전체 UI가 전환된다.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* 저장 실패는 무시 — 세션 내에서는 동작 */
    }
  }, [theme])

  const setTheme = useCallback((next: Theme) => setThemeState(next), [])
  const toggleTheme = useCallback(
    () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light')),
    [],
  )

  return { theme, setTheme, toggleTheme }
}
