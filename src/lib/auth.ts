/**
 * 인증 레이어 — 게스트(익명) 우선.
 *
 * 원칙 (기획서 v0.8~):
 * - 앱 진입 즉시 익명 uid 자동 생성 → 기록은 처음부터 서버(Firestore)에 쌓인다
 * - 게스트 → 가입 전환은 반드시 linkWithCredential/linkWithPopup — uid 유지, 기록 승계
 * - 이메일 가입은 sendEmailVerification 필수
 * - 회원탈퇴는 전 계정(게스트 포함): 데이터 삭제 → deleteUser
 */
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  deleteUser,
  linkWithCredential,
  linkWithPopup,
  onAuthStateChanged,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendEmailVerification,
  signInAnonymously,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { auth, isConfigured } from './firebase'
import { deleteAllMyData } from './records'

/** UI가 분기할 수 있는 안전한 에러 코드 */
export type AuthErrorCode =
  | 'not-configured'
  | 'email-already-in-use'
  | 'credential-already-in-use'
  | 'wrong-password'
  | 'weak-password'
  | 'invalid-email'
  | 'requires-recent-login'
  | 'password-required'
  | 'popup-closed'
  | 'unknown'

export class AuthError extends Error {
  code: AuthErrorCode
  constructor(code: AuthErrorCode, message: string) {
    super(message)
    this.code = code
  }
}

function toAuthError(e: unknown): AuthError {
  const code = (e as { code?: string })?.code ?? ''
  const map: Record<string, [AuthErrorCode, string]> = {
    'auth/email-already-in-use': ['email-already-in-use', '이미 가입된 이메일이에요. 로그인해 주세요.'],
    'auth/credential-already-in-use': [
      'credential-already-in-use',
      '이미 가입된 계정이에요. 이 계정으로 로그인하면 지금 게스트로 쌓은 기록과는 연결되지 않아요.',
    ],
    'auth/account-exists-with-different-credential': [
      'credential-already-in-use',
      '다른 방법으로 가입된 이메일이에요.',
    ],
    'auth/wrong-password': ['wrong-password', '비밀번호가 맞지 않아요.'],
    'auth/invalid-credential': ['wrong-password', '이메일 또는 비밀번호가 맞지 않아요.'],
    'auth/weak-password': ['weak-password', '비밀번호는 6자 이상이어야 해요.'],
    'auth/invalid-email': ['invalid-email', '이메일 형식이 올바르지 않아요.'],
    'auth/requires-recent-login': [
      'requires-recent-login',
      '보안을 위해 다시 로그인한 뒤 탈퇴를 진행해 주세요.',
    ],
    'auth/popup-closed-by-user': ['popup-closed', '로그인 창이 닫혔어요.'],
    'auth/cancelled-popup-request': ['popup-closed', '로그인 창이 닫혔어요.'],
  }
  const [c, m] = map[code] ?? ['unknown', '문제가 생겼어요. 잠시 후 다시 시도해 주세요.']
  return new AuthError(c, m)
}

function requireConfigured() {
  if (!isConfigured()) {
    throw new AuthError('not-configured', 'Firebase 환경변수가 설정되지 않았어요 (.env 확인).')
  }
}

let initialized = false

/**
 * 앱 최초 진입 시 1회 호출. 로그인 상태를 구독하고,
 * 유저가 없으면(첫 방문·로그아웃 직후) 익명 로그인으로 게스트 uid를 만든다.
 * Firebase 미설정 환경에서는 조용히 아무것도 하지 않는다 (앱은 로컬 더미로 동작).
 */
export function initAuth(): void {
  if (initialized || !isConfigured()) return
  initialized = true
  onAuthStateChanged(auth(), (user) => {
    if (!user) {
      signInAnonymously(auth()).catch((e) => {
        // 콘솔에서 익명 로그인이 꺼져 있는 경우 등 — 앱은 계속 동작해야 한다
        console.error('익명 로그인 실패:', e)
      })
    }
  })
}

/** 로그인 상태 구독 (useAuth 훅 전용) */
export function subscribeAuth(cb: (user: User | null) => void): () => void {
  if (!isConfigured()) {
    cb(null)
    return () => {}
  }
  return onAuthStateChanged(auth(), cb)
}

/**
 * Google 로그인.
 * - 익명(게스트) 상태면 linkWithPopup — uid 유지, 기록 그대로 승계
 * - 이미 그 Google 계정이 가입돼 있으면 AuthError('credential-already-in-use') —
 *   UI가 사용자에게 "기록 승계 없이 기존 계정으로 로그인"을 확인받은 뒤
 *   signInWithExistingGoogle()을 호출한다
 */
export async function linkOrSignInWithGoogle(): Promise<User> {
  requireConfigured()
  const provider = new GoogleAuthProvider()
  const current = auth().currentUser
  try {
    if (current?.isAnonymous) {
      const result = await linkWithPopup(current, provider)
      return result.user
    }
    const { signInWithPopup } = await import('firebase/auth')
    const result = await signInWithPopup(auth(), provider)
    return result.user
  } catch (e) {
    const err = toAuthError(e)
    if (err.code === 'credential-already-in-use') {
      // 기존 계정 자격 증명을 보관해 두면 확인 후 바로 로그인할 수 있다
      pendingGoogleCredential = GoogleAuthProvider.credentialFromError(e as Parameters<typeof GoogleAuthProvider.credentialFromError>[0])
    }
    throw err
  }
}

