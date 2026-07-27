export type TabKey = 'record' | 'history' | 'settings'

/* 탭1 '기록' = 채팅 본체. 카메라는 독립 화면이 아니라 채팅 첨부(+)의 시트 */
const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'record', label: '기록', icon: '💬' },
  { key: 'history', label: '히스토리', icon: '📈' },
  { key: 'settings', label: '설정', icon: '⚙️' },
]

interface Props {
  active: TabKey
  onChange: (key: TabKey) => void
}

/** 모바일: 하단 고정 탭바 / 데스크톱(md↑): 좌측 사이드 내비로 전환 */
export function TabBar({ active, onChange }: Props) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-bg-card
                 md:inset-y-0 md:right-auto md:w-56 md:border-r md:border-t-0"
      aria-label="주요 메뉴"
    >
      <ul className="flex md:mt-8 md:flex-col md:gap-1">
        {TABS.map((t) => (
          <li key={t.key} className="flex-1">
            <button
              type="button"
              onClick={() => onChange(t.key)}
              aria-current={active === t.key ? 'page' : undefined}
              className={`flex w-full flex-col items-center gap-1 py-3 text-xs
                          md:flex-row md:gap-3 md:px-5 md:text-sm
                          ${active === t.key ? 'text-ink-head font-bold' : 'text-ink-soft'}`}
            >
              <span aria-hidden>{t.icon}</span>
              {t.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
