import { useEffect, useRef, useState } from 'react'
import { storage } from '@/lib/storage'
import type { MaskType } from '@/types'

interface Props {
  onCapture: () => void
  onClose: () => void
}

/**
 * 첨부(+)에서 열리는 카메라 시트 — 구 CameraPage의 촬영/가리기 UI를 분리 보존한 것.
 * 카메라가 열리는 순간부터 가림 ON이 디폴트. 여기 토글은 **이번 촬영에만 적용되는 빠른 전환**이며
 * 영구 기본값 변경은 설정 탭에서만 한다 (storage에 쓰지 않는다).
 * TODO: WebRTC 스트림 + Canvas 실시간 가리기(변기/기저귀 인식) 연결
 * TODO: 앨범 업로드 경로 — 렌더 전 Canvas 가림 처리
 * TODO: 완전한 포커스 트랩 (현재는 초기 포커스 + Escape만)
 */
export function CameraSheet({ onCapture, onClose }: Props) {
  // 설정 탭의 기본값에서 시작하되, 시트 안의 변경은 세션 로컬로만 유지
  const [maskEnabled, setMaskEnabled] = useState(() => storage.getSettings().maskEnabled)
  const [maskType, setMaskType] = useState<MaskType>(() => storage.getSettings().maskType)
  const captureRef = useRef<HTMLButtonElement>(null)
  // 오버레이에서 pointerdown이 시작됐을 때만 바깥 클릭 닫기 (시트 안에서 드래그 후 릴리즈 오닫힘 방지)
  const downOnOverlay = useRef(false)

  useEffect(() => {
    captureRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-20 flex items-end justify-center bg-overlay md:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="사진 첨부"
      onPointerDown={(e) => {
        downOnOverlay.current = e.target === e.currentTarget
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && downOnOverlay.current) onClose()
      }}
    >
      <div className="w-full max-w-[480px] rounded-t-modal bg-bg-base p-4 md:rounded-modal">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-head">사진 첨부</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMaskEnabled((v) => !v)}
              className="rounded-pill border border-line px-3 text-sm text-ink"
              aria-pressed={maskEnabled}
            >
              가리기 {maskEnabled ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={() => setMaskType((t) => (t === 'mosaic' ? 'sticker' : 'mosaic'))}
              className="rounded-pill border border-line px-3 text-sm text-ink"
            >
              {maskType === 'mosaic' ? '모자이크' : '스티커'}
            </button>
          </div>
        </header>

        <div className="mt-4 flex aspect-[3/4] w-full items-center justify-center rounded-card border border-line bg-bg-card text-ink-soft">
          카메라 미리보기 영역 (열리는 순간부터 가림)
        </div>

        <div className="mt-4 flex items-center justify-center gap-6">
          <button type="button" onClick={onClose} className="rounded-pill px-4 text-sm text-ink-soft">
            닫기
          </button>
          <button
            ref={captureRef}
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
