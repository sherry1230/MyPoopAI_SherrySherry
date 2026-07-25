/** 사용 모드 */
export type PoopMode = 'adult' | 'baby'

/** 가리기 방식 */
export type MaskType = 'mosaic' | 'sticker'

/** 한 건의 기록 */
export interface PoopRecord {
  id: string
  mode: PoopMode
  /** ISO8601 */
  recordedAt: string
  /** 0 ~ 5, 0.5 단위 */
  score: number
  /** AI 코멘트 */
  comment: string
  /** 가리기 처리된 이미지 경로 */
  maskedImagePath: string
  /** 원본 이미지 경로 (본인만 접근) */
  originalImagePath?: string
  /** 이상 소견 시 사용자가 답한 추가 정보 */
  followUp?: FollowUpAnswer
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
}

export type StatusLevel = 'good' | 'caution' | 'warning'
