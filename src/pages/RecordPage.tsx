import { useEffect, useRef, useState } from 'react'
import { ChatBubble } from '@/components/ChatBubble'
import { ChatInput } from '@/components/ChatInput'
import { RecordCard } from '@/components/RecordCard'
import { CameraSheet } from '@/components/CameraSheet'
import { storage } from '@/lib/storage'
import type { ChatMessage, PoopMode, PoopRecord } from '@/types'

const CHARACTER_NAME = { pupu: '푸푸', pipi: '피피' } as const

let seq = 0
const nextId = () => `msg-${Date.now()}-${seq++}`

/** 점수 구간별 더미 코멘트 — 실제로는 별점 수정 시 AI 코멘트 갱신 호출(경량)로 대체 */
function dummyComment(score: number): string {
  if (score >= 4) return '아주 건강한 상태로 보여요. 이 컨디션 유지해요!'
  if (score >= 2.5) return '수분을 충분히 챙기고 오늘은 자극적인 음식을 피해보세요.'
  return '상태가 좋지 않아 보여요. 수분 보충이 중요하고, 며칠 이어지면 병원 상담을 권해요.'
}

/**
 * 유저 발화를 기록 초안으로 바꾸는 더미 파서.
 * 실제로는 Cloud Functions 경유 Claude 호출(#1 대화 턴)이 intent 분기 JSON을 돌려준다.
 */
function dummyParse(text: string, mode: PoopMode): PoopRecord {
  const bad = /설사|묽|물똥|변비|딱딱/.test(text)
  const drink = /술|음주|맥주|소주|와인/.test(text)
  const score = bad ? 2.0 : 4.0
  return {
    id: `rec-${Date.now()}`,
    mode,
    recordType: /소변|쉬|오줌/.test(text) ? 'urine' : 'stool',
    inputType: 'chat',
    recordedAt: new Date().toISOString(),
    occurredAt: new Date().toISOString(),
    score,
    comment: dummyComment(score),
    context: drink ? { meal: '전일 음주' } : undefined,
  }
}

/**
 * 탭 1 — 기록 (기본 진입, 앱의 본체).
 * 채팅 UI: 텍스트 기록이 기본, 이미지는 첨부(+)로 선택. 기록 카드는 [기록 저장] 전 미저장.
 * 현재는 더미 데이터로 동작 — TODO: Functions+Claude 연동, greeting 서버 판정(hasMet), 쿼터.
 */
