# 06 · AI 핸드오프 (다른 AI/채팅에 붙여넣는 컨텍스트)

> 이 파일 하나만 복사해서 Claude 채팅, ChatGPT 등 어떤 AI에게든 붙여넣으면
> 프로젝트 맥락을 바로 이해할 수 있도록 자기완결적으로 작성한다.
> 코드 작업이 진행되면 "현재 상태" 섹션을 갱신할 것. (최종 갱신: 2026-09-04)
>
> 제품 기준 원본: 구글닥 **닝겐 기획서** — 저장소 내 사본:
> `docs/gdocs/인간이가 수정_ Mypoopai.com Overview.pdf` (2026-09-04판, 읽기 전용, `/sync-docs`로 동기화).
> 구 v0.10 기획서의 후속이며, 5-Brain · Haema · 오로라 디자인 · 친밀도=노드수가 여기서 확정됨.

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

## BM (기획서 9/4판 기준)

- 사진 분석·저장: **1일 1회 무료**. 추가 분석 = 리워드 광고 시청.
  🎰 **3% 확률 광고 면제** — "오늘은 그냥 통과!" + 고양이 윙크 (변동비율 보상으로 광고 저항 완화)
- 프리미엄 (월 1,100원): 광고 제거 + 1일 분석 상한 상향(예: 1→5회).
  ⚠ 무제한 아님 — API 원가 방어 위해 일일 상한 유지
- 인앱결제(단건): 전체 데이터 내려받기. 데이터 내려받기는 일주일치 무료 / 전체 유료,
  원본 이미지 포함·불포함 토글 (가격 참고: 구버전 5,000원)
- **장기기억 노드 상한 = 친밀도 상한**: 무료 30 / 프리미엄 200 (가안).
  "푸푸랑 더 친해지고 싶으면" = 구독 전환 동기 — BM과 자연 결합
- 그 외: 배너 광고, B2B 비식별 데이터, 캐릭터 IP. 가족 계정은 보류 확정(v0.10)

> ⚠ 충돌 메모: 구 v0.10 쿼터표(텍스트 무제한 / 이미지 3회·일 / 일반대화 3회·일,
> greeting·별점 수정·7일 총평 미차감)와 9/4판(사진 분석 1일 1회)이 다르다.
> 운영자 확정 전까지 쿼터 코드는 착수 보류.

## 캐릭터 시스템

- **피피**(하얀 고양이·암컷·**갸루 퀸** — 반말 온리) / **푸푸**(검은 고양이·수컷·**뿔테 주치의** —
  하십시오체 온리). 보이스 바이블 확정: `docs/07-cat-persona-voice.md` (§4 압축본이 캐릭터 뇌 단일 기준)
- **피피 아트 확정 (2026-09-04)**: 한국 뉴트로 플랫 팝 프린트 스타일. 시그니처 = 갸루 윙
  아이라이너 모양 검은 털무늬 + 은색 링 귀걸이 2개 + 왼쪽 귀 끝 초승달 스터드 + 핑크 하트 볼 포인트.
  푸푸는 동일 포맷(캐릭터 블록만 교체)으로 진행 예정
- **친밀도 = 장기기억 노드 수 (확정, 푸푸 한정 말투 반영)**: 별도 스탯 없음. 노드 수 구간별
  말투 규칙표는 캐릭터 뇌에 고정(캐시 유지), 현재 노드 수만 동적 전달. Lv.1 하십시오체 →
  Lv.4 반존대 장난기. 위험 신호 시 수치 무관 Lv.1 정중 모드 즉시 복귀(불변)
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
- **이미지 분석 2단 파이프라인 (확정)**: 1단 Vision 분석(상위 모델 — 이미지→구조화 건강 데이터)
  → 2단 페르소나 렌더링(경량 모델 — 캐릭터 말투 출력). 분석 로직과 말투 분리(캐릭터를 바꿔도 분석 품질 동일)
- **AI 메모리 = 5-Brain (기획서 9/4판 §2-1 — 구 '뇌 3분할'을 대체)**:
  ① 서비스 뇌(매 호출 주입 — 정체성·프레-메디컬 조언·세션 정보·안전 규칙)
  ② 캐릭터 뇌(페르소나 — 07 §4 압축본 + 푸푸 친밀도, 캐릭터 전환 = 이 뇌만 교체)
  ③ 대화 맥락 뇌(API messages, 기본 6턴 — 정책은 턴 수·토큰 상한만)
  ④ **장기 기억 뇌 = 해마(Haema)** — 엔티티 노드, 관련 노드만 선별 주입(전체 주입 금지),
  Entity Resolution(canonicalName+aliases, mergedFrom 복원), 기억 관리는 PC 웹 전용 화면
  (챗에서 용량·정리 언급 금지). **Haema.AI로 모듈 분리** — 형제 폴더 HaemaAI_SherrySherry,
  이 저장소는 src/lib/memory.ts 인터페이스+목만
  ⑤ 배변 기록 저장 뇌(외장뇌 — 캘린더 형식, 문진 답변·병원 방문 체크 포함, 인쇄/다운로드 가능).
  조립 순서: ①+② 시스템 프롬프트 → ④ 노드 + ⑤ 기록 요약(선별) → ③ N턴 → 새 발화.
  tool use(기록_검색·기간_통계)로 실제 DB 조회(환각 방지) + patternSummary 배치 주입은 유지.
  v0.10 기억의 소유권 유지: 프로필·배변 기록·패턴은 캐릭터 공유, 일상 기억(엔티티)은 캐릭터별
  분리 보관(전환 시 삭제가 아니라 보관). 엔티티는 대화 로그와 동일 최고 보안 등급
