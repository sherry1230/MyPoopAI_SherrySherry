# 03 · 데이터 모델 (Firestore)

## 컬렉션 구조

```
users/{uid}
  profile          : AdultProfile
  babyProfile      : BabyProfile
  settings         : AppSettings
  createdAt, updatedAt

users/{uid}/records/{recordId}
  mode             : 'adult' | 'baby'
  recordedAt       : Timestamp
  score            : number        // 0~5, 0.5 단위
  comment          : string        // AI 코멘트
  maskedImagePath  : string        // Storage 경로 (가리기 처리본)
  originalImagePath: string        // Storage 경로 (본인만 접근)
  followUp         : { meals?, medications?, lactoseIntolerant?, note? }

analytics/{autoId}                 // 개인 식별 정보 제거
  mode, score, ageBand, feeding, colorTag, shapeTag, recordedMonth
```

## 저장 원칙

- 원본 이미지: Firebase Storage 암호화 저장, 보안 규칙으로 본인만 read
- 화면에 렌더하는 것은 **가리기 처리본**이 기본
- `analytics`에는 uid·이메일·정확한 생년월일 등 식별 정보를 절대 넣지 않는다
- 탈퇴 시 `users/{uid}` 전체 및 Storage 원본 즉시 삭제, `analytics`는 비식별 상태로 보존

## 게스트 모드

로그인 전에는 Firestore를 쓰지 않고 `src/lib/storage.ts`의 LocalStorage 레이어에만 저장한다.
로그인 시 기존 로컬 기록을 업로드해 병합한다.

## 보안 규칙 (초안)

```
match /users/{uid}/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
}
match /analytics/{doc} {
  allow read: if false;
  allow write: if request.auth != null;
}
```
