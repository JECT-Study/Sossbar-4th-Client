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

## 환경 변수

```bash
cp .env.example .env.local
```

| 변수                             | 로컬 (cloudtype 실서버)                                  | Vercel (`youhayeong.shop`)                      |
| -------------------------------- | -------------------------------------------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`       | `https://port-0-ject5-4th-server-....sel3.cloudtype.app` | `https://youhayeong.shop`                       |
| `NEXT_PUBLIC_API_ORIGIN`         | cloudtype URL (끝 `/` 없이)                              | `https://youhayeong.shop`                       |
| `NEXT_PUBLIC_KAKAO_REDIRECT_URI` | `http://localhost:3000/api/v1/login/kakao`               | `https://sossbar.vercel.app/api/v1/login/kakao` |
| `NEXT_PUBLIC_MSW`                | 실서버 테스트 시 `false`                                 | (미설정, production에서 MSW 없음)               |

카카오 Redirect URI는 BE·카카오 콘솔과 **문자 그대로** 일치해야 합니다. `/api/v1/login/kakao` 로 들어오면 `next.config`가 `/login/kakao` 콜백 페이지로 연결합니다.

## Vercel 배포 (1차)

1. Vercel에서 GitHub 레포 연결, **Root Directory** = `Sossbar-4th-Client` (모노레포 루트가 상위일 때)
2. Framework: Next.js · Install: `pnpm install` · Build: `pnpm build` · Node **20**
3. **Production Branch**: `main` · **Preview**: `develop` (팀 합의에 맞게 조정)
4. Environment Variables에 `NEXT_PUBLIC_API_ORIGIN` 등록 (Preview / Production 각각)
5. MSW는 `development`에서만 동작합니다. Preview URL에서는 Mock이 없으므로 API 미연동 페이지는 빈 화면·에러가 날 수 있습니다.

백엔드 CORS에 `http://localhost:3000`, `https://*.vercel.app`(또는 고정 Preview URL) 허용이 필요합니다.
