import type { PoopMode } from '@/types'
import type { ReactNode } from 'react'

interface Props {
  role: 'user' | 'cat'
  mode: PoopMode
  /** 냥이 말풍선 위에 표시할 캐릭터 이름 (연속 말풍선이면 생략) */
  senderName?: string
  children: ReactNode
}

/**
 * 채팅 말풍선. 냥이는 좌측(카드색), 유저는 우측(모드색 — 성인 데님/베이비 로즈).
 * 색은 전부 chat.* 토큰 — 라이트/다크 자동 전환.
 */
export function ChatBubble({ role, mode, senderName, children }: Props) {
  const isUser = role === 'user'
  const userBg = mode === 'adult' ? 'bg-chat-user-adult' : 'bg-chat-user-baby'

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      {senderName && !isUser && (
        <span className="mb-1 px-1 text-xs text-ink-soft">{senderName}</span>
      )}
      <div
        className={`max-w-[80%] whitespace-pre-wrap rounded-modal px-4 py-2.5 text-[15px] leading-relaxed
                    ${isUser ? `${userBg} text-chat-user-text rounded-br-chip` : 'bg-chat-cat text-chat-cat-text rounded-bl-chip'}`}
      >
        {children}
      </div>
    </div>
  )
}
