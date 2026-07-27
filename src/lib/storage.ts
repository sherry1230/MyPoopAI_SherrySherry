/**
 * 기기 프리퍼런스 저장 레이어 (설정 · 온보딩 플래그 전용).
 *
 * ⚠️ 기록(records)의 LocalStorage 저장 정책은 폐기됐다 (기획서 v0.6~).
 * 게스트 = Firebase 익명 인증이며 기록은 게스트 포함 전부 Firestore에 저장한다.
 * 아래 records API는 Firestore 연동 전까지의 더미/과도기 용도로만 남아 있다 —
 * 신규 기능에서 기록 저장 경로로 사용하지 말 것.
 */
import type { AppSettings, PoopRecord } from '@/types'

const KEY = {
  settings: 'mypoop.settings',
  records: 'mypoop.records',
  onboarded: 'mypoop.onboarded',
} as const

const DEFAULT_SETTINGS: AppSettings = {
  mode: 'adult',
  maskEnabled: true,
  maskType: 'mosaic',
  locale: 'ko',
  character: 'pupu',
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* 용량 초과 등은 조용히 무시 */
  }
}

export const storage = {
  getSettings: () => ({ ...DEFAULT_SETTINGS, ...read<Partial<AppSettings>>(KEY.settings, {}) }),
  setSettings: (s: AppSettings) => write(KEY.settings, s),

  /** @deprecated 기록은 Firestore로 이관 예정 — 과도기/더미 용도만 */
  getRecords: () => read<PoopRecord[]>(KEY.records, []),
  /** @deprecated 기록은 Firestore로 이관 예정 — 신규 저장 경로로 사용 금지 */
  addRecord: (r: PoopRecord) => {
    const list = read<PoopRecord[]>(KEY.records, [])
    write(KEY.records, [r, ...list])
  },

  isOnboarded: () => read<boolean>(KEY.onboarded, false),
  setOnboarded: () => write(KEY.onboarded, true),
}