export default function RecordPage() {
  const [settings] = useState(storage.getSettings())
  const catName = CHARACTER_NAME[settings.character]

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: nextId(),
      role: 'cat',
      kind: 'text',
      // TODO: 첫만남(hasMet) 여부는 서버가 판정 — 지금은 더미 첫만남 인사
      text: `나는 ${catName}야, 네 배변활동 담당이지. 오늘 처음 만났네? 첫만남 ${new Date().toLocaleDateString(
        'ko-KR',
        { month: 'long', day: 'numeric' },
      )} — 오늘부터 1일 🐾\n오늘 상태를 편하게 말해줘. 사진은 + 버튼으로 붙일 수 있어.`,
      createdAt: new Date().toISOString(),
    },
  ])
  const [sheetOpen, setSheetOpen] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const prevCount = useRef(0)

  // 새 말풍선이 "추가"될 때만 맨 아래로 — 별점 수정 같은 갱신에는 스크롤을 건드리지 않는다
  useEffect(() => {
    if (messages.length > prevCount.current) {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
    prevCount.current = messages.length
  }, [messages])

  const append = (...items: ChatMessage[]) => setMessages((prev) => [...prev, ...items])

  const handleSend = (text: string) => {
    const record = dummyParse(text, settings.mode)
    append(
      { id: nextId(), role: 'user', kind: 'text', text, createdAt: new Date().toISOString() },
      {
        id: nextId(),
        role: 'cat',
        kind: 'text',
        text: '기록 정리했어. 별점 확인하고 맞으면 저장 눌러줘!',
        createdAt: new Date().toISOString(),
      },
      { id: nextId(), role: 'cat', kind: 'record', record, createdAt: new Date().toISOString() },
    )
  }

  const handleCapture = () => {
    setSheetOpen(false)
    const record: PoopRecord = {
      id: `rec-${Date.now()}`,
      mode: settings.mode,
      recordType: 'stool',
      inputType: 'photo',
      recordedAt: new Date().toISOString(),
      occurredAt: new Date().toISOString(),
      score: 4.5,
      comment: dummyComment(4.5),
    }
    append(
      {
        id: nextId(),
        role: 'user',
        kind: 'image',
        maskedImageUrl: 'masked-placeholder', // TODO: 가리기 처리된 캔버스 결과물
        createdAt: new Date().toISOString(),
      },
      {
        id: nextId(),
        role: 'cat',
        kind: 'text',
        text: '사진 분석했어 (원본은 나만 봤고, 너한텐 가려서 보여줄게).',
        createdAt: new Date().toISOString(),
      },
      { id: nextId(), role: 'cat', kind: 'record', record, createdAt: new Date().toISOString() },
    )
  }

  const updateRecord = (messageId: string, patch: Partial<ChatMessage>) =>
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, ...patch } : m)))

  const handleScoreChange = (message: ChatMessage, score: number) => {
    if (!message.record) return
    // 별점 수정 시 코멘트 갱신 (더미 — 실제로는 경량 AI 호출 #3)
    updateRecord(message.id, {
      record: { ...message.record, score, comment: dummyComment(score) },
    })
  }

  const handleSave = (message: ChatMessage) => {
    // TODO: Firestore 저장 (게스트 포함 익명 uid로 서버 저장). LocalStorage 기록 정책은 폐기됨.
    updateRecord(message.id, { saved: true })
    append({
      id: nextId(),
      role: 'cat',
      kind: 'text',
      text: '저장 완료! 히스토리에서 흐름을 볼 수 있어.',
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <section className="flex min-h-[calc(100dvh-8rem)] flex-col">
      <header className="flex items-center justify-between pb-3">
        <h1 className="text-2xl font-bold text-ink-head">
          {settings.mode === 'adult' ? 'My 💩' : 'My Baby 💩'}
        </h1>
        <span className="flex items-center gap-2 rounded-pill border border-line bg-bg-card px-3 py-1 text-sm font-bold text-ink">
          <span
            className={`h-2 w-2 rounded-pill ${settings.mode === 'adult' ? 'bg-adult' : 'bg-baby'}`}
            aria-hidden
          />
          {catName}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-3" role="log" aria-label="기록 대화">
        {messages.map((m, i) => {
          const showName =
            m.role === 'cat' && m.kind !== 'record' && messages[i - 1]?.role !== 'cat'
          if (m.kind === 'record' && m.record) {
            return (
              <RecordCard
                key={m.id}
                record={m.record}
                saved={Boolean(m.saved)}
                onScoreChange={(score) => handleScoreChange(m, score)}
                onSave={() => handleSave(m)}
              />
            )
          }
          if (m.kind === 'image') {
            return (
              <ChatBubble key={m.id} role={m.role} mode={settings.mode}>
                <div className="flex aspect-square w-40 items-center justify-center rounded-card border border-line bg-bg-base text-xs text-ink-mute">
                  가려진 사진 🐱
                </div>
              </ChatBubble>
            )
          }
          return (
            <ChatBubble
              key={m.id}
              role={m.role}
              mode={settings.mode}
              senderName={showName ? catName : undefined}
            >
              {m.text}
            </ChatBubble>
          )
        })}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-20 mt-4 bg-bg-base py-2 md:bottom-4">
        <ChatInput onSend={handleSend} onAttach={() => setSheetOpen(true)} />
        <p className="mt-2 text-center text-xs text-ink-soft">
          의료 상담이 아닌 생활 건강 참고예요 · 걱정되면 병원에 문의하세요
        </p>
      </div>

      {sheetOpen && <CameraSheet onCapture={handleCapture} onClose={() => setSheetOpen(false)} />}
    </section>
  )
}