let pendingGoogleCredential: ReturnType<typeof GoogleAuthProvider.credentialFromError> = null

/** '이미 가입된 Google 계정' 안내를 사용자가 확인한 뒤 호출 — 게스트 기록은 승계되지 않는다 */
export async function signInWithExistingGoogle(): Promise<User> {
  requireConfigured()
  try {
    if (pendingGoogleCredential) {
      const result = await signInWithCredential(auth(), pendingGoogleCredential)
      return result.user
    }
    const { signInWithPopup } = await import('firebase/auth')
    const result = await signInWithPopup(auth(), new GoogleAuthProvider())
    return result.user
  } catch (e) {
    throw toAuthError(e)
  } finally {
    pendingGoogleCredential = null
  }
}

/**
 * 이메일 회원가입 — 익명 uid에 이메일 자격을 연결(linkWithCredential)하고 인증 메일을 보낸다.
 * 링크 성공 후 메일 발송만 실패할 수 있으므로(예: too-many-requests) 발송 결과를 분리해 돌려준다.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
): Promise<{ user: User; verificationSent: boolean }> {
  requireConfigured()
  const current = auth().currentUser
  if (!current) {
    throw new AuthError('unknown', '게스트 로그인이 아직 준비되지 않았어요. 잠시 후 다시 시도해 주세요.')
  }
  if (!current.isAnonymous) {
    throw new AuthError('unknown', '이미 로그인된 상태예요.')
  }
  let linked: User
  try {
    const credential = EmailAuthProvider.credential(email, password)
    linked = (await linkWithCredential(current, credential)).user
  } catch (e) {
    throw toAuthError(e)
  }
  // 가입(링크)은 이미 성공 — 메일 발송 실패는 가입 실패로 취급하지 않는다
  let verificationSent = true
  try {
    await sendEmailVerification(linked)
  } catch {
    verificationSent = false
  }
  return { user: linked, verificationSent }
}

/** 이메일 로그인 (기존 회원) — 현재 게스트 uid와는 연결되지 않음을 UI에서 고지할 것 */
export async function signInWithEmail(email: string, password: string): Promise<User> {
  requireConfigured()
  try {
    const result = await signInWithEmailAndPassword(auth(), email, password)
    return result.user
  } catch (e) {
    throw toAuthError(e)
  }
}

/** 인증 메일 재발송 */
export async function resendVerificationEmail(): Promise<void> {
  requireConfigured()
  const user = auth().currentUser
  if (!user || user.isAnonymous) throw new AuthError('unknown', '이메일 계정이 아니에요.')
  await sendEmailVerification(user).catch((e) => {
    throw toAuthError(e)
  })
}

/** 이메일 인증 여부 새로고침 (메일의 링크 클릭 후 사용) */
export async function refreshUser(): Promise<User | null> {
  if (!isConfigured()) return null
  const user = auth().currentUser
  if (user) await user.reload()
  return auth().currentUser
}

/** 로그아웃 — onAuthStateChanged가 즉시 새 익명 게스트를 만든다 */
export async function logout(): Promise<void> {
  requireConfigured()
  await signOut(auth())
}

/**
 * 회원탈퇴 (전 계정 — 게스트 포함).
 *
 * 순서가 중요하다:
 * 1) **재인증 먼저** — deleteUser는 최근 인증(약 5분)을 요구하므로, 데이터를 지우기 전에
 *    Google은 팝업 재인증, 이메일은 비밀번호 재인증을 통과시킨다.
 *    (데이터를 먼저 지웠다가 deleteUser가 실패하면 "데이터만 사라지고 계정은 남는" 최악의 상태가 된다)
 * 2) Firestore 본인 데이터(users/records/chats) 삭제 → Storage users/{uid}/ 삭제
 * 3) deleteUser
 * 익명 계정은 재인증 수단이 없다 — deleteUser가 만료로 실패하면 로그아웃으로 마무리한다
 * (민감 데이터는 이미 삭제됐고, 빈 익명 계정은 콘솔의 자동 정리 대상).
 *
 * @param passwordForReauth 이메일 계정 탈퇴 시 필수 (본인 확인)
 */
export async function deleteAccount(passwordForReauth?: string): Promise<void> {
  requireConfigured()
  const user = auth().currentUser
  if (!user) throw new AuthError('unknown', '로그인 상태가 아니에요.')

  const providerIds = user.providerData.map((p) => p.providerId)
  try {
    if (providerIds.includes('google.com')) {
      await reauthenticateWithPopup(user, new GoogleAuthProvider())
    } else if (providerIds.includes('password')) {
      if (!passwordForReauth) {
        throw new AuthError('password-required', '본인 확인을 위해 비밀번호를 입력해 주세요.')
      }
      if (!user.email) throw new AuthError('unknown', '계정의 이메일 정보를 찾을 수 없어요.')
      await reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(user.email, passwordForReauth),
      )
    }
  } catch (e) {
    throw e instanceof AuthError ? e : toAuthError(e)
  }

  await deleteAllMyData(user.uid)
  try {
    await deleteUser(user)
  } catch (e) {
    const err = toAuthError(e)
    if (err.code === 'requires-recent-login' && user.isAnonymous) {
      await signOut(auth())
      return
    }
    throw err
  }
}
