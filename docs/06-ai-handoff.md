# 06 · AI 핸드오프 (다른 AI/채팅에 붙여넣는 컨텍스트)

> 이 파일 하나만 복사해서 Claude 채팅, ChatGPT 등 어떤 AI에게든 붙여넣으면
> 프로젝트 맥락을 바로 이해할 수 있도록 자기완결적으로 작성한다.
> 코드 작업이 진행되면 "현재 상태" 섹션을 갱신할 것. (최종 갱신: 2026-07-27)
>
> 제품 기준 원본: 구글닥 기획서 v0.9 (2026-07-26)
> https://docs.google.com/document/d/1f4buwN0-JwSSj2IGMeYf82KHAtIyNRiuC7b6EFdAyqY/

## 프로젝트

**MyPoopAI(마이풉)** — 고양이 캐릭터와 채팅으로 배변·배뇨를 기록하는 AI 건강 기록 반응형 PWA.
**채팅이 곧 앱이다.** 고양이에게 문자 보내듯 기록한다. 텍스트가 필수 최소 단위, 이미지는
SMS처럼 선택 첨부. 카메라·앨범 이미지는 화면에 뜨기 전에 모자이크/스티커로 가린다(기본 ON) —
사용자는 어떤 경로로도 원본을 먼저 보지 않는다.

- 포지셔닝: 진단 도구가 아니라 **"병원 가야 하나 말아야 하나 애매한 구간"의 기록·참고 도구**.
  괜찮으면 근거를 들어 안심시키고, 위험 신호면 망설임 없이 병원행 권고. 면책 고지 상시.
- 핵심 타겟: 초보 부모(0~24개월) — **베이비 모드가 본체**. 보조: 병원 가기 애매한 성인, 암환자, 어르신.
- 저장소: https://github.com/sherry1230/MyPoopAI · 도메인: mypoopai.com / baby.mypoopai.com

## 화면 — 탭 3개: 기록 / 히스토리 / 설정

### 기록 탭 (본체 = 채팅 UI)

- 상대는 선택된 캐릭터(푸푸 or 피피). 유저: "어제 술 왕창 먹었더니 오늘 아침 설사했어"
  → AI가 파싱해 채팅 안에 **기록 카드** 생성: 발생 시각(occurredAt, 수정 가능) · 유형(대변/소변) ·
  컨텍스트(전일 음주 → meal 자동 기입) · **AI 제안 별점(0~5, 0.5단위) 미리 채움 → 유저가 수정** ·
  **[기록 저장] 확정 전에는 저장 안 함** (농담·회상이 기록을 오염시키지 않게) · 별점 수정 시 코멘트 갱신
- 이미지 첨부: 입력창의 **첨부(+) → 카메라/앨범 시트**. 카메라는 열리는 순간부터 가림 ON 디폴트,
  화면 내 가리기 ON/OFF + 모자이크↔스티커 토글. 앨범 업로드도 렌더 전 Canvas 가림.
  전송 → AI 분석 → 별점+코멘트가 기록 카드로 도착 (텍스트 기록과 동일 카드 UI)
- 위험 신호: 텍스트만으로도 emergency 발동(혈변·검은변·회백변·혈뇨 키워드, 연속 패턴).
  발동 시 드립 전면 중단, 병원 안내 최우선
- 드립: 별점 양호(4↑) + 위험 없음일 때만 1개. **운영자 관리 드립 풀(drips 컬렉션)에서 선택** —
  AI는 dripTag만 출력, 즉석 창작 금지. 아픈 똥은 절대 놀리지 않는다

### 히스토리 탭

대변/소변 세그먼트, 꺾은선 그래프(7일/30일, 별점 0~5), 캘린더 상태 도트(● 양호 / ◐ 주의 / ▲ 경고),
AI 7일 총평(기록 저장 시 1회 계산·저장, 조회 시 재사용), 기록 아이콘 📷/💬, 하단 배너 슬롯.
**게스트는 열람 차단** — 잠금 화면 "기록이 N개 쌓였어요, 가입하면 볼 수 있어요" (가입 유도 핵심 포인트).

### 설정 탭

가리기 설정 / 테마(시스템·라이트·다크 3택) / **캐릭터 전환(푸푸↔피피)** / 계정(연동 전환·로그아웃·**회원탈퇴**) /
드립 수위(진지 모드) / 소변 기록 ON/OFF / 마이·베이비 건강 정보 / 다운로드·진료 리포트(5,000원) / 언어 / 동의 관리

## 계정 체계 (확정)

- **Firebase Auth 4종: 익명(게스트) / Google / Apple / 이메일(인증 메일 필수).** 카카오는 백로그
- **게스트 = 익명 인증. 설치 즉시 uid 발급, 기록은 서버(Firestore) 저장** — LocalStorage 기록 정책 폐기
- 가입 전환은 **linkWithCredential로 uid 유지** → 기록·설정 마이그레이션 없이 그대로 승계.
  가입 즉시 잠겨 있던 히스토리가 열린다 (쌓인 기록이 보상)
