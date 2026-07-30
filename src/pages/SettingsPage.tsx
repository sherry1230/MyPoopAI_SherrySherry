import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/hooks/useAuth'
import {
  AuthError,
  deleteAccount,
  linkOrSignInWithGoogle,
  logout,
  resendVerificationEmail,
  signInWithEmail,
  signInWithExistingGoogle,
  signUpWithEmail,
} from '@/lib/auth'

/**
 * 탭 3 — 설정.
 * 계정: 게스트(익명) 기본 / Google·이메일 전환은 linkWithCredential(uid 유지) /
 * 이메일 가입은 인증 메일 필수 / Apple은 자리만 / 회원탈퇴는 전 계정 2단계 확인.
 */
export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { configured, loading, user, isGuest, needsEmailVerification, refresh } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  /** Google 계정이 이미 가입돼 있을 때: 기록 미승계 확인 단계 */
  const [confirmExistingGoogle, setConfirmExistingGoogle] = useState(false)
  /** 회원탈퇴 2단계 확인 */
  const [confirmDelete, setConfirmDelete] = useState(false)
  /** 이메일 계정 탈퇴 시 재인증용 비밀번호 */
  const [deletePassword, setDeletePassword] = useState('')

  const isEmailAccount = Boolean(user?.providerData.some((p) => p.providerId === 'password'))

  const run = async (fn: () => Promise<unknown>, successMessage?: string) => {
    setBusy(true)
    setNotice(null)
    try {
      await fn()
      if (successMessage) setNotice(successMessage)
    } catch (e) {
      if (e instanceof AuthError && e.code === 'credential-already-in-use') {
        setConfirmExistingGoogle(true)
      }
      setNotice(e instanceof Error ? e.message : '문제가 생겼어요.')
    } finally {
      setBusy(false)
    }
  }

  const accountLabel = loading
    ? '확인 중…'
    : !configured
      ? '게스트 (로컬 모드)'
      : isGuest
        ? '게스트 (익명) — 기록은 서버에 안전하게 쌓이는 중'
        : (user?.email ?? user?.displayName ?? '로그인됨')

  const rows = [
    ['가리기 설정', '기본값 · 모자이크 or 스티커 · ON/OFF'],
    ['마이 건강 정보', '생년 · 복용약 · 유당불내증'],
    ['마이 베이비 건강 정보', '생일 · 수유 형태 · 알레르기'],
    ['기록 다운로드', '전체 · 날짜 선택 · 기간 (5,000원)'],
    ['언어', '한국어 / English'],
    ['개인정보 처리방침', 'AI 학습 데이터 활용 동의'],
  ]

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-ink-head">설정</h1>

      <div className="flex items-center justify-between rounded-card border border-line bg-bg-card px-4 py-3">
        <div>
          <p className="text-ink">테마</p>
          <p className="text-xs text-ink-soft">{theme === 'dark' ? '다크' : '라이트'} 모드 사용 중</p>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-pill border border-line px-4 text-sm text-ink"
          aria-pressed={theme === 'dark'}
        >
          {theme === 'dark' ? '라이트로 전환' : '다크로 전환'}
        </button>
      </div>

      {/* 계정 섹션 */}
      <div className="space-y-3 rounded-card border border-line bg-bg-card p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-bold text-ink-head">계정</p>
            <p className="text-sm text-ink-soft">{accountLabel}</p>
          </div>
          {needsEmailVerification && (
            <span className="shrink-0 rounded-chip border border-caution px-2 py-0.5 text-xs font-bold text-caution">
              메일 인증 대기
            </span>
          )}
        </div>

        {!configured && (
          <p className="rounded-chip border border-line bg-bg-base p-3 text-sm text-ink-soft">
            Firebase 환경변수(.env)가 아직 없어 로그인 기능이 꺼져 있어요.
          </p>
        )}

        {notice && <p className="text-sm text-caution">{notice}</p>}

        {/* 이미 가입된 Google 계정 → 기록 미승계 확인 (2단계) */}
        {confirmExistingGoogle && (
          <div className="space-y-2 rounded-chip border border-caution p-3">
            <p className="text-sm text-ink">
              이미 가입된 Google 계정이에요. 이 계정으로 로그인하면{' '}
              <strong>지금 게스트로 쌓은 기록은 연결되지 않아요.</strong>
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    await signInWithExistingGoogle()
                    setConfirmExistingGoogle(false)
                  }, '기존 계정으로 로그인했어요.')
                }
                className="rounded-pill border border-caution px-4 py-1.5 text-sm text-caution"
              >
                그래도 로그인
              </button>
              <button
                type="button"
                onClick={() => setConfirmExistingGoogle(false)}
                className="rounded-pill border border-line px-4 py-1.5 text-sm text-ink"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {needsEmailVerification && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy || !configured}
              onClick={() => run(() => resendVerificationEmail(), '인증 메일을 다시 보냈어요.')}
              className="rounded-pill border border-line px-4 py-1.5 text-sm text-ink disabled:opacity-40"
            >
              인증 메일 재발송
            </button>
            <button
              type="button"
              disabled={busy || !configured}
              onClick={() => run(() => refresh(), '인증 상태를 새로고침했어요.')}
              className="rounded-pill border border-line px-4 py-1.5 text-sm text-ink disabled:opacity-40"
            >
              인증 완료 확인
            </button>
          </div>
        )}

        {isGuest && (
          <>
            <button
              type="button"
              disabled={busy || !configured}
              onClick={() =>
                run(() => linkOrSignInWithGoogle(), 'Google 계정과 연결됐어요. 기록은 그대로예요!')
              }
              className="w-full rounded-pill border border-line bg-bg-base py-2.5 text-sm font-bold text-ink disabled:opacity-40"
            >
              Google로 계속하기 (기록 유지)
            </button>
            <button
              type="button"
              disabled
              className="w-full rounded-pill border border-line bg-bg-base py-2.5 text-sm font-bold text-ink opacity-40"
              aria-disabled="true"
            >
               Apple로 계속하기 (준비 중)
            </button>

            <div className="space-y-2 border-t border-line pt-3">
              <p className="text-sm font-bold text-ink">이메일로 가입 / 로그인</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일"
                autoComplete="email"
                className="min-h-[44px] w-full rounded-chip border border-line bg-bg-base px-3 text-[15px] text-ink placeholder:text-ink-mute"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 (6자 이상)"
                autoComplete="new-password"
                className="min-h-[44px] w-full rounded-chip border border-line bg-bg-base px-3 text-[15px] text-ink placeholder:text-ink-mute"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={busy || !configured || !email || password.length < 6}
                  onClick={() =>
                    run(async () => {
                      const { verificationSent } = await signUpWithEmail(email, password)
                      setNotice(
                        verificationSent
                          ? '가입 완료! 인증 메일을 확인해 주세요. 기록은 그대로예요.'
                          : '가입은 완료됐어요. 인증 메일 발송이 실패해서 [인증 메일 재발송]을 눌러 주세요.',
                      )
                    })
                  }
                  className="flex-1 rounded-pill bg-ink-head py-2.5 text-sm font-bold text-bg-base disabled:opacity-40"
                >
                  가입 (기록 유지)
                </button>
                <button
                  type="button"
                  disabled={busy || !configured || !email || !password}
                  onClick={() =>
                    run(() => signInWithEmail(email, password), '로그인했어요.')
                  }
                  className="flex-1 rounded-pill border border-line py-2.5 text-sm font-bold text-ink disabled:opacity-40"
                >
                  기존 회원 로그인
                </button>
              </div>
              <p className="text-xs text-ink-soft">
                기존 회원 로그인 시 지금 게스트 기록과는 연결되지 않아요.
              </p>
            </div>
          </>
        )}

        {!isGuest && (
          <button
            type="button"
            disabled={busy}
            onClick={() => run(() => logout(), '로그아웃했어요. 새 게스트로 시작해요.')}
            className="w-full rounded-pill border border-line py-2.5 text-sm text-ink disabled:opacity-40"
          >
            로그아웃
          </button>
        )}
      </div>

      <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-bg-card">
        {rows.map(([title, desc]) => (
          <li key={title}>
            <button type="button" className="flex w-full flex-col items-start px-4 py-3 text-left">
              <span className="text-ink">{title}</span>
              <span className="text-xs text-ink-soft">{desc}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* 회원탈퇴 — 전 계정(게스트 포함), 2단계 확인 */}
      <div className="rounded-card border border-warn p-4">
        {!confirmDelete ? (
          <button
            type="button"
            disabled={busy || !configured || !user}
            onClick={() => setConfirmDelete(true)}
            className="text-sm text-warn disabled:opacity-40"
          >
            회원탈퇴
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-bold text-warn">정말 탈퇴할까요?</p>
            <p className="text-sm text-ink">
              모든 기록·사진·대화가 <strong>즉시 삭제되며 복구할 수 없어요.</strong>
              {isGuest && ' 게스트 계정도 서버의 기록이 모두 지워져요.'}
            </p>
            {isEmailAccount && (
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="본인 확인 — 비밀번호 입력"
                autoComplete="current-password"
                className="min-h-[44px] w-full rounded-chip border border-line bg-bg-base px-3 text-[15px] text-ink placeholder:text-ink-mute"
              />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                disabled={busy || (isEmailAccount && !deletePassword)}
                onClick={() =>
                  run(async () => {
                    await deleteAccount(deletePassword || undefined)
                    setConfirmDelete(false)
                    setDeletePassword('')
                  }, '탈퇴가 완료됐어요. 새 게스트로 시작해요.')
                }
                className="rounded-pill bg-warn px-4 py-2 text-sm font-bold text-bg-base disabled:opacity-40"
              >
                {busy ? '삭제 중…' : '영구 삭제하고 탈퇴'}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirmDelete(false)}
                className="rounded-pill border border-line px-4 py-2 text-sm text-ink"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
