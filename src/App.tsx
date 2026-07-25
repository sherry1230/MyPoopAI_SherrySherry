import { useState } from 'react'
import CameraPage from './pages/CameraPage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'
import { TabBar, type TabKey } from './components/TabBar'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const [tab, setTab] = useState<TabKey>('camera')
  useTheme() // 앱 진입 시 저장된 테마(라이트/다크)를 <html data-theme> 에 적용

  return (
    <div className="min-h-full bg-bg-base text-ink">
      <main className="mx-auto w-full max-w-tablet px-4 pb-24 pt-6 md:max-w-desktop md:px-8 lg:max-w-wide">
        {tab === 'camera' && <CameraPage />}
        {tab === 'history' && <HistoryPage />}
        {tab === 'settings' && <SettingsPage />}
      </main>
      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}
