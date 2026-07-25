# MyPoopAI (마이풉)

> AI 기반 대변 건강 분석 모바일 웹앱. 사용자가 대변을 직접 보지 않아도 AI가 분석해준다.
> 카메라에서 변기/기저귀를 인식해 자동으로 모자이크 또는 캐릭터 스티커로 가린다.

- 도메인: `mypoopai.com` / `baby.mypoopai.com`
- 모드: 성인(My 💩) / 베이비(My Baby 💩)
- 기준: **반응형 웹 우선(Web-first)**, 이후 앱 출시(React Native 전환)

## 빠른 시작

```bash
npm install
cp .env.example .env      # 값 채우기
npm run dev
```

| 스크립트 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | ESLint |
| `npm run typecheck` | 타입 체크 |

## 폴더 구조

```
docs/            기획 문서 (제품 개요, 화면, 데이터 모델, 로드맵)
design/tokens/   디자인 토큰 (colors.json / colors.css / colors.ts)
design/exports/  피그마 export 에셋
src/pages/       카메라 · 히스토리 · 설정 3탭
src/components/  공통 UI 컴포넌트
src/lib/         firebase, storage, ai 등 인프라
src/types/       공용 타입
public/          PWA manifest, 아이콘
```

## 디자인

- Figma: https://www.figma.com/design/VuNgxrdndIy5cFRwg17UCK/mypoopai
- 컬러 시스템 v0.4 (레트로 세피아 · 페이퍼 아이보리). 자세한 내용은 `docs/01-design-system-v0.4.md`
- 코드에서는 반드시 `design/tokens/colors.ts`의 시맨틱 토큰을 쓴다. HEX 하드코딩 금지.

## 개인정보 원칙

- 원본 이미지는 Firebase Storage에 암호화 저장, 본인만 접근
- AI 학습용 데이터는 개인 식별 정보 제거 후 별도 컬렉션
- 탈퇴 시 원본 이미지 및 개인정보 즉시 삭제
- **실제 사용자 이미지는 절대 저장소에 커밋하지 않는다**

## 라이선스

Private. All rights reserved.
