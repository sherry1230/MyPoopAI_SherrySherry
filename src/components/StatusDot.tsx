import { statusColorByScore } from '../../design/tokens/colors'

interface Props {
  score: number
  size?: number
}

/** 캘린더 날짜별 상태 도트. 양호/주의/경고 3단계. */
export function StatusDot({ score, size = 8 }: Props) {
  return (
    <span
      className="inline-block rounded-pill"
      style={{ width: size, height: size, backgroundColor: statusColorByScore(score) }}
      aria-hidden
    />
  )
}
