import { useEffect, useState } from 'react'
import RecordPage from './pages/RecordPage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'
import { TabBar, type TabKey } from './components/TabBar'
import { useTheme } from './hooks/useTheme'
import { initAuth } from './lib/auth'

export default function App() {
  const [tab, setTab] = useState<TabKey>('record')
  useTheme() // 앱 진입 시 저장된 테마(라이트/다크)를 <html data-theme> 에 적용
  useEffect(() => {
    initAuth() // 최초 진입 시 익명 게스트 uid 자동 생성 (Firebase 미설정이면 no-op)
  }, [])

  return (
    <div className="min-h-full bg-bg-base text-ink">
      <main className="mx-auto w-full max-w-tablet px-4 pb-24 pt-6 md:max-w-desktop md:px-8 lg:max-w-wide">
        {/* 탭 전환 시 언마운트하지 않고 숨김 — 채팅 대화·미저장 기록 카드 초안 보존 */}
        <div hidden={tab !== 'record'}>
          <RecordPage />
        </div>
        <div hidden={tab !== 'history'}>
          <HistoryPage onGoSettings={() => setTab('settings')} active={tab === 'history'} />
        </div>
        <div hidden={tab !== 'settings'}>
          <SettingsPage />
        </div>
      </main>
      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}
