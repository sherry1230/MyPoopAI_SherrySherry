// MyPoopAI Color System v0.4 — 자동 생성. design/tokens/colors.json 이 원본
// 코드에서 색상은 반드시 이 파일의 토큰을 통해 사용한다. HEX 하드코딩 금지.

export const color = {
  bg: {
    base: '#F4F0E6', // 페이퍼 아이보리 · 앱/웹 기본 배경
    card: '#E9E3D4', // 빈티지 크림 · 카드 · 박스 배경
  },
  border: {
    default: '#D6CFBF', // 웜 그레이지 · 구분선 · 비활성 UI
  },
  text: {
    placeholder: '#A79E8F', // 더스티 토프 · 플레이스홀더
    secondary: '#6E655A', // 스모크 브라운 · 아이콘 · 서브 텍스트
    primary: '#3B362F', // 잉크 차콜 · 본문 텍스트
    heading: '#221F1A', // 필름 블랙 · 키컬러 · 헤드라인 · 로고
  },
  accent: {
    star: '#E3C87E', // 페이디드 골드 · 별점 채움색
    badge: '#C9A227', // 레트로 머스터드 · 하이라이트 · 뱃지
  },
  status: {
    good: '#7C7B45', // 올리브 500 · 양호 (별점 4↑)
    caution: '#C1704A', // 번트 오렌지 · 주의 (2.5~3.5)
    warning: '#8C4A3C', // 브릭 레드브라운 · 경고 (2↓) · 알림
  },
  mode: {
    adult: '#7590A2', // 데님 400 · 성인 모드 포인트
    baby: '#BE8A8A', // 로즈 400 · 베이비 모드 포인트
  },
  action: {
    link: '#576F82', // 데님 500 · 링크 · 액션
  },
  state: {
    focus: '#9D7F9B', // 플럼 400 · 선택 · 포커스
  },
} as const

export const ramp = {
  gray: { 100: '#F5F4F1', 200: '#E6E4DF', 300: '#CFCCC5', 400: '#B3B0A8', 500: '#918E86', 600: '#6B6862', 700: '#45433E', 800: '#232220' },
  sepia: { 100: '#F0E8D9', 200: '#E0D3BB', 300: '#C9B694', 400: '#AD9670', 500: '#8C7754', 600: '#6B5A3E', 700: '#4C402C', 800: '#32291C' },
  rose: { 100: '#F4E6E4', 200: '#E5C9C6', 300: '#D3A9A7', 400: '#BE8A8A', 500: '#A06B6E', 600: '#7E5254' },
  olive: { 100: '#EFEDDA', 200: '#D8D4B0', 300: '#BBB786', 400: '#9C9A60', 500: '#7C7B45', 600: '#5D5C33' },
  denim: { 100: '#E4E9EC', 200: '#C0CDD6', 300: '#9AAEBC', 400: '#7590A2', 500: '#576F82', 600: '#3F5264' },
  plum: { 100: '#ECE4EC', 200: '#D5C4D5', 300: '#B99FB8', 400: '#9D7F9B', 500: '#7D5A78', 600: '#5C4058' },
} as const

export const catColor = {
  'cream.body': '#ECE2CE', // 크림냥 바디
  'cream.shade': '#C8B89B', // 크림냥 셰이드
  'gray.body': '#9A9288', // 그레이냥 바디
  'gray.shade': '#5F5A52', // 그레이냥 셰이드
  'black.body': '#2E2B27', // 블랙냥 바디
  'black.highlight': '#4A443C', // 블랙냥 하이라이트
  'nose': '#D3A9A7', // 코 · 발바닥
  'nose.mono': '#7A6A55', // 코 · 발바닥 모노톤
  'line': '#16140F', // 눈동자 · 외곽선
  'white': '#F7F3EA', // 수염 · 양말 (웜화이트)
} as const

export const breakpoint = {
  mobile: 0,
  tablet: 600,
  desktop: 1024,
  wide: 1440,
} as const

export const space = [4, 8, 12, 16, 24, 32, 48, 64] as const

export const radius = {
  chip: 8,
  card: 12,
  modal: 16,
  pill: 999,
} as const

/** 별점 -> 상태 색상 */
export function statusColorByScore(score: number): string {
  if (score >= 4) return color.status.good
  if (score >= 2.5) return color.status.caution
  return color.status.warning
}
