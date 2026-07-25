import { useState } from 'react'
import { storage } from '@/lib/storage'
import type { MaskType } from '@/types'

/**
 * 탭 1 — 기록 (기본 진입). 촬영과 AI 챗봇 대화가 모두 이 탭에서 일어난다.
 * TODO: WebRTC 스트림 + Canvas 실시간 가리기 연결
 * TODO: 촬영 -> AI 분석 호출 -> 결과(별점/코멘트)
 * TODO: 이상 소견 시 추가 질문("오늘 뭐 드셨어요?" 등)은 챗봇 대화 UI로 진행
 */
export default function CameraPage() {
  const [settings, setSettings] = useState(storage.getSettings())

  const toggleMask = () => {
    const next = { ...settings, maskEnabled: !settings.maskEnabled }
    setSettings(next)
    storage.setSettings(next)
  }

  const setMaskType = (maskType: MaskType) => {
    const next = { ...settings, maskType }
    setSettings(next)
    storage.setSettings(next)
  }

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink-head">
          {settings.mode === 'adult' ? 'My 💩' : 'My Baby 💩'}
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMask}
            className="rounded-pill border border-line px-3 text-sm"
            aria-pressed={settings.maskEnabled}
          >
            가리기 {settings.maskEnabled ? 'ON' : 'OFF'}
          </button>
          <button
            type="button"
            onClick={() => setMaskType(settings.maskType === 'mosaic' ? 'sticker' : 'mosaic')}
            className="rounded-pill border border-line px-3 text-sm"
          >
            {settings.maskType === 'mosaic' ? '모자이크' : '스티커'}
          </button>
        </div>
      </header>

      <div className="flex aspect-[3/4] w-full items-center justify-center rounded-card border border-line bg-bg-card text-ink-mute">
        카메라 미리보기 영역
      </div>

      <button
        type="button"
        className="mx-auto block h-[72px] w-[72px] rounded-pill bg-ink-head text-bg-base"
        aria-label="촬영"
      >
        촬영
      </button>
    </section>
  )
}