- **프롬프트 외부화 (§2-4)**: 각 뇌 프롬프트는 /prompts/*.md 외부 파일 — 운영자가 파일만
  수정하면 즉시 반영, Git 이력으로 말투 롤백
- **기록 검색 연출 (v0.10)**: tool use 발동 시 캐릭터별 고정 문구("잠깐 기록 좀 볼게냥 📖")를
  중간 말풍선으로 즉시 표시 후 본 답변 렌더 — 검색 지연을 세계관으로 흡수. 문구는 AI 생성 아님(고정 세트)
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

- 레트로 세피아 v0.4 시맨틱 토큰 + 램프 (`design/tokens/colors.css`가 코드 원본 — 기획 컬러칩
  63색 중 코드에는 램프 40색 등록).
  **v0.5 오로라·뉴트로 확정 (기획서 9/4판)** — 아트 키워드: 빈티지 뉴스페이퍼 · 톤다운 · 뉴트로 ·
  네온사인(다크) · 오로라. 네온/오로라는 면(fill)이 아니라 선(line)에만. 오로라 라인 CSS 확정
  (59deg, 라이트 핑크·라벤더/하이라이트 #FFFFFF, 다크 블루/네온 시안 #4FE2FF, 다크 바탕 #1B1E23).
  토큰 리매핑은 별도 작업 — 상세: `docs/01-design-system-v0.4.md`
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
  lib/memory.ts           # (예정) Haema 인터페이스 타입 + 목 — 추후 @haema/core로 교체
  types/index.ts          # ChatMessage, PoopRecord, CharacterId 등
design/tokens/colors.css  # 색상 CSS 변수 원본 (라이트 + 다크 + 채팅 토큰)
docs/00~07                # 기획서 9/4판 기준으로 동기화(2026-09-04) — 충돌 시 gdocs 기획서 우선
../HaemaAI_SherrySherry   # 형제 저장소: Haema.AI (@haema/core) — 장기기억 모듈, 노드 스키마 v2 보유
```

## 하지 말 것

- 원본(가리기 미적용) 이미지 UI 노출 · API 키 클라 노출 · `.env`/사용자 사진 커밋
- 가입 강제 (게스트 즉시 사용이 기본 — 단 히스토리 잠금은 의도된 정책)
- [기록 저장] 확정 전 저장 · 아픈 똥 드립 · 대화 원문의 analytics/B2B 포함
- LocalStorage에 기록 저장 (기기 프리퍼런스만 허용)

## 현재 상태 (2026-09-04 기준)

- 🗂 **워크스페이스 재구성 (2026-09-04, 쉐리쉐리)**: 저장소가 `MyPoop_SherrySherry/`로 이동
  (git 이력 유지), 형제 폴더 `HaemaAI_SherrySherry/` 신설 — 장기기억(Haema.AI) 모듈 분리.
  이 저장소엔 엔티티 저장 로직을 직접 구현하지 않는다 (memory.ts 인터페이스+목 → @haema/core 교체 예정)
- 📘 **기획서 9/4판(닝겐 기획서 PDF) 반영**: 5-Brain 구조, 친밀도=노드수 확정, Haema 노드
  스키마 v2, v0.5 오로라 디자인 확정, 피피 아트 확정, 선행 검증 테스트 4종 — docs/00~07 전면 동기화.
  ⚠ 미해결 충돌 3건(BM 쿼터 / 게스트 저장 위치 / 모바일 첫 화면)은 각 문서의 '충돌 메모' 참조

- ✅ Vite+React+Tailwind+PWA 스캐폴드, 디자인 토큰 CSS 변수(라이트+다크), 테마 토글
- ✅ 기록 탭 채팅 UI (더미 파서): 말풍선, 입력창+첨부(+), 기록 카드(별점 수정·저장 확정), 카메라 시트
- ✅ **인증**: 진입 시 익명 게스트 자동 생성(`src/lib/auth.ts` initAuth), Google/이메일 전환은
  linkWithCredential(uid 유지·기록 승계), 이메일 인증 메일 필수+"메일 인증 대기" 배지, Apple 자리만,
  전 계정 2단계 회원탈퇴(Firestore users/records/chats + Storage users/{uid} 삭제 → deleteUser)
- ✅ **기록 저장 Firestore 전환**(`src/lib/records.ts`, 게스트=익명 uid) — storage.ts는 설정·온보딩만
- ✅ 히스토리 게스트 잠금 화면("기록이 N개 쌓였어요 🔒" + 가입 버튼), 회원이면 Firestore 기록 렌더
- ✅ firestore.rules/storage.rules(본인만 접근) + 에뮬레이터 연결(VITE_USE_FIREBASE_EMULATOR)
- ⬜ 미구현: Cloud Functions+Claude 연동(더미 파서 대체), 실제 카메라 WebRTC+가리기,
  히스토리 그래프/캘린더, 캐릭터 첫만남/전환 서버 로직, 쿼터 카운트, 온보딩, i18n, Apple 로그인
- 실행: `npm install` → `.env` 세팅(.env.example 참조) → `npm run dev`.
  Firebase 없이도 게스트 로컬 모드로 뜬다 (인증·저장만 비활성)

상세 이력은 `docs/05-dev-log.md`, 제품 상세는 구글닥 닝겐 기획서(9/4판 PDF, docs/gdocs/) 참조.
