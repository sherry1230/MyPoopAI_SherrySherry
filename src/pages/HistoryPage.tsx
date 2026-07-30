import { useEffect, useRef, useState } from 'react'
import { StarRating } from '@/components/StarRating'
import { StatusDot } from '@/components/StatusDot'
import { useAuth } from '@/hooks/useAuth'
import { countMyRecords, fetchMyRecords } from '@/lib/records'
import type { PoopRecord } from '@/types'

interface Props {
  /** 잠금 화면의 [가입하고 열람하기] → 설정 탭으로 이동 */
  onGoSettings: () => void
  /** 탭이 화면에 보이는 상태인지 — 페이지가 hidden으로 상주하므로 활성화 시마다 리페치 */
  active: boolean
}

/**
 * 탭 2 — 히스토리.
 * 게스트(익명)는 열람 차단 — 잠금 화면으로 가입 유도 (기록 자체는 계속 쌓인다).
 * TODO: 그래프/캘린더 실제 구현, 대변/소변 세그먼트, AI 7일 총평
 */
export default function HistoryPage({ onGoSettings, active }: Props) {
  const { loading, isGuest, user } = useAuth()
  const uid = user?.uid
  const [records, setRecords] = useState<PoopRecord[]>([])
  const [recordCount, setRecordCount] = useState<number | null>(null)
  const lastUidRef = useRef<string | undefined>(undefined)

  // 활성화될 때마다 리페치 (세션 중 저장한 기록 반영). 계정이 바뀌면 이전 상태 즉시 폐기.
  useEffect(() => {
    if (!active || loading || !uid) return
    if (lastUidRef.current !== uid) {
      lastUidRef.current = uid
      setRecords([])
      setRecordCount(null)
    }
    let cancelled = false
    if (isGuest) {
      countMyRecords()
        .then((n) => !cancelled && setRecordCount(n))
        .catch(() => !cancelled && setRecordCount(null))
    } else {
      fetchMyRecords()
        .then((list) => !cancelled && setRecords(list))
        .catch(() => !cancelled && setRecords([]))
    }
    return () => {
      cancelled = true
    }
  }, [active, loading, isGuest, uid])

  if (loading) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-bold text-ink-head">히스토리</h1>
        <p className="text-ink-soft">불러오는 중…</p>
      </section>
    )
  }

  if (isGuest) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-bold text-ink-head">히스토리</h1>
        <div className="flex flex-col items-center gap-4 rounded-card border border-line bg-bg-card px-6 py-12 text-center">
          <p className="text-4xl" aria-hidden>
            🔒
          </p>
          <p className="text-lg font-bold text-ink-head">
            {recordCount ? `기록이 ${recordCount}개 쌓였어요` : '기록은 잘 쌓이고 있어요'}
          </p>
          <p className="text-ink-soft">
            가입하면 그래프와 캘린더로 볼 수 있어요.
            <br />
            지금까지의 기록은 가입해도 그대로 이어져요.
          </p>
          <button
            type="button"
            onClick={onGoSettings}
            className="rounded-pill bg-ink-head px-6 py-2.5 text-sm font-bold text-bg-base"
          >
            가입하고 열람하기
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-ink-head">히스토리</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-56 rounded-card border border-line bg-bg-card p-4 text-ink-soft">
          별점 추이 그래프 (7일 / 30일)
        </div>
        <div className="h-56 rounded-card border border-line bg-bg-card p-4 text-ink-soft">
          캘린더 뷰
        </div>
      </div>

      <ul className="space-y-3">
        {records.length === 0 && (
          <li className="rounded-card border border-line p-6 text-center text-ink-soft">
            아직 기록이 없어요. 기록 탭에서 첫 기록을 남겨보세요.
          </li>
        )}
        {records.map((r) => (
          <li key={r.id} className="flex items-center gap-3 rounded-card border border-line p-4">
            <StatusDot score={r.score} />
            <div className="flex-1">
              <p className="text-sm text-ink-soft">
                {new Date(r.occurredAt ?? r.recordedAt).toLocaleDateString('ko-KR')}
                {r.inputType === 'photo' ? ' · 📷' : ' · 💬'}
              </p>
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
