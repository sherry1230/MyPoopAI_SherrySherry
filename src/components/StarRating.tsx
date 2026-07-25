interface Props {
  /** 0 ~ 5, 0.5 단위 */
  score: number
  size?: number
}

/** 별점 표시 (읽기 전용). 채움색은 accent/star 토큰. */
export function StarRating({ score, size = 24 }: Props) {
  const pct = Math.max(0, Math.min(100, (score / 5) * 100))
  return (
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
}
