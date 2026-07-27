interface Props {
  score: number
  size?: number
}

/** 별점 -> 상태 토큰 클래스. 색은 CSS 변수라 라이트/다크 자동 전환 */
function statusClassByScore(score: number): string {
  if (score >= 4) return 'bg-good'
  if (score >= 2.5) return 'bg-caution'
  return 'bg-warn'
}

/** 캘린더 날짜별 상태 도트. 양호/주의/경고 3단계. */
export function StatusDot({ score, size = 8 }: Props) {
  return (
    <span
      className={`inline-block rounded-pill ${statusClassByScore(score)}`}
      style={{ width: size, height: size }}
      aria-hidden
    />
  )
}
