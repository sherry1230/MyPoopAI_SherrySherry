# 05 · 개발 히스토리 (Dev Log)

작업할 때마다 최신 항목을 **맨 위에** 추가한다.
형식: 날짜 / 작업자(사람·AI) / 한 일 / 결정 사항 / 다음 할 일.

---

## 2026-07-25 — 초기 스캐폴드 완성 (Claude Code)

### 한 일

- **git 세팅**: remote `origin` → `https://github.com/sherry1230/mypoopai.git` 연결.
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
- **3탭 스캐폴드 확인**: 카메라(가리기 토글·촬영 버튼 자리) / 히스토리(그래프·캘린더·총평 자리) / 설정.

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
