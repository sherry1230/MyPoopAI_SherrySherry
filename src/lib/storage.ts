/**
 * 게스트(비로그인) 상태 저장 레이어.
 * 로그인 없이도 앱 전체가 동작해야 하므로 모든 읽기/쓰기는 이 파일을 통한다.
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
  getSettings: () => read<AppSettings>(KEY.settings, DEFAULT_SETTINGS),
  setSettings: (s: AppSettings) => write(KEY.settings, s),

  getRecords: () => read<PoopRecord[]>(KEY.records, []),
  addRecord: (r: PoopRecord) => {
    const list = read<PoopRecord[]>(KEY.records, [])
    write(KEY.records, [r, ...list])
  },

  isOnboarded: () => read<boolean>(KEY.onboarded, false),
  setOnboarded: () => write(KEY.onboarded, true),
}
