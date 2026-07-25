/**
 * Firebase 초기화. 컴포넌트에서 firestore/storage 를 직접 import 하지 않는다.
 * 반드시 이 모듈이 노출하는 함수를 거친다.
 */
import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let app: FirebaseApp | null = null

export function isConfigured(): boolean {
  return Boolean(config.apiKey && config.projectId)
}

export function getApp(): FirebaseApp {
  if (!isConfigured()) throw new Error('Firebase 환경변수가 설정되지 않았습니다 (.env 확인)')
  if (!app) app = initializeApp(config)
  return app
}

export const auth = (): Auth => getAuth(getApp())
export const db = (): Firestore => getFirestore(getApp())
export const bucket = (): FirebaseStorage => getStorage(getApp())
