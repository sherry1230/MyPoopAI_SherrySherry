---
description: 구글닥 기획서 폴더를 docs/gdocs/로 동기화 (달라진 파일만)
---

구글닥에서 내보낸 기획서를 저장소로 동기화한다.

- 원본: `/Users/heewonjung/Documents/구글문서보관용_docs/myPoopAI_GoogleDoc`
- 대상: `docs/gdocs/`

절차:

1. 원본 폴더가 **존재하고 비어 있지 않은지** 먼저 확인한다.
   비어 있거나 없으면 **아무것도 하지 않고** 사용자에게 보고한다 (덮어쓰기·삭제 절대 금지).
2. `rsync -av --checksum` 으로 **내용이 달라진 파일만** 복사한다. 대상에만 있는 파일도 삭제하지 않는다:
   ```bash
   rsync -av --checksum "/Users/heewonjung/Documents/구글문서보관용_docs/myPoopAI_GoogleDoc/" "docs/gdocs/"
   ```
3. 복사된(변경된) 파일이 있으면:
   - 어떤 파일이 갱신됐는지 나열
   - 기획서 버전 헤더(예: v0.10)를 확인해 이전과 달라진 조항을 요약
   - **코드/CLAUDE.md와 충돌하는 변경이 있으면 차이를 보고하고, 적용은 승인 후 진행**
4. `docs/gdocs/` 안의 파일은 읽기 전용 — 이 저장소에서 직접 수정하지 않는다.