- **전 계정(게스트 포함) 회원탈퇴 필수**: 원본 이미지·개인정보·대화 로그 즉시 삭제, analytics는 비식별 보존

## BM — 무료 일일 쿼터 (서버 카운트, 자정 리셋)

| 항목 | 무료 |
| --- | --- |
| 텍스트 기록 | **무제한** (제품의 본질, 건당 원가 ₩3) |
| 이미지 분석 | **3회/일** |
| 일반대화 (intent=chat/question) | **3회/일** |
| greeting·별점 수정·7일 총평 | 쿼터 미차감 |

초과 시: 리워드 광고 해금(Phase 4~) 또는 프리미엄 구독(무제한 + 푸푸·피피 동시 대화 + 광고 제거).
그 외: 배너 광고, 리포트/다운로드 5,000원(응급 리포트 1회 무료), B2B 비식별 데이터, 캐릭터 IP.

## 캐릭터 시스템

- **푸푸**(검은 고양이·수컷·쿨한 인싸 방향) / **피피**(하얀 고양이·암컷·사려 깊고 다정 방향).
  말투·성격 상세는 공란 — 운영자 작성 예정
- **캐릭터 ≠ 모드.** 전역 1마리 선택(`users.chatCharacter`), 언제든 전환. 4조합 모두 유효
- 첫만남: `users.characterMeta.{pupu|pipi} = { hasMet, firstMetAt }` — **서버가 판정**해
  isFirstMeeting 플래그로 전달, AI는 연출만. 첫만남 인사에 날짜 포함("오늘부터 1일"), 재소개 금지
- 전환 시 인수인계 연출(previousCharacter 주입). 무료 = 한 번에 한 마리, 유료 = 동시 대화(그룹챗)

## AI 아키텍처

- 클라(React) → **Cloud Functions(callable + App Check)** → Claude API(`claude-haiku-4-5`,
  위험/저신뢰 시 Sonnet 승격) → JSON → Firestore → 실시간 리스너. **API 키는 서버에만**
- 시스템 프롬프트 4블록: 공통(캐시) / 캐릭터 / 모드 / 동적 컨텍스트(시각·mode·character·
  isFirstMeeting·isFirstVisitToday·hasBabyProfile·previousCharacter·프로필·patternSummary·엔티티)
- 호출 6종: greeting / 대화 턴(intent 분기) / 이미지 분석 / 코멘트 갱신 / 7일 총평(저장 시 1회) / 야간 배치(Batch API)
- **AI 메모리 (v0.9 뇌 3분할)**: ① 프로필 뇌 — users.profile 매 호출 통째 주입 ② 배변 건강 뇌 —
  records + **tool use(기록_검색·기간_통계)로 실제 DB 조회** (환각 방지: 날짜를 지어내지 않는다) +
  패턴 요약 배치(users.patternSummary 상시 주입) ③ 엔티티 뇌 — entities 컬렉션(인물·사물 노드,
  이름 매칭 회수). 엔티티는 대화 로그와 동일 최고 보안 등급
- **평가 엔진 방침**: 파인튜닝 ❌ · 전문 MCP ❌ · 기성 엔진 구매 ❌ → **판정 기준표 프롬프트**
  (브리스톨 1~7, 색상 코드, 베이비 변 분류를 공통 블록에 명문화, 애매하면 aiConfidence 낮게 → 승격 재검증).
  유일한 커스텀 학습 = 기저귀 인식(가리기용, Roboflow)

## 플랫폼 — 기기별 역할

모바일(~640px) **풀 기능** / 태블릿(641~1024) 모바일 동일 / **데스크톱(1025px~) 조회 전용 뷰어**
(카메라·기록 입력 없음 — 열람·인쇄·리포트 자리. "기록은 모바일에서 📱" QR 안내).
시간은 createdAt(serverTimestamp)/occurredAt(유저 수정 가능) 이원 저장, 기기 타임존 표시.

## DB 스키마 요지 (Firestore)

- `users/{uid}`: loginType[anonymous|google|apple|email], linkedProviders[], plan[free|premium],
  chatCharacter[pupu|pipi], characterMeta{...hasMet,firstMetAt}, theme[system|light|dark],
  lastActiveDate, usage{date,imageCount,chatCount}, patternSummary{text,updatedAt},
  cameraSettings, profile.adult/baby(1회 입력, 탈퇴 시까지 보관), deletedAt 플로우
- `records/{id}`: recordType[stool|urine], inputType[photo|chat], createdAt/occurredAt,
  analysis{score,comment,bristolType|babyStoolType|urineColorCode,colorCode,alertLevel,riskFlags,aiConfidence},
  userInput{meal,medication,memo,feeding,condition,symptoms}, chatContext{conversationId,sourceExcerpt}
