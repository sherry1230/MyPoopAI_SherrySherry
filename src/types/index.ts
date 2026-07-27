/** 사용 모드 */
export type PoopMode = 'adult' | 'baby'

/** 가리기 방식 */
export type MaskType = 'mosaic' | 'sticker'

/** 채팅 캐릭터 — 전역 1마리 선택 (users.chatCharacter) */
export type CharacterId = 'pupu' | 'pipi'

/** 캐릭터별 첫만남 메타 (users.characterMeta.{pupu|pipi} — 서버가 첫만남 판정) */
export interface CharacterMeta {
  hasMet: boolean
  /** ISO8601 — "오늘부터 1일" D+n 카운트 기준 */
  firstMetAt?: string
}

/** 기록 대상 */
export type RecordType = 'stool' | 'urine'

/** 기록 입력 경로 */
export type RecordInputType = 'photo' | 'chat'

/** 한 건의 기록 */
export interface PoopRecord {
  id: string
  mode: PoopMode
  /** 대변/소변 (기본 stool) */
  recordType?: RecordType
  /** 입력 경로 — 사진 or 채팅 */
  inputType?: RecordInputType
  /** ISO8601 — 시스템 기록 시각 (서버에서는 serverTimestamp) */
  recordedAt: string
  /** ISO8601 — 실제 발생 시각. 유저가 기록 카드에서 수정 가능 */
  occurredAt?: string
  /** 0 ~ 5, 0.5 단위 */
  score: number
  /** AI 코멘트 */
  comment: string
  /** 컨텍스트 (식사 메모 등 — AI 파싱 자동 기입) */
  context?: { meal?: string }
  /** 가리기 처리된 이미지 경로 */
  maskedImagePath?: string
  /** 원본 이미지 경로 (본인만 접근) */
  originalImagePath?: string
  /** 이상 소견 시 사용자가 답한 추가 정보 */
  followUp?: FollowUpAnswer
}

/** 채팅 메시지 — 기록 탭(RecordPage)의 말풍선 한 개 */
export interface ChatMessage {
  id: string
  role: 'user' | 'cat'
  /** text: 일반 말풍선 / image: 가리기 처리된 이미지 / record: 기록 카드 */
  kind: 'text' | 'image' | 'record'
  text?: string
  /** 가리기 처리본 미리보기 (data URL 등). 원본은 절대 넣지 않는다 */
  maskedImageUrl?: string
  /** kind === 'record' 일 때의 기록 초안 — [기록 저장] 확정 전 미저장 */
  record?: PoopRecord
  /** 이 카드가 [기록 저장]으로 확정되었는지 */
  saved?: boolean
  /** ISO8601 */
  createdAt: string
}

export interface FollowUpAnswer {
  meals?: string
  medications?: string
  lactoseIntolerant?: boolean
  note?: string
}

/** 성인 건강 정보 */
export interface AdultProfile {
  birthYear?: number
  sex?: 'male' | 'female' | 'other'
  conditions?: string[]
  medications?: string[]
  lactoseIntolerant?: boolean
}

/** 베이비 건강 정보 */
export interface BabyProfile {
  birthDate?: string
  feeding?: 'formula' | 'breast' | 'mixed' | 'solid'
  allergies?: string[]
  note?: string
}

export interface AppSettings {
  mode: PoopMode
  maskEnabled: boolean
  maskType: MaskType
  locale: 'ko' | 'en'
  /** 전역 채팅 캐릭터 (서버 users.chatCharacter와 동기화 예정) */
  character: CharacterId
}

export type StatusLevel = 'good' | 'caution' | 'warning'
