# ject

Next.js 16 + TypeScript + pnpm 기반의 웹 프로젝트입니다.  
코드 품질은 **ESLint/Prettier + Husky + GitHub Actions + Git Flow**로 관리합니다.

## 전체 흐름 (Big Picture)

```text
로컬 개발
  ├─ ESLint + Prettier (저장/수동 실행)
  ├─ Husky pre-commit (lint-staged)
  ├─ Husky commit-msg (commitlint)
  └─ Git Flow 브랜치 (feature / release / hotfix)
        └─ GitHub PR  →  GitHub Actions CI (lint + build)  →  main 태그 → 배포
```

자세한 규칙은 다음 문서를 참고해주세요.

- 코드 스타일 & 설계: `docs/coding-convention.md`
- ESLint 규칙 상세: `docs/eslint-convention.md`
- 커밋 메시지 규칙: `docs/commit-convention.md`
- 브랜치 전략 & PR 플로우: `docs/workflow-and-gitflow.md`

## 개발 서버 실행

```bash
pnpm install
pnpm dev
```

브라우저에서 `http://localhost:3000`을 열어 결과를 확인할 수 있습니다.
