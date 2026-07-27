# 05 · 개발 히스토리 (Dev Log)

작업할 때마다 최신 항목을 **맨 위에** 추가한다.
형식: 날짜 / 작업자(사람·AI) / 한 일 / 결정 사항 / 다음 할 일.

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
