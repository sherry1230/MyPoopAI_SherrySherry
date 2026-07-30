/**
 * 기록 저장 레이어 — Firestore (게스트 포함, 익명 uid 기준).
 * LocalStorage 기록 저장 정책은 폐기됐다 — 기록은 처음부터 서버에 쌓는다.
 * 스키마: records/{recordId} (top-level, userId 필드) — 기획서 v0.5~ DB 스키마.
 */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { deleteObject, listAll, ref } from 'firebase/storage'
import { auth, bucket, db, isConfigured } from './firebase'
import type { PoopRecord } from '@/types'

function currentUid(): string {
  const uid = auth().currentUser?.uid
  if (!uid) throw new Error('로그인 상태가 아니에요 (익명 로그인 대기 중일 수 있어요).')
  return uid
}

/** undefined 필드는 Firestore가 거부하므로 제거 */
function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T
}

/** 기록 저장 ([기록 저장] 확정 시에만 호출) */
export async function saveRecord(record: PoopRecord): Promise<string> {
  if (!isConfigured()) throw new Error('Firebase 미설정 — .env를 확인해 주세요.')
  // 로컬 임시 id는 버리고 Firestore 문서 id를 쓴다
  const data: Partial<PoopRecord> = { ...record }
  delete data.id
  const docRef = await addDoc(collection(db(), 'records'), {
    ...stripUndefined(data),
    userId: currentUid(),
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

/** 내 기록 전체 조회 (클라이언트 정렬 — 복합 색인 없이 동작) */
export async function fetchMyRecords(): Promise<PoopRecord[]> {
  if (!isConfigured()) return []
  const snap = await getDocs(query(collection(db(), 'records'), where('userId', '==', currentUid())))
  const list = snap.docs.map((d) => ({ ...(d.data() as PoopRecord), id: d.id }))
  return list.sort((a, b) => (b.occurredAt ?? b.recordedAt).localeCompare(a.occurredAt ?? a.recordedAt))
}

/** 내 기록 개수 (히스토리 잠금 화면의 "기록이 N개 쌓였어요") */
export async function countMyRecords(): Promise<number> {
  if (!isConfigured()) return 0
  const snap = await getCountFromServer(
    query(collection(db(), 'records'), where('userId', '==', currentUid())),
  )
  return snap.data().count
}

/** 컬렉션에서 내 문서 전부 삭제 */
async function deleteMyDocsIn(collectionName: string, uid: string): Promise<void> {
  const snap = await getDocs(query(collection(db(), collectionName), where('userId', '==', uid)))
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)))
}

/** Storage의 내 폴더(users/{uid}/) 재귀 삭제 */
async function deleteMyStorageFolder(uid: string): Promise<void> {
  async function deleteFolder(path: string): Promise<void> {
    const listing = await listAll(ref(bucket(), path))
    await Promise.all(listing.items.map((item) => deleteObject(item)))
    await Promise.all(listing.prefixes.map((p) => deleteFolder(p.fullPath)))
  }
  try {
    await deleteFolder(`users/${uid}`)
  } catch (e) {
    // 폴더가 없거나 Storage 미사용이면 무시 — 탈퇴 흐름을 막지 않는다
    console.warn('Storage 폴더 삭제 건너뜀:', e)
  }
}

/**
 * 회원탈퇴용 — 본인 데이터 전부 삭제.
 * Firestore(users/{uid} 문서, records, chats) → Storage(users/{uid}/) 순서.
 */
export async function deleteAllMyData(uid: string): Promise<void> {
  if (!isConfigured()) return
  await deleteMyDocsIn('records', uid)
  await deleteMyDocsIn('chats', uid)
  await deleteDoc(doc(db(), 'users', uid)).catch(() => {
    /* users 문서가 아직 없으면 무시 */
  })
  await deleteMyStorageFolder(uid)
}
