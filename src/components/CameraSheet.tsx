import { useState } from 'react'
import { storage } from '@/lib/storage'
import type { MaskType } from '@/types'

interface Props {
  onCapture: () => void
  onClose: () => void
}

/**
 * 첨부(+)에서 열리는 카메라 시트 — 구 CameraPage의 촬영/가리기 UI를 분리 보존한 것.
 * 카메라가 열리는 순간부터 가림 ON이 디폴트. 여기 토글은 빠른 전환용(기본값은 설정 탭).
 * TODO: WebRTC 스트림 + Canvas 실시간 가리기(변기/기저귀 인식) 연결
 * TODO: 앨범 업로드 경로 — 렌더 전 Canvas 가림 처리
 */
export function CameraSheet({ onCapture, onClose }: Props) {
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
    <div
      className="fixed inset-0 z-20 flex items-end justify-center bg-overlay md:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="사진 첨부"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] rounded-t-modal bg-bg-base p-4 md:rounded-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-head">사진 첨부</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMask}
              className="rounded-pill border border-line px-3 text-sm text-ink"
              aria-pressed={settings.maskEnabled}
            >
              가리기 {settings.maskEnabled ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={() => setMaskType(settings.maskType === 'mosaic' ? 'sticker' : 'mosaic')}
              className="rounded-pill border border-line px-3 text-sm text-ink"
            >
              {settings.maskType === 'mosaic' ? '모자이크' : '스티커'}
            </button>
          </div>
        </header>

        <div className="mt-4 flex aspect-[3/4] w-full items-center justify-center rounded-card border border-line bg-bg-card text-ink-mute">
          카메라 미리보기 영역 (열리는 순간부터 가림)
        </div>

        <div className="mt-4 flex items-center justify-center gap-6">
          <button type="button" onClick={onClose} className="rounded-pill px-4 text-sm text-ink-soft">
            닫기
          </button>
          <button
            type="button"
            onClick={onCapture}
            className="h-[72px] w-[72px] rounded-pill bg-ink-head text-bg-base"
            aria-label="촬영"
          >
            촬영
          </button>
          <button type="button" className="rounded-pill px-4 text-sm text-ink-soft" disabled>
            앨범
          </button>
        </div>
      </div>
    </div>
  )
}
