import type { MouseEvent } from 'react'

interface Props {
  /** 0 ~ 5, 0.5 단위 */
  score: number
  size?: number
  /** 전달하면 편집 모드 — 별 탭으로 0.5 단위 수정 */
  onChange?: (score: number) => void
}

/** 별점. 기본 읽기 전용, onChange 전달 시 탭으로 수정 가능. 채움색은 accent/star 토큰. */
export function StarRating({ score, size = 24, onChange }: Props) {
  const pct = Math.max(0, Math.min(100, (score / 5) * 100))

  const display = (
    <div
      className="relative inline-block leading-none"
      role="img"
      aria-label={`5점 만점에 ${score}점`}
      style={{ fontSize: size }}
    >
      <span className="text-line">★★★★★</span>
      <span
        className="absolute inset-0 overflow-hidden whitespace-nowrap text-star"
        style={{ width: `${pct}%` }}
        aria-hidden
      >
        ★★★★★
      </span>
    </div>
  )

  if (!onChange) return display

  // 별 하나를 좌/우 반으로 쪼개 0.5 단위 입력을 받는다 (맨 왼쪽 밖 탭 = 0점)
  const handleTap = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    const raw = Math.round(ratio * 10) / 2 // 0 ~ 5, 0.5 단위
    onChange(Math.max(0, Math.min(5, raw)))
  }

  return (
    <div
      onClick={handleTap}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') onChange(Math.min(5, score + 0.5))
        if (e.key === 'ArrowLeft') onChange(Math.max(0, score - 0.5))
      }}
      role="slider"
      aria-label="별점 수정"
      aria-valuemin={0}
      aria-valuemax={5}
      aria-valuenow={score}
      tabIndex={0}
      className="inline-block cursor-pointer rounded-chip"
    >
      {display}
    </div>
  )
}