- `chats/{id}`: messages[]{role,text,at}, character, linkedRecordIds[] — 보존 기간 유저 설정
- `drips`: 드립 풀(운영자 시트 → Apps Script 동기화) / `entities`: v0.9 신규(인물·사물 노드)
- `analytics`: 비식별 전용(uid·이미지·자유 텍스트 절대 미포함) / `reports` / `consents`(분리 동의 감사 로그)

## 디자인

- 레트로 세피아 v0.4 시맨틱 토큰 16개 + 램프 63색 (`design/tokens/colors.css`가 코드 원본).
  **레트로 네온사인 v0.5 시안 검토 중** — 확정 시 토큰 리매핑 (별도 트랙, Figma 참조)
- 듀얼 테마 = 토큰 값 리매핑: `:root` 라이트 / `[data-theme="dark"]` 다크(기획서 v0.6 §6.1 시안 —
  bg `#221F1A`, 카드 `#32291C` 등). 컴포넌트는 토큰명만 참조. 리포트/인쇄는 항상 라이트
- 채팅 말풍선: 냥이 = 카드색, 유저 성인 = 데님(라이트 200/다크 500), 유저 베이비 = 로즈(라이트 200/다크 500).
  Tailwind는 CSS 변수를 참조하므로 `bg-bg-base`, `text-ink-head`, `bg-chat-user-adult` 등 클래스가 테마에 자동 반응
- 색 규칙: 원색·네온 등 고채도만 금지(v0.4에서 금지색 규정 폐지), 빛바랜 뮤트 톤만. 별점 0~5 →
  상태: 4↑ 양호 ● / 2.5~3.5 주의 ◐ / 2↓ 경고 ▲ (색+모양 병행, 색약 대응)

## 코드 구조 (현재)

```
src/
  pages/RecordPage.tsx    # 탭1 '기록' — 채팅 UI 본체 (말풍선, 입력창+첨부, 기록 카드)
  pages/HistoryPage.tsx   # 탭2 히스토리 — 그래프/캘린더/총평 자리 (게스트 잠금 예정)
  pages/SettingsPage.tsx  # 탭3 설정 — 테마 토글 등
  components/ChatBubble.tsx   # 말풍선 (캐릭터 좌 / 유저 우, 모드별 색)
  components/ChatInput.tsx    # 하단 입력창 + 첨부(+) + 전송
  components/RecordCard.tsx   # 채팅 내 기록 카드 (별점 수정, [기록 저장] 전 미저장)
  components/CameraSheet.tsx  # 첨부에서 열리는 카메라 시트 (가리기 토글 — 구 CameraPage에서 분리 보존)
  components/StarRating.tsx   # 별점 (읽기 + 편집 모드)
  components/TabBar.tsx       # 모바일 하단 탭바 / 데스크톱 사이드 내비
  hooks/useTheme.ts       # 라이트/다크 토글 → <html data-theme>
  lib/storage.ts          # 기기 프리퍼런스 전용 (설정·온보딩) — 기록 저장 용도 폐기
  lib/firebase.ts         # Firebase 초기화 (컴포넌트 직접 import 금지)
  types/index.ts          # ChatMessage, PoopRecord, CharacterId 등
design/tokens/colors.css  # 색상 CSS 변수 원본 (라이트 + 다크 + 채팅 토큰)
docs/00~06                # 00·02·03은 구버전 스펙 — 기획서 v0.9가 우선
```

## 하지 말 것

- 원본(가리기 미적용) 이미지 UI 노출 · API 키 클라 노출 · `.env`/사용자 사진 커밋
- 가입 강제 (게스트 즉시 사용이 기본 — 단 히스토리 잠금은 의도된 정책)
- [기록 저장] 확정 전 저장 · 아픈 똥 드립 · 대화 원문의 analytics/B2B 포함
- LocalStorage에 기록 저장 (기기 프리퍼런스만 허용)

## 현재 상태 (2026-07-27 기준)

- ✅ Vite+React+Tailwind+PWA 스캐폴드, 디자인 토큰 CSS 변수(라이트+다크), 테마 토글
- ✅ 기록 탭 채팅 UI (더미 데이터): 말풍선, 입력창+첨부(+), 기록 카드(별점 수정·저장 확정), 카메라 시트
- ⬜ 미구현: Firebase 익명 인증/linkWithCredential, Cloud Functions+Claude 연동, 실제 카메라
  WebRTC+가리기, 히스토리 그래프/캘린더/게스트 잠금, 캐릭터 첫만남/전환 로직, 쿼터, 온보딩, i18n
- 실행: `npm install` → `npm run dev` (검증: `npm run typecheck` + `npm run lint`)

상세 이력은 `docs/05-dev-log.md`, 제품 상세는 구글닥 기획서 v0.9 참조.
