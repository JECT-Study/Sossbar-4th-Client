# 개발 워크플로우 & Git Flow

이 프로젝트는 **Next.js + TypeScript + pnpm**을 기반으로 하고, 브랜치 전략으로 **Git Flow**를 사용합니다.  
이 문서는 브랜치 구조와 흐름도, 브랜치 네이밍, `git flow` 명령어, 일상 개발 흐름, PR·머지 규칙을 정리합니다.  
커밋 컨벤션과 코드 스타일/ESLint 규칙은 각각 [`docs/commit-convention.md`](./commit-convention.md), [`docs/eslint-convention.md`](./eslint-convention.md), [`docs/coding-convention.md`](./coding-convention.md)를 참고하세요.

### 큰 흐름 (Big Picture)

코드 한 줄이 저장된 뒤, 브랜치를 거쳐 배포까지 도달하는 전체 흐름은 다음과 같습니다.

```text
로컬 개발
  │
  ├─ feature/* 또는 hotfix/* 브랜치
  │    ├─ ESLint/Prettier (로컬)
  │    ├─ Husky pre-commit (lint-staged)
  │    └─ Husky commit-msg (commitlint)
  │
  └─ GitHub PR (대상: develop 또는 main)
        │
        └─ GitHub Actions CI
             ├─ pnpm install --frozen-lockfile
             ├─ pnpm lint
             └─ pnpm build (Next.js + 타입체크)
                │
                └─ 브랜치 머지 (develop/main)
                     └─ 태그(main) → 배포
```

이 문서는 위 흐름 중 **Git 브랜치와 PR/머지 전략**에 집중합니다.

---

## 1. Git Flow 브랜치 전략

**Git Flow**는 항상 유지하는 브랜치 두 개(`main`, `develop`)와, 목적별로 생성·삭제하는 보조 브랜치(`feature`, `release`, `hotfix`)로 구성됩니다.

### 1.1 항상 유지하는 브랜치 (Long-lived)

| 브랜치      | 역할                                             | 규칙                                                                                        |
| ----------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| **main**    | **운영(프로덕션) 버전**. 배포된 코드만 존재.     | 직접 커밋·푸시 금지. `release/*`, `hotfix/*` 머지만 허용. 배포 시 태그 부여 (예: `v1.2.0`). |
| **develop** | **다음 릴리스 통합 브랜치**. 여기에 기능이 모임. | `feature/*` PR 머지 대상. `release/*`, `hotfix/*` 완료 후에도 머지받아 동기화.              |

### 1.2 보조 브랜치 (Supporting)

| 브랜치         | 분기 출처 | 머지 대상          | 용도                                                                                                                           |
| -------------- | --------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **feature/\*** | `develop` | `develop`          | 새 기능 개발. 이름은 **이슈번호-설명** 형식(이슈번호 우선). 예: `feature/123-add-product-form`. 완료 후 PR로 develop에만 머지. |
| **release/\*** | `develop` | `main` + `develop` | 배포 준비. **버전 번호**로 생성. 예: `release/1.2.0`. 완료 시 main 머지(태그) 후 develop에도 머지.                             |
| **hotfix/\***  | `main`    | `main` + `develop` | 운영 긴급 수정. 이름은 **이슈번호-설명** 형식(이슈번호 우선). 예: `hotfix/456-login-error`. 수정 후 main·develop 모두 머지.    |

### 1.3 흐름 요약

- **기능 개발**: `develop` → `feature/이슈번호-설명` 생성 → 개발 → **develop**으로 PR 머지. (main에는 절대 직접 머지하지 않음.)
- **배포**: `develop`이 준비되면 `release/1.2.0` 생성 → QA·수정 → **main** 머지 + 태그 → **develop**에도 머지 → release 브랜치 삭제.
- **긴급 수정**: **main**에서 `hotfix/이슈번호-설명` 생성 → 수정 → **main** 머지 + 태그 → **develop**에도 머지 → hotfix 브랜치 삭제.

### 1.4 흐름도 (ASCII)

