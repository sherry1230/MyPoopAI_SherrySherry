/**
 * 기기 프리퍼런스 저장 레이어 (설정 · 온보딩 플래그 전용).
 * 기록(records)은 src/lib/records.ts — Firestore(게스트 포함 익명 uid)에만 저장한다.
 */
import type { AppSettings } from '@/types'

const KEY = {
  settings: 'mypoop.settings',
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

  isOnboarded: () => read<boolean>(KEY.onboarded, false),
  setOnboarded: () => write(KEY.onboarded, true),
}
