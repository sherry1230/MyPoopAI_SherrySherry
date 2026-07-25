# CLAUDE.md

Claude Code가 이 저장소에서 작업할 때 참고하는 프로젝트 지침서.

## 프로젝트 한 줄 요약

MyPoopAI(마이풉) — 대변 사진을 AI가 분석해 장 건강을 알려주는 반응형 웹앱.
사용자는 자기 대변을 보고 싶어하지 않으므로 **가리기(모자이크/스티커)가 기본 ON**이다.

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Frontend | React 18 + TypeScript + Vite (PWA) |
| 스타일 | Tailwind CSS (디자인 토큰 기반) |
| 카메라 | WebRTC + Canvas API (실시간 가리기) |
| AI 분석 | Claude Vision API (서버/함수 경유) |
| 인증 | Firebase Auth (이메일 / Google / 카카오) |
| DB | Firebase Firestore |
| 스토리지 | Firebase Storage |

## 명령어

```bash
npm run dev        # 개발 서버
npm run build      # 빌드
npm run lint       # 린트
npm run typecheck  # 타입 체크
```

작업을 마치면 최소한 `npm run typecheck`와 `npm run lint`는 통과시킬 것.

## 아키텍처 규칙

1. **탭 3개 구조**: `src/pages/CameraPage` / `HistoryPage` / `SettingsPage`. 새 화면은 이 3탭 안에 붙인다.
2. **게스트 우선**: 로그인 없이도 전체 기능이 동작해야 한다. 로그인은 동기화/백업 용도.
   미로그인 상태 데이터는 `src/lib/storage.ts`의 로컬 스토리지 레이어를 쓴다.
3. **Firebase 접근은 `src/lib/` 안에서만.** 컴포넌트에서 firestore를 직접 import 하지 않는다.
4. **AI 호출에 API 키를 클라이언트에 노출하지 않는다.** 반드시 Cloud Functions 등 서버 경유.
5. **이미지 원본은 화면에 그대로 띄우지 않는다.** 가리기 처리된 캔버스 결과만 렌더한다.

## 디자인 토큰 (필수)

색상은 `design/tokens/colors.ts`의 시맨틱 토큰만 사용한다. HEX 하드코딩 금지.

| 토큰 | HEX | 용도 |
| --- | --- | --- |
| `bg.base` | `#F4F0E6` | 앱/웹 기본 배경 |
| `bg.card` | `#E9E3D4` | 카드 · 박스 |
| `border.default` | `#D6CFBF` | 구분선 · 비활성 |
| `text.primary` | `#3B362F` | 본문 |
| `text.secondary` | `#6E655A` | 서브 텍스트 · 아이콘 |
| `text.placeholder` | `#A79E8F` | 플레이스홀더 |
| `text.heading` | `#221F1A` | 헤드라인 · 로고 (키컬러) |
| `accent.star` | `#E3C87E` | 별점 채움 |
| `accent.badge` | `#C9A227` | 하이라이트 · 뱃지 |
| `status.good` | `#7C7B45` | 양호 (별점 4↑) |
| `status.caution` | `#C1704A` | 주의 (2.5~3.5) |
| `status.warning` | `#8C4A3C` | 경고 (2↓) |
| `mode.adult` | `#7590A2` | 성인 모드 포인트 |
| `mode.baby` | `#BE8A8A` | 베이비 모드 포인트 |
| `action.link` | `#576F82` | 링크 · 액션 |
| `state.focus` | `#9D7F9B` | 선택 · 포커스 |

**금지색**: 분홍 · 파랑 · 그린 원색 계열. 음식을 연상시키면 안 된다.

## 반응형 (웹 우선)

| 브레이크포인트 | 범위 | 레이아웃 |
| --- | --- | --- |
| Mobile | ≤ 599px | 1컬럼, 하단 탭바 고정, 좌우 패딩 16 |
| Tablet | 600–1023px | max 720, 그래프+캘린더 2단 |
| Desktop | 1024–1439px | max 1080, 좌측 사이드 내비 |
| Wide | ≥ 1440px | max 1200, 사진 확대 뷰어 |

스페이싱 스케일: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64
라운드: 8(칩) / 12(카드) / 16(모달) / 999(버튼)
터치 타겟 최소 44px.

## 코드 컨벤션

- 컴포넌트 파일명 `PascalCase.tsx`, 훅 `useSomething.ts`, 유틸 `camelCase.ts`
- named export 우선 (`export function Foo`), default export는 페이지 컴포넌트만
- 주석과 UI 문구는 한국어. i18n 키는 영어 (`ko` / `en` 2개 로케일)
- 타입은 `src/types/index.ts`에 모아두고 재사용

## 하지 말 것

- 실제 사용자 사진 / 개인정보를 저장소에 커밋
- `.env` 커밋
- 디자인 토큰 무시하고 임의 색상 사용
- 로그인 강제 (게스트 사용이 기본이다)
- 원본(가리기 미적용) 이미지를 UI에 노출

## 문서

- `docs/00-product-overview.md` — 제품 개요, 수익 모델
- `docs/01-design-system-v0.4.md` — 컬러 시스템 전체
- `docs/02-screens.md` — 3탭 화면 상세 스펙
- `docs/03-data-model.md` — Firestore 구조
- `docs/04-roadmap.md` — 개발 단계
