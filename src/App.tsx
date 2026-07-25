import { useState } from 'react'
import CameraPage from './pages/CameraPage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'
import { TabBar, type TabKey } from './components/TabBar'

export default function App() {
  const [tab, setTab] = useState<TabKey>('camera')

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
