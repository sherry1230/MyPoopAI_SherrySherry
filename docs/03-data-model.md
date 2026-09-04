# 03 · 데이터 모델 (Firestore) + AI 뇌 구조

> 기준: 기획서 9/4판 §2(5-Brain) · §5(데이터 구조) · §6(정책). 충돌 시 기획서 우선.

## 뇌 구조: 5-Brain (기획서 §2-1)

피피/푸푸의 사고는 5개의 뇌로 구성된다. ①②는 매 호출 주입되는 고정 프롬프트,
③은 API 기본 기능, ④⑤는 저장소에서 **선별 주입**되는 데이터 뇌다.

| 뇌 | 성격 | 내용 |
| --- | --- | --- |
| ① 서비스 뇌 | 시스템 프롬프트 고정부 | 정체성(일상 친근 대화 + 프레-메디컬 조언 — "병원 갈 정도인가, 식습관 개선으로 충분한가"), 배변·위장 활동 내용의 캘린더 정리 지시, 세션 기본 정보(닉네임·현재 시각·모드), 안전 규칙(질병명 단정 금지 · 위험 신호 시 병원 권유 · 나쁜 결과 드립 금지) |
| ② 캐릭터 뇌 | 시스템 프롬프트 페르소나부 | 피피/푸푸 말투·성격 (단일 기준: `docs/07-cat-persona-voice.md` §4 압축본) + 친밀도 반영(푸푸 한정). 서비스 뇌는 공유, 캐릭터 뇌만 교체하면 캐릭터 전환 |
| ③ 대화 맥락 뇌 | API messages | 직전 N턴(기본 6턴)을 매 호출 전달. 정책으로 정할 것은 턴 수·토큰 상한뿐 |
| ④ 장기 기억 뇌 = **해마(Haema)** | 클라이언트 우선 + 회원 동기화 | 엔티티 노드(단어·대명사·고유명칭 퍼스널라이징). 관련 노드만 선별 주입(전체 주입 금지). **Haema.AI로 분리** — 형제 폴더 `HaemaAI_SherrySherry` 담당 |
| ⑤ 배변 기록 저장 뇌 | 클라이언트 우선 + 회원 동기화 | 외장뇌(인쇄 가능). 캘린더 형식: 날짜별 분석 결과 + 문진 답변(followUp) + 병원 방문 체크. 엑셀/PDF 다운로드 가능 형태. 문진·장기 추적·다운로드 상품의 원천 데이터 |

**호출 시 조립 순서**: 서비스 뇌 + 캐릭터 뇌(시스템 프롬프트) → 단어집 관련 노드 + 배변
기록 요약(선별 주입) → 대화 맥락 N턴(messages) → 유저의 새 발화.

**친밀도 = 장기기억 노드 수 (확정)**: 별도 친밀도 스탯 없음. ④의 엔티티 노드 수가 곧
친밀도("친하다는 것 = 서로 기억하는 것이 많다는 것"). 노드 자동 정리·삭제 시 친밀도도
자연 감소. 무료 상한 30 = 친밀도 상한 → 프리미엄 200 (가안, BM 결합).

**프롬프트 관리 (기획서 §2-4)**: 각 뇌의 프롬프트는 코드와 분리된 외부 파일로 관리 —
`/prompts/service-brain.md`, `/prompts/character-pupu.md`, `/prompts/character-pipi.md`.
운영자가 파일만 수정하면 다음 호출부터 반영(배포 불필요), Git으로 이력 추적(말투 롤백).
조립기(마더보드)가 호출 시점에 파일을 읽어 시스템 프롬프트로 결합.

## 장기 기억 — Haema 노드 (④)

이 저장소는 엔티티 저장 로직을 직접 구현하지 않는다. `src/lib/memory.ts`에 인터페이스
타입 + 목(mock)만 두고 추후 `@haema/core` 설치로 교체 (CLAUDE.md 규칙 12).

- **노드 스키마 v2 전문**: 형제 폴더 `HaemaAI_SherrySherry/docs/SCHEMA-v2.md` (기획서 §2-1-1)
- 요지: canonicalName + aliases(별칭 통합) / type 개방형 + tags / summary·facts·events /
  links(weight 기반 연상 네트워크 — 회상 기본 1홉·최대 2홉·상위 N개·토큰 상한) /
  mentionCount·lastMentioned·recallCount / pinned(정리 면제) / status(active·archived·merged) /
  mergedFrom(오병합 복원) / **meta(서비스별 확장 — Haema는 해석 안 함)** / ownerId·sourceService