**읽는 법**: ● = 커밋, 가로선 = 브랜치가 시간에 따라 진행되는 방향, `\` `/` = 브랜치가 갈라지거나 합쳐지는 지점. 왼쪽 → 오른쪽이 시간 흐름입니다.

---

#### (A) 정기 흐름: 기능 개발 → 배포 (feature → develop → release → main)

여러 기능이 develop에 쌓이고, 배포 시점에 **release 브랜치만 만든 뒤**, 그 브랜치에서 **QA·버전 수정 등을 모두 끝낸 다음** main에 머지합니다. release를 만들자마자 main에 머지하는 것이 아닙니다.

```
  시간 ─────────────────────────────────────────────────────────────────────►

  main        ●─────────────────●─────────────────●
               \                 \                 \          ← 두 번째 ●: release가 main에 머지된 결과 (develop X)
  release/*     \                 ●─────●          \          ← develop에서 갈라져 나옴 → QA·수정 후 main에 머지
                  \               ↑     ↑           \         ↑ 이 구간: release만 따로 QA·수정 후 끝나면 main에 머지
  develop          ●──●──●──●──●──●──●──●──●──●──●            (develop은 main에 머지하지 않음)
                        \ /     \ /     \ /
  feature/*              ●       ●       ●  ──────► develop   ← develop에서 갈라져 개발 후 PR로 develop에만 머지
```

**중요**: **develop은 main에 머지하지 않습니다.** main에 머지되는 것은 **release** 브랜치(또는 hotfix)뿐입니다. release에서 QA·수정을 끝낸 뒤 **release → main**으로 머지하고, 같은 **release → develop**으로도 머지해서 다음 개발에 반영합니다.

- **release의 `●─────●` 구간**: release 브랜치를 develop에서 만든 뒤, **그 브랜치 위에서만** QA·버전 bump·소규모 버그 수정 등을 하는 기간입니다. 이 작업이 **전부 끝난 뒤에** **release**를 main에 머지하고 태그를 붙입니다.

| 순서 | 무슨 일이 일어나는지                                                                                                                                      |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | **develop**에서 **feature** 브랜치가 여러 개 갈라져 나와 각각 개발됩니다.                                                                                 |
| 2    | feature 개발이 끝나면 **PR**로 **develop**에만 머지합니다. (main에는 절대 머지하지 않음.)                                                                 |
| 3    | 배포할 준비가 되면 **develop**에서 **release** 브랜치(예: `release/1.2.0`)를 **하나 만듭니다**. (이때는 아직 main에 머지하지 않음.)                       |
| 4    | **release 브랜치만** 따로 QA·버전 수정·소규모 버그 수정 등을 하고, **그 작업이 모두 끝나면** 비로소 **main**에 머지한 뒤 **태그**(예: `v1.0`)를 붙입니다. |
| 5    | 같은 내용을 **develop**에도 머지해서, release에서 수정한 내용이 다음 개발에도 반영되도록 합니다.                                                          |

---

#### (B) 긴급 수정: hotfix (운영 버그 수정)

이미 배포된 **main**에서 심각한 버그가 나왔을 때, main에서만 갈라져 수정하고 다시 main·develop에 반영하는 흐름입니다.

```
  시간 ─────────────────────────────────────────────────────────────────────►

  main        ●─────────────────●─────────────────●
                             \   \                 \          ← main에서 갈라져 수정 후
  hotfix/*                    ●──●──●              \              main에 머지 + 태그(v1.0.1)
                              \   \                 \              develop에도 머지
  develop          ●──●──●──●──●──●──●──●──●──●──●──●
```

| 순서 | 무슨 일이 일어나는지                                                                     |
| ---- | ---------------------------------------------------------------------------------------- |
| 1    | **main**(운영 브랜치)에서 **hotfix** 브랜치(예: `hotfix/456-login-error`)를 만듭니다.    |
| 2    | hotfix 브랜치에서 버그를 수정하고 커밋합니다.                                            |
| 3    | 수정이 끝나면 **main**에 머지한 뒤 **태그**(예: `v1.2.1`)를 붙이고, 운영에 재배포합니다. |
| 4    | 같은 수정 내용을 **develop**에도 머지해서, 다음 릴리스에 이 수정이 포함되도록 합니다.    |

---

**정리**: feature·release는 **develop**을 기준으로 돌고, hotfix만 **main**을 기준으로 돌며, main에 머지될 때마다 태그를 붙여 배포 버전을 구분합니다.

---

## 2. 설치 (git-flow-avh)

| 환경             | 명령어                                                                                                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| macOS (Homebrew) | `brew install git-flow-avh`                                                                                                                                                 |
| Ubuntu / Debian  | `sudo apt install git-flow`                                                                                                                                                 |
| Windows          | [Git for Windows](https://git-scm.com/download/win)에 포함된 경우 있음. 없으면 [별도 설치](https://github.com/petervanderdoes/gitflow-avh/wiki/Installing-on-Windows) 참고. |

설치 확인: `git flow version`

---

## 3. 최초 설정 (저장소당 1회)

이미 `main`, `develop` 브랜치가 있다면 초기화만 하면 됩니다.

```bash
git flow init
```

질문에는 기본값을 쓰면 됩니다 (Enter 연타).

| 질문                  | 권장값          | 설명              |
| --------------------- | --------------- | ----------------- |
| Production branch     | `main`          | 운영 브랜치 이름  |
| Development branch    | `develop`       | 통합 브랜치 이름  |
| Feature branch prefix | `feature/`      | 그대로            |
| Release branch prefix | `release/`      | 그대로            |
| Hotfix branch prefix  | `hotfix/`       | 그대로            |
| Support branch prefix | `support/`      | 사용 안 해도 됨   |
| Version tag prefix    | (비움 또는 `v`) | 태그 예: `v1.0.0` |

설정은 `.git/config`의 `[gitflow "..."]`에 저장됩니다.

---

## 4. 브랜치 네이밍 (이슈번호-설명 통일)

**feature**와 **hotfix** 브랜치는 **이슈번호-설명** 형식으로 통일합니다. prefix(`feature/`, `hotfix/`)는 git-flow가 자동으로 붙이므로, `start` 시 넣는 이름만 아래 규칙을 따릅니다.

| 브랜치 유형 | 이름 형식         | 예시                   | 비고                                                                                     |
| ----------- | ----------------- | ---------------------- | ---------------------------------------------------------------------------------------- |
| **feature** | **이슈번호-설명** | `123-add-product-form` | **이슈번호를 맨 앞에** 쓰고, 하이픈 뒤에 짧은 설명. 공백·대문자 대신 **하이픈(-)** 사용. |
| **release** | **버전 번호**     | `1.2.0`                | 시맨틱 버저닝. `release finish` 시 태그로도 쓰이므로 **숫자.숫자.숫자** 형태 유지.       |
| **hotfix**  | **이슈번호-설명** | `456-login-error`      | feature와 동일. **이슈번호 우선**, 그 뒤에 하이픈과 수정 내용.                           |

**이슈번호**는 팀에서 사용하는 이슈 트래커(GitHub Issues, Jira 등)의 **이슈 번호**를 그대로 앞에 씁니다. 무조건 이슈번호가 우선이고, 그 뒤에 하이픈과 짧은 설명을 붙입니다.

**공통**

- **공백 사용 금지** → 하이픈(`-`)으로 단어 구분.
- **설명 부분은 소문자** 권장 (feature, hotfix). release는 버전 번호만.
- 한글·특수문자 지양 → 영문+숫자+하이픈만 사용하면 로그·URL·CI에서 안전함.

실제 브랜치 이름 예 (prefix 포함):

- `feature/123-add-product-form`
- `release/1.2.0`
- `hotfix/456-login-error`

---

## 5. Feature (기능 개발)

PR로 **develop**에 머지하는 흐름을 기준으로 합니다. 브랜치 이름은 **이슈번호-설명** 형식입니다.

```bash
# 1) develop 최신화 후 feature 시작 (이름: 이슈번호-설명)
git checkout develop && git pull origin develop
git flow feature start 123-add-product-form

# 2) 개발 후 커밋
git add .
git commit -m "feat: 상품 등록 폼 추가"

# 3) 원격에 올려서 PR 생성
git flow feature publish 123-add-product-form
# 또는: git push -u origin feature/123-add-product-form

# 4) GitHub에서 develop 대상 PR 생성 → 리뷰 → 머지

# 5) PR 머지 후 로컬 정리: develop 가져오고 feature 브랜치 삭제
git checkout develop && git pull origin develop
git branch -d feature/123-add-product-form
# 원격 feature 브랜치는 GitHub PR 화면에서 "Delete branch" 하면 됨
```

| 명령어                                     | 설명                                                                           |
| ------------------------------------------ | ------------------------------------------------------------------------------ |
| `git flow feature start <이슈번호-설명>`   | `develop`에서 `feature/<이슈번호-설명>` 브랜치 생성 후 해당 브랜치로 체크아웃  |
| `git flow feature publish <이슈번호-설명>` | `feature/<이슈번호-설명>`을 origin에 푸시 (PR용)                               |
| `git flow feature finish <이슈번호-설명>`  | **로컬에서** feature를 develop에 머지하고 브랜치 삭제 (PR 쓰지 않을 때만 사용) |

---

## 6. Release (배포 준비)

release는 **버전 번호**만 사용합니다.

```bash
# 1) develop 최신화 후 release 시작 (이름: 버전번호)
git checkout develop && git pull origin develop
git flow release start 1.2.0

# 2) 필요 시 release 브랜치에서 버전 bump, QA, 소규모 수정 후 커밋
# ...

# 3) 완료: main에 머지 + 태그 생성, develop에도 머지, release 브랜치 삭제
git flow release finish 1.2.0
# 태그 메시지 입력 창이 뜨면 배포 버전 설명 입력 (예: Release 1.2.0)

# 4) main / develop 푸시 (태그 포함)
git push origin main develop
git push origin v1.2.0   # 태그 푸시
```

| 명령어                           | 설명                                                                     |
| -------------------------------- | ------------------------------------------------------------------------ |
| `git flow release start <버전>`  | `develop`에서 `release/<버전>` 브랜치 생성 (예: `1.2.0`)                 |
| `git flow release finish <버전>` | release를 **main**에 머지 + 태그 생성, **develop**에도 머지, 브랜치 삭제 |

---

## 7. Hotfix (운영 긴급 수정)

hotfix도 **이슈번호-설명** 형식으로 생성합니다.

```bash
# 1) main 최신화 후 hotfix 시작 (이름: 이슈번호-설명)
git checkout main && git pull origin main
git flow hotfix start 456-login-error

# 2) 수정 후 커밋
git add . && git commit -m "fix: 로그인 오류 수정"

# 3) 완료: main에 머지 + 태그, develop에도 머지, hotfix 브랜치 삭제
git flow hotfix finish 456-login-error
# 태그 이름 입력 (예: v1.2.1)

# 4) main / develop 푸시 + 태그 푸시
git push origin main develop
git push origin v1.2.1
```

| 명령어                                   | 설명                                                                      |
| ---------------------------------------- | ------------------------------------------------------------------------- |
| `git flow hotfix start <이슈번호-설명>`  | **main**에서 `hotfix/<이슈번호-설명>` 브랜치 생성                         |
| `git flow hotfix finish <이슈번호-설명>` | hotfix를 **main**에 머지 + 태그, **develop**에도 머지, hotfix 브랜치 삭제 |

---

## 8. 일상 개발 흐름 — 수동 Git

`git flow` 없이 일반 Git 명령만 쓸 때도 브랜치 이름은 **이슈번호-설명**으로 통일합니다.

```
1. develop 최신화
   git checkout develop && git pull origin develop

2. 기능 브랜치 생성 (이슈번호-설명)
   git checkout -b feature/123-add-product-form

3. 개발 후 로컬 검증
   pnpm install
   pnpm run lint
   pnpm run build

4. 커밋 (Git 훅이 자동 실행됨)
   git add .
   git commit -m "feat: 상품 등록 폼 추가"

5. 푸시 후 PR
   git push origin feature/123-add-product-form
   → GitHub에서 develop 대상 Pull Request 생성
```

---

## 9. PR · 머지 흐름

1. **feature → develop**  
   `feature/이슈번호-설명` 브랜치에서 PR 생성(대상: `develop`) → 리뷰 → CI 통과 → 머지.  
   feature는 **오직 develop으로만** 머지하며, main에는 머지하지 않음. 머지 후 feature 브랜치 삭제 권장.

2. **release → main, develop**  
   `release/버전` 브랜치에서 QA·버전 번호 확정 후:
   - **main**에 머지 → 배포 후 `main`에 태그 (예: `v1.2.0`).
   - **develop**에 머지 (release에서 변경한 내용이 develop에 반영되도록).
   - release 브랜치 삭제.

3. **hotfix → main, develop**  
   `hotfix/이슈번호-설명` 브랜치에서 수정 완료 후:
   - **main**에 머지 → 배포 후 `main`에 태그 (예: `v1.2.1`).
   - **develop**에 머지 (동일 수정이 다음 릴리스에도 포함되도록).
   - hotfix 브랜치 삭제.

---

## 10. 스스로 점검해볼 질문 (Why 5)

1. 지금 작업하고 있는 브랜치는 **이슈 번호와 목적이 브랜치 이름만으로 드러나는가?** (예: `feature/123-login-form`)
2. 이 변경은 **어느 브랜치에서 시작해 어디로 머지되는지** 명확한가? (develop 기반 feature인지, main 기반 hotfix인지)
3. PR을 올렸을 때, 리뷰어가 **Git Flow 상의 어느 위치에 있는 변경인지** 바로 이해할 수 있는가?
4. release/hotfix 머지 후에 **develop과 main이 항상 기대한 대로 동기화**되고 있는지 주기적으로 확인하고 있는가?
5. 브랜치/커밋/PR 제목만 보고도, 이 릴리즈에 포함될 변경 목록을 **자동으로 정리할 수 있을 만큼 일관성**이 있는가?
