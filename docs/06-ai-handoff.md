# 06 · AI 핸드오프 (다른 AI/채팅에 붙여넣는 컨텍스트)

> 이 파일 하나만 복사해서 Claude 채팅, ChatGPT 등 어떤 AI에게든 붙여넣으면
> 프로젝트 맥락을 바로 이해할 수 있도록 자기완결적으로 작성한다.
> 코드 작업이 진행되면 이 문서의 "현재 상태" 섹션을 갱신할 것. (최종 갱신: 2026-07-25)

## 프로젝트

**MyPoopAI(마이풉)** — 대변 사진을 AI가 분석해 장 건강을 알려주는 반응형 PWA 웹앱.
핵심 차별점: 사용자는 자기 대변을 보고 싶어하지 않으므로 **카메라가 켜지는 순간부터
모자이크/캐릭터 스티커로 가리는 것이 기본값(ON)**. 원본은 AI만 분석하고, 화면에는
가리기 처리본만 렌더한다.

- 모드: 성인(`My 💩`) / 베이비(`My Baby 💩`) — 무료 각 1개
- 게스트 우선: 로그인 없이 전 기능 동작 (LocalStorage), 로그인은 동기화/백업용
- 저장소: https://github.com/sherry1230/MyPoopAI

## 기술 스택

React 18 + TypeScript + Vite(PWA, vite-plugin-pwa) + Tailwind CSS.
Firebase(Auth/Firestore/Storage)는 `src/lib/` 안에서만 접근.
AI 분석은 Claude Vision API를 **서버(Cloud Functions) 경유**로만 호출 — 클라이언트에 API 키 금지.

## 구조 (탭 3개)

```
src/
  pages/CameraPage.tsx    # 탭1 '기록' — 가리기 토글, 촬영 → AI 분석 → 별점/코멘트,
                          #   이상 소견 시 추가 질문은 챗봇 대화 UI로 진행 (탭 표기는 '기록', 파일명은 CameraPage 유지)
  pages/HistoryPage.tsx   # 탭2 히스토리 — 별점 그래프(7/30일), 캘린더 도트, AI 7일 총평
  pages/SettingsPage.tsx  # 탭3 설정 — 가리기/건강정보/다운로드/언어/로그인 + 테마 토글
  components/             # TabBar(모바일 하단바·데스크톱 사이드내비), StarRating, StatusDot
  hooks/useTheme.ts       # 라이트/다크 토글 → <html data-theme> 갱신
  lib/storage.ts          # 게스트용 LocalStorage 레이어 (로그인 전 유일한 저장소)
  lib/firebase.ts         # Firebase 초기화 (컴포넌트에서 직접 import 금지)
  types/index.ts          # PoopRecord, AppSettings 등 공용 타입
design/tokens/colors.css  # 색상 CSS 변수 원본 — :root 라이트 + [data-theme="dark"] 다크
design/tokens/colors.ts   # 같은 토큰의 TS 버전 (statusColorByScore 등)
docs/00~06                # 제품 개요/디자인 시스템/화면/데이터 모델/로드맵/개발로그/이 문서
```

## 디자인 규칙 (v0.4 레트로 세피아)

- 색상은 **시맨틱 토큰만** 사용, HEX 하드코딩 금지. Tailwind 클래스가 CSS 변수를
  참조하므로 `bg-bg-base`, `bg-bg-card`, `text-ink`(본문), `text-ink-head`(헤드라인),
  `text-ink-soft`, `text-ink-mute`, `border-line`, `text-good/caution/warn` 등을 쓴다.
- 라이트: 배경 `#F4F0E6`(페이퍼 아이보리), 헤드라인 `#221F1A`(필름 블랙 = 키컬러).
- 다크: `[data-theme="dark"]`에서 배경 `#232220`, 카드 `#32291C` 등 램프에서 도출
  (정식 다크 시안표는 미정 — 나오면 colors.css 다크 블록만 교체).
- **금지색**: 분홍·파랑·그린 원색 (음식 연상 금지). 저채도 램프(올리브/데님/로즈)는 허용.
- 별점 0~5(0.5 단위) → 상태색: 4↑ 양호 `status.good` / 2.5~3.5 주의 `caution` / 2↓ 경고 `warning`.
- 반응형: ≤599 모바일(하단 탭바) / 600~ 태블릿(max 720) / 1024~ 데스크톱(좌측 내비, max 1080) / 1440~ 와이드(max 1200). 터치 타겟 44px+.

## 하지 말 것

- 원본(가리기 미적용) 이미지를 UI에 노출
- API 키 클라이언트 노출, `.env`/사용자 사진 커밋
- 로그인 강제 (게스트가 기본)
- 임의 색상 사용

## 현재 상태 (2026-07-25 기준)

- ✅ Vite+React+Tailwind+PWA 스캐폴드, 3탭 뼈대, 디자인 토큰 CSS 변수(라이트+다크), 테마 토글, LocalStorage 레이어, git remote 연결
- ⬜ 미구현: PWA 아이콘 png, 온보딩, 카메라 WebRTC+모자이크, AI 분석 연동, 히스토리 그래프/캘린더 실제 구현, i18n, Firebase 연동
- 실행: `npm install` → `npm run dev` (검증: `npm run typecheck` + `npm run lint`)

상세 이력은 `docs/05-dev-log.md` 참조.
