---
name: gitflow
description: Sossbar Git Flow 워크플로우 실행 스킬. "이슈 만들어줘", "브랜치 만들어줘", "PR 만들어줘", "feature 시작해줘", "hotfix 시작해줘", "작업 시작해줘", "이슈 번호 {N}으로 브랜치 만들어줘", "커밋하고 PR 올려줘" 등 Git Flow 관련 작업 요청이면 반드시 이 스킬을 사용할 것. 이슈 생성 → 브랜치 생성 → PR 생성의 전체 워크플로우 또는 개별 단계도 처리한다.
---

# Git Flow 워크플로우 스킬

Sossbar의 이슈 → 브랜치 → PR 워크플로우를 실행한다.
모든 작업은 **이슈 → 브랜치 → PR 순서**를 따른다.

## 워크플로우 판단

사용자 요청에서 실행할 단계를 파악한다:

| 요청 유형                           | 실행 단계                          |
| ----------------------------------- | ---------------------------------- |
| "이슈 만들어줘"                     | Step 1만                           |
| "브랜치 만들어줘" (이슈번호 있음)   | Step 2만                           |
| "feature/hotfix 시작해줘"           | Step 1 → Step 2                    |
| "PR 만들어줘"                       | Step 3만                           |
| "작업 시작해줘" / "이슈부터 PR까지" | Step 1 → Step 2 → (구현 후) Step 3 |

---

## Step 1: 이슈 생성

### 템플릿 선택

| 템플릿                | 사용 시점                            |
| --------------------- | ------------------------------------ |
| `feature_request.yml` | 새 기능, 새 페이지, 신규 도구/인프라 |
| `enhancement.yml`     | 기존 기능 개선, 성능 향상            |
| `refactor.yml`        | 코드 구조 개선, 기술 부채            |
| `hotfix.yml`          | 프로덕션 긴급 버그 수정              |

### 이슈 제목 형식

```
[type] 제목
```

type: `feat`, `fix`, `refactor`, `chore`, `design`, `docs`, `perf`

### 실행

```bash
# 템플릿 내용 확인 후 body 작성
cat .github/ISSUE_TEMPLATE/{템플릿}.yml

gh issue create \
  --title "[type] 제목" \
  --label "레이블" \
  --body "$(cat <<'EOF'
# 이슈 내용
EOF
)"
```

생성된 이슈 번호를 확인하고 Step 2에 사용한다.

---

## Step 2: 브랜치 생성

### 브랜치 네이밍 규칙

```
feature/{이슈번호}-{kebab-case-description}
hotfix/{이슈번호}-{kebab-case-description}
release/{버전번호}
```

예시:

- `feature/246-header-auth-area-refactor`
- `hotfix/250-login-session-fix`
- `release/1.2.0`

### 전제 조건 확인

```bash
# develop 최신화 (feature/release 시작 전)
git checkout develop && git pull origin develop

# main 최신화 (hotfix 시작 전)
git checkout main && git pull origin main
```

### 브랜치 생성

```bash
# feature
git flow feature start {이슈번호}-{설명}

# hotfix
git flow hotfix start {이슈번호}-{설명}

# release
git flow release start {버전번호}
```

### 원격 푸시

```bash
git flow feature publish {이슈번호}-{설명}
# 또는
git push -u origin feature/{이슈번호}-{설명}
```

---

## Step 3: PR 생성

### 전제 조건

- 변경사항이 커밋·푸시되어 있어야 한다
- 커밋 메시지는 Conventional Commits 형식 (72자 이내, 마침표 없음)

```bash
git add {관련 파일들}
git commit -m "type: 변경 내용 요약"
git push
```

### PR 제목 형식

Conventional Commit 형식: `type: 제목` (72자 이내)

### PR 생성

```bash
gh pr create \
  --base develop \
  --title "type: 제목" \
  --body "$(cat <<'EOF'
# 📝 개요

## 🔗 관련 이슈

- Closes #{이슈번호}

## 🛠️ 변경 사항 (Checklist)

- [ ] ✨ Feature: 새로운 기능 추가
- [ ] 🚀 Enhancement: 기존 기능 개선/성능 향상
- [ ] 🐞 Bug: 버그 수정
- [ ] ♻️ Refactor: 코드 구조 개선 (기능 변화 없음)
- [ ] 🏗️ Chore: 빌드/패키지 설정/단순 잡일
- [ ] 🎨 Design: UI/UX 스타일 수정
- [ ] 📚 Documentation: 문서 수정

## ✅ 아래 내용을 한 번 더 점검해 주세요

### 1. 의도와 가독성 (Naming & Readability)

- [ ] **의도 중심 네이밍**: 변수명에서 '역할'이, 함수명에서 '행위+대상'이 명확히 드러나나요?
- [ ] **선언적 코드**: '어떻게'가 아닌 '무엇을' 하는지 코드만 보고도 알 수 있나요?
- [ ] **주석**: 코드만으로 설명이 어려운 '특정 로직'에만 주석을 달았나요?

### 2. 타입과 논리 (Type Safety & Logic)

- [ ] **타입 안전성**: `any` 사용을 지양하고, 모든 함수의 반환 타입을 명시했나요?
- [ ] **엣지 케이스**: 데이터가 없거나(`null/undefined`), 에러가 발생할 경우를 처리했나요?
- [ ] **하드코딩 방지**: API 주소나 설정값들이 환경 변수나 상수로 분리되었나요?

### 3. 코드 다이어트 (Clean-up)

- [ ] **찌꺼기 제거**: 디버깅용 `console.log`나 사용하지 않는 `import`를 모두 지웠나요?
- [ ] **불필요한 코드**: 죽은 코드(Dead Code)는 없나요?
- [ ] **Linter**: 린트 에러나 워닝이 남아있지 않나요?

### 4. 지속 가능성 (Sustainability)

- [ ] **테스트**: 수동으로든 코드로든 정상 작동을 확인했나요?
- [ ] **문서화**: 새로운 환경 변수나 라이브러리가 추가되어 README 업데이트가 필요한가요?
EOF
)"
```

hotfix PR은 `--base main`으로 변경한다.

---

## 에러 핸들링

| 상황                  | 처리                                    |
| --------------------- | --------------------------------------- |
| develop이 최신이 아님 | `git pull origin develop` 후 재시도     |
| 브랜치명 충돌         | 이슈번호 확인 후 올바른 이름으로 재생성 |
| gh 미인증             | `gh auth login` 안내                    |
| 커밋 없이 PR 시도     | 변경사항 커밋 먼저 안내                 |

---

## 레이어 규칙 (의존 방향)

```
auth(Layer 0) → profile, project(Layer 1) → review, mypage, notifications(Layer 2)
```

feature 브랜치 분기 기준: **항상 develop**. hotfix만 **main**에서 분기.
