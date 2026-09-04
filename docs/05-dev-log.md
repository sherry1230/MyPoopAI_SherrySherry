# 05 · 개발 히스토리 (Dev Log)

작업할 때마다 최신 항목을 **맨 위에** 추가한다.
형식: 날짜 / 작업자(사람·AI) / 한 일 / 결정 사항 / 다음 할 일.

---

## 2026-09-04 (2) — 충돌 3건 운영자 확정 반영 (쉐리쉐리)

### 확정 내용 (운영자)

1. **BM**: 사진 분석 1일 1회 무료 + **텍스트 기록·분석 무제한** ("설사냐 변비냐" 수준 분류라 저비용) — 구 v0.10 쿼터표 폐기
2. **저장**: **게스트 = 클라이언트 저장 / 회원 = Firestore 동기화** — 익명 uid·linkWithCredential 승계는 유지.
   현행 코드(게스트도 Firestore)는 클라이언트 저장으로 전환 필요 → 백로그 등록
3. **모바일 첫 화면**: 초기 1회(계정 생성·온보딩)는 기록 채팅 / **로그인 + 채팅 기록 있으면 카메라부터 자동 오픈**
   (아키텍처는 유지 — 기록 채팅 위 CameraSheet 자동 오픈)

### 한 일

- CLAUDE.md(규칙 1·3·8), docs/00·02·03·04·06 의 '충돌 메모'를 확정 내용으로 교체
- 04 로드맵 체크리스트에 전환 작업 2건 추가 (게스트 클라이언트 저장 / 재방문 카메라 오픈)

### 다음 할 일

- 게스트 기록 클라이언트 저장 전환 구현 (records.ts/storage.ts)
- 재방문 진입 분기 구현 (CameraSheet 자동 오픈)

---

## 2026-09-04 — 워크스페이스 재구성 + 닝겐 기획서(9/4판 PDF) 문서 반영 (쉐리쉐리)

### 한 일

- **워크스페이스 재구성**: 저장소 전체를 `MyPoop_SherrySherry/`로 이동(git 이력 보존 확인),
  형제 폴더 `HaemaAI_SherrySherry/` 신설(별도 git) — 장기기억(Haema.AI) 모듈 분리.
  CLAUDE.md에 규칙 12(Haema 분리 — memory.ts 인터페이스+목 → @haema/core 교체)와
  인스턴스 식별(쉐리쉐리/야옹이) 추가.
- **기획서 반영**: `docs/gdocs/인간이가 수정_ Mypoopai.com Overview.pdf`(42p, 9/4판) 전문을
  텍스트 추출·숙지 후 프로젝트 md 전면 동기화:
  - CLAUDE.md — 기준 문서 갱신, BM(1일 1회+광고+프리미엄 1,100원), 친밀도=노드수 확정,
    5-Brain 구조, v0.5 오로라 확정, 저장 정책 충돌 메모
  - 00 제품 개요 — 기획 의도·우선순위 4·프로필 3티어·병원 방문 기록·수익 모델 재작성
  - 01 디자인 — v0.5 오로라·뉴트로 확정 섹션(오로라 라인 CSS 확정값, 피피 아트 팔레트,
    캐릭터 아트 스타일), v0.4는 코드 현행으로 유지
  - 02 화면 — 기록(채팅) 본체 기준 재작성 + 온보딩 선체험 퍼널 + PC 웹 기억 관리 화면(웹 전용)
  - 03 데이터 모델 — 5-Brain 표·호출 조립 순서·Haema 노드 요지·프롬프트 외부화(/prompts/)·
    표현 사전 노드(everActualBlood 농담 봉인)·저장 정책
  - 04 로드맵 — AI 기억력 선행 검증 테스트 4종(기억력/문진/개인 언어/친밀도) 상세
  - 06 핸드오프 — 5-Brain·캐릭터 확정·BM·디자인·현재 상태 갱신
  - 07 페르소나 — §5 비주얼 아이덴티티(피피 아트 확정), §6 푸푸 친밀도 말투 Lv.1~4,
    §7 개인 언어 학습·안전 장치, §8 알림창 텍스트 파일 정책
  - README/docs README 인덱스 갱신

### 결정 사항 (기획서 확정 반영)

