import { storage } from '@/lib/storage'
import { StarRating } from '@/components/StarRating'
import { StatusDot } from '@/components/StatusDot'

/**
 * 탭 2 — 히스토리
 * 상단 꺾은선 그래프(7일/30일) · 중단 캘린더 도트 · 하단 AI 총평
 * TODO: 그래프 컴포넌트, 캘린더 뷰, 7일 총평 API 연결
 */
export default function HistoryPage() {
  const records = storage.getRecords()

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-ink-head">히스토리</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-56 rounded-card border border-line bg-bg-card p-4 text-ink-mute">
          별점 추이 그래프 (7일 / 30일)
        </div>
        <div className="h-56 rounded-card border border-line bg-bg-card p-4 text-ink-mute">
          캘린더 뷰
        </div>
      </div>

      <ul className="space-y-3">
        {records.length === 0 && (
          <li className="rounded-card border border-line p-6 text-center text-ink-mute">
            아직 기록이 없어요. 첫 기록을 남겨보세요.
          </li>
        )}
        {records.map((r) => (
          <li key={r.id} className="flex items-center gap-3 rounded-card border border-line p-4">
            <StatusDot score={r.score} />
            <div className="flex-1">
              <p className="text-sm text-ink-soft">{new Date(r.recordedAt).toLocaleDateString('ko-KR')}</p>
              <p className="text-ink">{r.comment}</p>
            </div>
            <StarRating score={r.score} size={16} />
          </li>
        ))}
      </ul>

      <div className="rounded-card bg-bg-card p-4">
        <p className="font-bold text-ink-head">AI 7일 총평</p>
        <p className="text-ink-soft">기록이 쌓이면 여기에 총평이 표시돼요.</p>
      </div>
    </section>
  )
}
