/**
 * 탭 3 — 설정
 * 가리기 설정 / 건강 정보 등록 / 다운로드 / 언어 / 로그인 / 약관
 */
export default function SettingsPage() {
  const rows = [
    ['가리기 설정', '기본값 · 모자이크 or 스티커 · ON/OFF'],
    ['마이 건강 정보', '생년 · 복용약 · 유당불내증'],
    ['마이 베이비 건강 정보', '생일 · 수유 형태 · 알레르기'],
    ['기록 다운로드', '전체 · 날짜 선택 · 기간 (5,000원)'],
    ['언어', '한국어 / English'],
    ['로그인', '게스트 상태 · 이메일 / Google / 카카오'],
    ['개인정보 처리방침', 'AI 학습 데이터 활용 동의'],
  ]

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-ink-head">설정</h1>
      <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-bg-card">
        {rows.map(([title, desc]) => (
          <li key={title}>
            <button type="button" className="flex w-full flex-col items-start px-4 py-3 text-left">
              <span className="text-ink">{title}</span>
              <span className="text-xs text-ink-mute">{desc}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