- 마이풉이 meta에 장착하는 것: 안전 플래그 등. 예 — 유저 개인 표현 사전 노드:
  `{expression: "피똥", learnedMeaning: "음주 후 심한 설사(과장 표현)", occurrences: 4, everActualBlood: false}`
  → `everActualBlood=true`가 된 유저에겐 해당 표현 교정 농담 봉인 (안전 마지노선)
- **엔티티 통합(Entity Resolution)**: AI가 동일인 단서 감지 → 확신도 높으면 자동 병합 +
  자연스러운 확인 발화("잠깐, 핑크가 박혜정이야?!") / 애매하면 병합하지 않고 되묻기.
  병합 시 events 합치기 + 언급 횟수 합산 + aliases 추가. mergedFrom 보존 → 분리 복원 가능
- **관리 정책**: 기억 관리는 채팅에서 하지 않는다(웹 전용 화면 — 02 참조). 통합·갱신은
  백그라운드 자동. 상한 초과 시 언급 빈도·최신성 낮은 노드부터 자동 정리(archived — 삭제
  아님, 재언급 시 부활). 핀 노드는 영구 면제

## Firestore 컬렉션

```
users/{uid}
  loginType        : anonymous | google | apple | email   (카카오는 백로그)
  linkedProviders[] , plan: free | premium
  chatCharacter    : pupu | pipi                          (전역 1마리)
  characterMeta    : { pupu|pipi: { hasMet, firstMetAt } } (첫만남 서버 판정)
  theme, lastActiveDate, usage{date,imageCount,chatCount}
  patternSummary   : { text, updatedAt }                  (야간 배치 갱신)
  cameraSettings   : { coverType: mosaic|sticker, stickerSet, coverEnabled }
  profile.adult    : { 나이·성별·키·몸무게(필수 티어) + 음주 빈도·복용약·기저질환·생리 주기(선택 티어) + 확장 슬롯 예약 }
  profile.baby     : { name, birthDate, feedType[breast|formula|mixed|weaning], weaningStart }
  createdAt, deletedAt 플로우

records/{recordId}                       ← ⑤ 배변 기록 저장 뇌
  userId, mode: adult|baby, recordType: stool|urine, inputType: photo|chat
  createdAt(serverTimestamp) / occurredAt(유저 수정 가능) — 표시는 기기 타임존
  imageRef(원본, 본인만) / imageCoveredRef(가림 처리본) / coverEnabled
  analysis { score(0~5, 0.5단위), comment, drip, color, shape(브리스톨),
             alertLevel[normal|caution|warning], riskFlags, aiConfidence, followUpQs[] }
  userInput { meal, medication, memo, feeding, condition, symptoms }
  followUp  { 문진 답변 }
  hospitalVisit { visited, date, note }   ← 병원 방문 체크 (호전/악화 기준점)
  chatContext { conversationId, sourceExcerpt }

chats/{id}        : messages[]{role,text,at}, character, linkedRecordIds[] — 보존 기간 유저 설정
drips             : 운영자 관리 드립 풀 (AI는 선택만, 즉석 창작 금지)
reports, consents : 리포트 / 분리 동의 감사 로그

analytics/{docId}                        ← 비식별 빅데이터 전용
  createdAt, mode, score, color, shape, feedType(베이비만), ageGroup(연령대만), region(국가 코드만)
  // uid · 이미지 · 자유 텍스트 절대 미포함. 개인 식별 불가
```

## 저장 정책

- 원본 이미지: Firebase Storage 암호화 저장, 보안 규칙으로 본인만 read. 화면 렌더는 가림 처리본이 기본
- 탈퇴 시 `users/{uid}` 전체 · Storage 원본 · 대화 로그 즉시 삭제, analytics는 비식별 보존
- 비용 방어: 이미지 업로드는 쿼터 정책으로 제한(BM = 비용 방어막). 규모 확대 시 이미지
  스토리지만 저가 대안(R2 등) 이전 검토
- **게스트 = 클라이언트 저장 / 회원 = Firestore 동기화 (2026-09-04 운영자 확정)**.
  게스트 신원은 Firebase 익명 인증(uid). 가입 전환 = `linkWithCredential`로 uid 유지 +
  클라이언트 기록 업로드 승계. 회원가입 유인: "기기 바꿔도 기록과 단어집이 그대로" =
  동기화가 곧 가입 보상
- ⚠ 코드 전환 필요: 현행 구현(7/29)은 게스트 기록도 Firestore에 저장 → 게스트 기록을
  클라이언트 저장으로 되돌리는 작업이 백로그에 있다 (`src/lib/records.ts` · `storage.ts`)

## 보안 규칙 (현행 초안)

```
match /users/{uid}/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
}
match /analytics/{doc} {
  allow read: if false;
  allow write: if request.auth != null;
}
```