- 친밀도 = 장기기억 노드 수 (별도 스탯 없음, 노드 상한 무료 30/프리미엄 200 가안 = BM 결합)
- 이미지 분석 2단 파이프라인 (Vision 상위 모델 → 페르소나 경량 모델)
- 프롬프트 외부 파일 관리 (/prompts/*.md, 운영자 수정 즉시 반영)
- v0.5 오로라 라인 CSS 확정 — colors.css 토큰 리매핑은 별도 승인 후

### 미해결 충돌 (→ 당일 운영자 확정으로 해소, 위 (2) 항목 참조)

1. BM 쿼터: 9/4판(사진 분석 1일 1회) vs 구 v0.10(텍스트 무제한/이미지 3회/일반대화 3회)
2. 게스트 저장 위치: 9/4판 §6(게스트=클라이언트 저장 확정) vs 현행 구현(게스트 포함 Firestore)
3. 모바일 첫 화면: 9/4판 기능 요약(카메라 첫 화면 선체험 퍼널) vs 현행(기록 채팅 본체)

### 다음 할 일

- 충돌 3건 운영자 확정 → 해당 문서·코드 정리
- Haema 노드 스키마 v2(기획서 §2-1-1)를 HaemaAI_SherrySherry에 반영할지 확인
- src/lib/memory.ts 인터페이스+목 구현, /prompts/ 분리, colors.css v0.5 리매핑(승인 후)

---

## 2026-07-29 — Firebase 인증 + 기록 Firestore 전환 (Claude Code)

### 한 일

- **src/lib/auth.ts 신규**: 앱 진입 시 `initAuth()` — 유저 없으면 `signInAnonymously`로 게스트 uid
  자동 생성 (로그아웃/탈퇴 후에도 자동으로 새 게스트). AuthError 코드 매핑으로 UI 분기.
- **게스트→가입 = linkWithCredential 원칙 구현**: Google은 `linkWithPopup`, 이메일은
  `EmailAuthProvider.credential` + `linkWithCredential` — uid 유지, 기록 그대로 승계.
  이미 가입된 Google 계정(credential-already-in-use)이면 "기록 미승계" 경고 확인 후에만 기존 계정 로그인.
- **이메일 가입**: `sendEmailVerification` 필수. 미인증 시 설정 탭에 "메일 인증 대기" 배지 +
  재발송/인증 완료 확인 버튼. Apple 버튼은 자리만(비활성, 준비 중).
- **회원탈퇴 (전 계정, 게스트 포함)**: 설정 최하단, 2단계 확인 →
  Firestore 본인 데이터(users/{uid}, records, chats) 삭제 → Storage users/{uid}/ 재귀 삭제 → `deleteUser`.
- **히스토리 게스트 잠금**: 익명이면 "기록이 N개 쌓였어요 🔒" (Firestore count 쿼리) + [가입하고 열람하기]
  → 설정 탭 이동. 회원이면 Firestore에서 본인 기록 조회 렌더.
- **기록 저장 Firestore 전환**: `src/lib/records.ts` 신규 — [기록 저장] 확정 시 records 컬렉션에
  userId(익명 uid 포함) + serverTimestamp로 저장. storage.ts에서 records API 삭제 (설정·온보딩 전용).
- **보안 규칙 초안**: firestore.rules(본인 문서만, analytics 클라 접근 금지) + storage.rules(users/{uid}/만).
- **에뮬레이터**: firebase.json(auth 9099/firestore 8080/storage 9199/UI 4000),
  `VITE_USE_FIREBASE_EMULATOR=true`면 자동 연결.
- Firebase 미설정(.env 없음) 환경 방어: 전 기능 no-op/비활성, 앱은 게스트 로컬 모드로 정상 구동
  (브라우저 검증: 잠금 화면·설정 비활성·콘솔 무에러).

### 결정 사항

- records는 top-level 컬렉션 + userId 필드 (기획서 v0.5~ 스키마). 조회는 where(userId==)만 쓰고
  정렬은 클라이언트에서 — 복합 색인 없이 동작.
- 기존 회원 로그인(링크 아님)은 게스트 기록 미승계를 UI에 명시 고지.
- 탈퇴 시 데이터 삭제를 deleteUser보다 먼저 실행 (계정이 먼저 지워지면 데이터 삭제 주체가 사라짐).
  소셜 재인증 필요(requires-recent-login) 시 안내 후 재시도 유도.

### 멀티에이전트 리뷰(4관점×반박검증) 확정 결함 반영 — 중복 제거 후 8건

- [high] **탈퇴 순서 결함**: 데이터 선삭제 후 deleteUser가 requires-recent-login(로그인 5분 경과 시
  사실상 기본)으로 실패하면 "데이터만 사라지고 계정은 잔존" → **재인증을 데이터 삭제보다 먼저**로 수정
  (Google=팝업 재인증, 이메일=비밀번호 재인증 입력칸, 익명=만료 시 로그아웃 폴백)
- [high] 히스토리 1회성 페치로 세션 중 저장 기록 미반영 → 탭 활성화(active prop)마다 리페치 +
  계정 전환 시 이전 상태 폐기 + 경합 취소 가드
- [기록 저장] 더블탭 중복 문서 생성 → savingIds 가드 + "저장 중…" 비활성
- firestore.rules update가 userId 재할당(타인 히스토리에 기록 심기) 허용 → 재할당 금지 조건 추가
- signUpWithEmail: 링크 성공 후 메일 발송 실패를 가입 실패처럼 보고 → 분리 (verificationSent 반환),
  익명 로그인 미준비 상태 에러 문구 정정
- signInWithExistingGoogle: raw Firebase 에러 노출 + stale credential 미정리 → toAuthError + finally 정리
- 저장 실패 시 SDK 영문 에러가 채팅에 노출 → 한국어 일반 문구로 대체
- 문구: 입력창 하단 고지를 "의료 상담이 아닌 배변 기록용이에요."로 변경 (사용자 지시)

### 다음 할 일

- [ ] Firebase 콘솔에서 익명/Google/이메일 로그인 활성화 (사용자)
- [ ] .env 세팅 후 실기기/에뮬레이터 검증, users/{uid} 문서 생성(테마·캐릭터 동기화)
- [ ] Apple 로그인 (Developer Program 등록 후)
- [ ] Cloud Functions + Claude 연동 (더미 파서 대체)

---

## 2026-07-27 (2) — 기획서 동기화 체계 + 멀티에이전트 리뷰 반영 (Claude Code)

### 한 일

- **기획서 동기화 체계**: 사용자가 CLAUDE.md 개정 (기준 = `docs/gdocs/` 최신 기획서, 현재 **v0.10**).
  `.claude/commands/sync-docs.md` 명령 신설, 구글닥 폴더 → `docs/gdocs/` 초기 동기화 완료 (3파일).
  v0.10 신규: 엔티티 캐릭터별 분리 보관(entities.character), 기록 검색 연출("잠깐 기록 좀 볼게냥 📖"),
  가족 계정 보류 확정. docs/06도 v0.10 기준으로 갱신.
- **멀티에이전트 리뷰(4관점×반박검증) 확정 결함 15건 수정**:
  - [high] ChatInput Enter에 한글 IME 조합 가드 없음 → `isComposing` 가드 추가
  - [high] '저장됨' 칩 bg-badge+text-bg-base 라이트 대비 2.13:1 → bg-ink-head 칩으로 교체
  - CameraSheet 빠른 전환 토글이 전역 설정을 영구 덮어씀 → 세션 로컬 상태로 변경 (기본값은 설정 탭만)
  - CameraSheet 접근성: Escape 닫기 + 초기 포커스 + 드래그 릴리즈 오닫힘 가드 (풀 포커스 트랩은 TODO)
  - 탭 전환 시 채팅/미저장 카드 소실 → App에서 hidden 처리로 상태 보존 (언마운트 안 함)
  - 별점 수정만 해도 맨 아래로 스크롤 → 메시지 "추가" 시에만 스크롤
  - StarRating 편집 하한 0.5 → 0 허용 (스펙 0~5)
  - StatusDot 인라인 HEX → 상태 토큰 클래스 (다크 리매핑 적용)
  - 캐릭터 배지/안내문구/고지 대비 개선 (모드색은 도트로, ink-mute → ink-soft)
  - useTheme theme-color 메타 HEX 중복 → `--color-bg-base` 토큰에서 파생
  - 설정 탭 '로그인' 항목 구정책(카카오) 표기 → 4종+회원탈퇴로 갱신, docs/06 램프 수치 정정

---

## 2026-07-27 — 기획 대전환 반영: '기록' 채팅이 본체 (Claude Code)

### 배경

기획서가 v0.4 → **v0.9**로 크게 진화 (구글닥이 기준 원본 — 06-ai-handoff.md에 링크·요약).
카메라 중심 3탭 → **채팅이 곧 앱**. 게스트=로컬 저장 → **게스트=Firebase 익명 인증(서버 저장)**.

### 한 일

- **기준 문서 전면 갱신**: CLAUDE.md, docs/06-ai-handoff.md를 기획서 v0.9 기준으로 재작성.
  docs/00·02·03은 구버전 표시만 (기획서가 우선).
- **CameraPage → RecordPage 전환**: 채팅 UI (말풍선 리스트 + 하단 입력창 + 첨부(+)).
  더미 파서로 텍스트 → 기록 카드 생성 동작. TabKey 'camera' → 'record'.
- **신규 컴포넌트**: `ChatBubble`(냥이 좌/유저 우, 모드별 색), `ChatInput`,
  `RecordCard`(별점 0~5 · 0.5단위 수정, **[기록 저장] 확정 전 미저장**, 별점 수정 시 더미 코멘트 갱신),
  `CameraSheet`(구 CameraPage의 촬영/가리기 토글 UI를 첨부 플로우용으로 분리 보존).
- **StarRating 편집 모드** 추가 (탭/키보드로 0.5 단위, 기존 읽기 전용 호환).
- **다크 bg.base 수정**: `#232220` → `#221F1A` — 기획서 v0.6 §6.1 시안표 발견, 나머지 15개 토큰은
  기존 도출값과 일치했음. theme-color 메타도 동기화.
- **채팅 말풍선 토큰 신설** (`chat.*`): 라이트 v0.5 §3.1 / 다크 v0.6 §6.1 매핑. css/ts/json + tailwind 등록.
- **storage.ts 역할 축소**: 기기 프리퍼런스(설정·온보딩) 전용으로 명시, records API는
  Firestore 이관 전 과도기 용도로 @deprecated 표시. AppSettings에 character(pupu|pipi) 추가.
- **타입 확장**: ChatMessage, CharacterId, CharacterMeta(hasMet/firstMetAt), RecordType,
  RecordInputType, PoopRecord에 occurredAt/inputType/context 추가.

### 결정 사항

- 내부 파일명도 RecordPage로 (CameraPage 삭제 — git 히스토리에 보존, UI는 CameraSheet로 이동)
- HistoryPage는 이번 스코프 밖 — 아직 deprecated storage를 읽음. Firestore + 게스트 잠금 구현 시 교체
- 코드 브레이크포인트(600/1024/1440)와 기획서 v0.8(640/1024) 불일치 — 통일은 별도 작업으로 이월

### 다음 할 일

- [ ] Firebase 익명 인증 + linkWithCredential 전환 (uid 유지)
- [ ] Cloud Functions + Claude 연동 (더미 파서 대체 — intent 분기, greeting 서버 판정)
- [ ] 캐릭터 첫만남(hasMet)/전환 인수인계 실제 로직 + 온보딩(모드→캐릭터→로그인)
- [ ] CameraSheet에 WebRTC + Canvas 실시간 가리기 연결, 앨범 업로드 경로
- [ ] 히스토리: Firestore 조회 + 게스트 잠금 화면 + 대변/소변 세그먼트
- [ ] 테마 3택(시스템/라이트/다크 — 현재 2택), 일일 쿼터 카운트, 회원탈퇴
- [ ] 브레이크포인트 640/1024 통일 + 데스크톱 조회 전용 뷰어 정책 적용

---

## 2026-07-25 — 초기 스캐폴드 완성 (Claude Code)

### 한 일

- **git 세팅**: remote `origin` → `https://github.com/sherry1230/MyPoopAI.git` 연결.
  원격에 있던 2026-04-22 JSX MVP 히스토리는 사용자 결정으로 force push 덮어씀.
  `.gitignore` 보강 (`.env.*` 전체 차단 + `.env.example` 예외, 서비스 계정 키 패턴, `.firebase/`).
- **Vite + React + PWA**: `vite-plugin-pwa` 활성화 (`registerType: autoUpdate`,
  매니페스트는 기존 `public/manifest.webmanifest` 사용).
- **디자인 토큰 → CSS 변수 전역 등록**:
  - `design/tokens/colors.css`의 `:root`(라이트)에 더해 `[data-theme="dark"]` 다크 블록 추가.
  - `tailwind.config.js` 색상을 HEX 하드코딩 → `var(--color-*)` 참조로 전환.
    → 기존 유틸 클래스(`bg-bg-base`, `text-ink-head` 등)가 테마 전환에 자동 반응.
- **테마 토글**: `src/hooks/useTheme.ts` 신규.
  저장값(`mypoop.theme`) > OS `prefers-color-scheme` 순으로 초기화,
  `<html data-theme>` 갱신 + `theme-color` 메타 동기화.
  설정 탭 최상단에 라이트/다크 전환 버튼 연결, `App.tsx`에서 진입 시 적용.
- **3탭 스캐폴드 확인**: 기록(가리기 토글·촬영 버튼 자리) / 히스토리(그래프·캘린더·총평 자리) / 설정.
- **탭1 표기 변경**: '카메라' → '기록' (아이콘 📷 → 📝). 촬영뿐 아니라 AI 챗봇 대화
  (이상 소견 시 추가 질문)까지 이 탭에서 진행되기 때문. 내부 키/파일명(CameraPage)은 유지.

### 결정 사항

- **다크 팔레트는 문서에 시안표가 없어서 v0.4 램프에서 도출**했다
  (배경 gray800 `#232220`, 카드 sepia800 `#32291C`, 텍스트 gray100–500,
  상태색은 good→olive400, warning→러스트로 한 단계 밝게, 모드/링크/포커스는 300 램프).
  정식 다크 시안표가 나오면 `design/tokens/colors.css`의 `[data-theme='dark']` 블록만 갱신하면 된다.
- 데스크톱(md↑)에서 탭바는 좌측 사이드 내비로 전환 (docs/01 반응형 표 기준).

### 다음 할 일 (Phase 1 잔여)

- [ ] PWA 아이콘 파일 추가 (`public/icon-192.png`, `public/icon-512.png` — 현재 매니페스트만 참조 중)
- [ ] 온보딩 화면 (성인/베이비 선택 → LocalStorage)
- [ ] 카메라 WebRTC 스트림 + Canvas 실시간 모자이크
- [ ] 촬영 → AI 분석 호출 (서버 경유) → 별점/코멘트
- [ ] 히스토리 그래프 + 캘린더 실제 구현
- [ ] i18n (ko/en)

---

## 2026-09-01 · 디자인 반영 대기 (TODO)

### UI 배경 노이즈 텍스처 (누나 지시)
- **모든 UI 배경에 도트 같은 노이즈(그레인)를 남길 것.** 신문 인쇄 망점/지질 느낌 — 빈티지 뉴스페이퍼 콘셉트의 마감재.
- 라이트(#FEF6FF·화이트 계열)/다크(#0E1116) 공통 적용, 강도는 은은하게(콘텐츠 가독성 우선).
- 구현 후보: CSS로 SVG feTurbulence 노이즈 오버레이 or 타일링 PNG(가벼운 쪽 채택), 카드·말풍선 위가 아니라 **배경 레이어에만**.
- 피그마 시안에도 동일 텍스처 반영 필요 (목업 배경 + 톤앤매너 문서화).

### 피그마 미반영 배치 (MCP 쿼터 소진으로 대기, 스크립트 작성 완료)
- 아이콘 패널: 옛 라인 아이콘 잔재 삭제 + 인스턴스 40×40 통일
- 탭바(라이트·다크): 풀블리드 320×56 · #FEF6FF · CHAT/HISTORY/SETTINGS · 비활성은 라벨 숨김+아이콘 32px, 활성 24px+라벨
- 다크 목업 배경 #0E1116
- 🧩 하우스 스테이징 프레임 청소

### 2026-09-03 · 다음 피그마 쿼터 오픈 시 작업 (TODO)
1. 모드 뱃지의 💩 이모지 → 누나 제작 똥이모지로 교체. 에셋: `마이풉_리소스/1x/똥이모지.png` (현재 1x 20px — 4x 재내보내기 요청함, 벡터 복붙이 최선)
2. 라이트 탭바 좌측 여백 잔존 확인/제거 (탭 Fill 정렬 재검증)
3. 라이트 탭바 HISTORY/SETTINGS 텍스트 레이어 소실 → 재생성 (비활성 숨김 상태로)
