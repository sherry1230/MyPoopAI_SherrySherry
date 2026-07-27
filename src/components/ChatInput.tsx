import { useState } from 'react'

interface Props {
  onSend: (text: string) => void
  onAttach: () => void
  disabled?: boolean
}

/** 채팅 하단 입력창 — 첨부(+) · 텍스트 · 전송. 텍스트 기록이 기본, 이미지는 선택 첨부. */
export function ChatInput({ onSend, onAttach, disabled }: Props) {
  const [text, setText] = useState('')

  const submit = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText('')
  }

  return (
    <div className="flex items-end gap-2">
      <button
        type="button"
        onClick={onAttach}
        aria-label="사진 첨부 (카메라 · 앨범)"
        className="h-11 w-11 shrink-0 rounded-pill border border-line bg-bg-card text-xl text-ink-soft"
      >
        +
      </button>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            submit()
          }
        }}
        rows={1}
        placeholder="오늘 상태를 편하게 말해주세요"
        aria-label="기록 입력"
        className="min-h-[44px] flex-1 resize-none rounded-modal border border-line bg-bg-card
                   px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-mute focus:outline-none"
        disabled={disabled}
      />
      <button
        type="button"
        onClick={submit}
        disabled={disabled || !text.trim()}
        className="h-11 shrink-0 rounded-pill bg-ink-head px-4 text-sm font-bold text-bg-base disabled:opacity-40"
      >
        전송
      </button>
    </div>
  )
}
