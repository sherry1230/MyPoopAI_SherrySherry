import { StarRating } from './StarRating'
import { StatusDot } from './StatusDot'
import type { PoopRecord } from '@/types'

interface Props {
  record: PoopRecord
  saved: boolean
  /** 저장 요청 진행 중 — 더블탭 중복 저장 방지 */
  saving?: boolean
  onScoreChange: (score: number) => void
  onSave: () => void
}

/**
 * 채팅 안에 도착하는 기록 카드.
 * AI 제안 별점이 미리 채워지고 유저가 수정 가능(0~5 · 0.5단위).
 * [기록 저장]을 누르기 전에는 저장되지 않는다 — 농담·회상이 기록을 오염시키지 않게.
 */
export function RecordCard({ record, saved, saving, onScoreChange, onSave }: Props) {
  const occurred = record.occurredAt ?? record.recordedAt

  return (
    <div className="w-full max-w-[80%] rounded-card border border-line bg-bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm text-ink-soft">
          <StatusDot score={record.score} />
          {record.recordType === 'urine' ? '소변' : '대변'} 기록
          {record.inputType === 'photo' ? ' · 📷' : ' · 💬'}
        </p>
        {saved ? (
          <span className="rounded-chip bg-ink-head px-2 py-0.5 text-xs font-bold text-bg-base">✓ 저장됨</span>
        ) : (
          <span className="rounded-chip border border-line px-2 py-0.5 text-xs text-ink-soft">미저장</span>
        )}
      </div>

      <p className="mt-2 text-sm text-ink-soft">
        발생 시각:{' '}
        {new Date(occurred).toLocaleString('ko-KR', {
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })}
      </p>
      {record.context?.meal && (
        <p className="text-sm text-ink-soft">컨텍스트: {record.context.meal}</p>
      )}

      <div className="mt-3 flex items-center gap-3">
        <StarRating
          score={record.score}
          size={26}
          onChange={saved ? undefined : onScoreChange}
        />
        <span className="text-sm font-bold text-ink">{record.score.toFixed(1)}</span>
      </div>
      {!saved && (
        <p className="mt-1 text-xs text-ink-soft">별을 탭해서 점수를 고칠 수 있어요</p>
      )}

      <p className="mt-3 text-[15px] text-ink">{record.comment}</p>

      {!saved && (
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="mt-4 w-full rounded-pill bg-ink-head py-2.5 text-sm font-bold text-bg-base disabled:opacity-40"
        >
          {saving ? '저장 중…' : '기록 저장'}
        </button>
      )}
    </div>
  )
}
