import { useCallback, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { refreshUser, subscribeAuth } from '@/lib/auth'
import { isConfigured } from '@/lib/firebase'

export interface AuthState {
  /** Firebase 환경변수가 세팅됐는지 — false면 인증 기능 전체 비활성 */
  configured: boolean
  /** 초기 상태 수신 전 */
  loading: boolean
  user: User | null
  /** 게스트(익명) 여부 — 미설정 환경도 게스트로 취급 */
  isGuest: boolean
  /** 이메일 계정인데 아직 메일 인증 전 */
  needsEmailVerification: boolean
  /** user.reload() 후 상태 갱신 (인증 메일 클릭 확인용) */
  refresh: () => Promise<void>
}

/** 로그인 상태 훅. 익명 자동 로그인은 App에서 initAuth() 1회로 처리된다. */
export function useAuth(): AuthState {
  const configured = isConfigured()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(configured)
  const [, forceRender] = useState(0)

  useEffect(() => {
    return subscribeAuth((u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  const refresh = useCallback(async () => {
    const u = await refreshUser()
    setUser(u)
    forceRender((n) => n + 1) // emailVerified는 같은 객체 내부가 바뀌므로 강제 리렌더
  }, [])

  const hasEmailProvider = Boolean(
    user?.providerData.some((p) => p.providerId === 'password'),
  )

  return {
    configured,
    loading,
    user,
    isGuest: !configured || !user || user.isAnonymous,
    needsEmailVerification: hasEmailProvider && !user?.emailVerified,
    refresh,
  }
}
