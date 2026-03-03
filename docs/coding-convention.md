## 코딩 컨벤션 개요

이 문서는 이 프로젝트(Next.js 16 + TypeScript + pnpm)의 **코딩 컨벤션(코드 스타일 & 구조)**을 정리합니다.  
ESLint/Prettier 설정과 디렉터리 구조, 컴포넌트 작성 방식, PR 전 코드 품질 기준을 한 번에 이해하는 것이 목표입니다.

### 큰 흐름 (Big Picture)

코드 한 줄이 저장된 뒤 배포까지 가는 흐름은 다음과 같습니다.

```text
개발자 에디터
   │  (저장)
   ▼
ESLint + Prettier (로컬)
   │  (git add)
   ▼
Husky + lint-staged (pre-commit)
   │   - TS/TSX: eslint --fix → prettier --write
   │   - JS/JSON/MD: prettier --write
   │  (commit)
   ▼
commitlint (commit-msg 훅)
   │
   ▼
GitHub PR (Git Flow: feature → develop)
   │
   ▼
GitHub Actions CI (lint → build)
   │
   ▼
main / 배포
```

이 컨벤션은 “**읽기 쉬운 React/TS 코드**를 일관되게 유지하고, CI에서 예측 가능한 품질을 확보하는 것”을 목표로 합니다.

---

## 1. 언어 & 타입스크립트 규칙

- **TypeScript 우선**
  - `any` 사용 금지: `@typescript-eslint/no-explicit-any: error`
  - 사용하지 않는 변수 금지: `@typescript-eslint/no-unused-vars: error`
  - `await`는 실제 `Promise`에만 사용: `@typescript-eslint/await-thenable: error`
  - 타입은 `type import` 우선: `@typescript-eslint/consistent-type-imports: error`
- **명시적인 의도**
  - 복잡한 조건은 **의미 있는 이름의 변수**로 분해해서 사용합니다.
  - 인자의 타입/리턴 타입은 함수가 외부에 노출될수록 명시적으로 선언합니다.

자세한 규칙은 `eslint.config.mjs`와 [`docs/eslint-convention.md`](./eslint-convention.md)를 참고하세요.

---

## 2. 코드 스타일 (Prettier + ESLint)

- **Prettier 기본값 + 프로젝트 설정**
  - `semi: true`, `singleQuote: true`, `trailingComma: 'all'`
  - `tabWidth: 2`, `printWidth: 120`, `arrowParens: 'always'`, `endOfLine: 'lf'`
  - Tailwind 클래스 정렬: `prettier-plugin-tailwindcss` 사용
- **제어문 규칙**
  - 모든 `if/else/for/while`에는 **중괄호 필수**: `curly: ['error', 'all']`
  - 예:
    - ❌ `if (condition) doSomething();`
    - ✅ `if (condition) { doSomething(); }`
- **console 사용 금지**
  - `no-console: error`
  - 디버깅은 브라우저 DevTools 또는 전용 로깅 유틸로 처리합니다.

---

## 3. import / export 규칙

- **import 순서 (`import/order`)**
  - 그룹 순서: `builtin` → `external` → `internal` → `type` → `index` → `unknown`
  - `react`는 `external` 그룹 중 가장 위
  - `@/**` 패턴은 `internal` 그룹으로 취급
  - 그룹 사이에는 **항상 한 줄 공백** (`newlines-between: 'always'`)
  - 알파벳 순 정렬 (`alphabetize: { order: 'asc', caseInsensitive: true }`)
- **중복 import 금지**
  - `import/no-duplicates: error`
- **default export 전략**
  - 전역: `import/no-default-export: error`
  - 예외(Next App Router 필수 파일만 허용):
    - `app/**/page.tsx`, `app/**/page.ts`
    - `app/**/layout.tsx`, `app/**/layout.ts`
  - 나머지 모든 모듈은 **named export**를 사용합니다.

---

## 4. React 컴포넌트 & JSX 규칙

### 4-1. 컴포넌트 정의 방식

- 모든 컴포넌트는 **화살표 함수**로 정의합니다.
  - ✅ `const MyComponent = () => { ... }`
  - ❌ `function MyComponent() { ... }`

### 4-2. 이름 규칙

- 컴포넌트 이름: **PascalCase** (`MyButton`, `UserProfileCard`)
  - `react/jsx-pascal-case: error`
- 파일 이름도 가능하면 컴포넌트 이름과 맞춥니다.

### 4-3. JSX 패턴

- **배열 index를 key로 사용 금지**
  - `react/no-array-index-key: error`
  - ✅ `items.map((item) => <Row key={item.id} />)`
  - ❌ `items.map((item, index) => <Row key={index} />)`
- **불필요한 Fragment 금지**
  - `react/jsx-no-useless-fragment: ['error', { allowExpressions: false }]`
  - 의미 없이 자식 하나만 감싸는 Fragment는 허용하지 않습니다.
    - ❌ `<>{child}</>`
    - ✅ `<>{child1}{child2}</>`
- **render 안에서 bind 금지 (경고)**
  - `react/jsx-no-bind: warn`
  - ❌ `<button onClick={handleClick.bind(null, id)} />`
  - ✅ `<button onClick={() => handleClick(id)} />`

---

## 5. 폴더 구조 & 컴포넌트 설계 가이드

### 5-1. 디렉터리 구조 (권장)

- 재사용 가능한 컴포넌트/훅/유틸은 공용 위치에 두고,
- 도메인별 파일은 `domains/` 형태로 묶는 것을 지향합니다.

```text
src/
  components/   # 공용 컴포넌트
  hooks/        # 공용 훅
  utils/        # 공용 유틸
  domains/
    user/
      components/
      hooks/
      ...
    product/
    order/
```

### 5-2. 조건 분기 & 읽기 쉬운 코드

프론트엔드 설계 가이드에 따라:

- 복잡한 조건은 **별도 변수 이름**으로 분리합니다.
- 서로 다른 UI는 **별도 컴포넌트**로 나누어 렌더링합니다.
- 중첩된 삼항 연산자는 피하고, `if` 문이나 IIFE로 치환합니다.

예시:

```ts
const isViewer = user.role === 'viewer';

return isViewer ? <ViewerSubmitButton /> : <AdminSubmitButton />;
```

---

## 6. 성능 & 안정성 체크포인트

- **불필요한 렌더링 줄이기**
  - props로 함수를 넘길 때는 `useCallback` 등으로 참조 안정성을 고려합니다.
  - 리스트 렌더링 시 key 안정성을 항상 신경 씁니다.
- **코드 일관성**
  - 모든 팀원이 같은 ESLint/Prettier 규칙을 사용하므로, 포맷은 자동화에 맡기고 **로직/설계에 집중**합니다.
- **규칙 위반 시**
  - 로컬에서 `pnpm lint` 실행 시, CI와 동일한 규칙이 적용됩니다.
  - 규칙이 과도하다고 느껴질 경우, PR/이슈로 컨벤션 변경을 논의합니다 (개인 override 지양).

---

## 7. 스스로 점검해볼 질문 (Why 5)

1. 이 컴포넌트의 props와 타입 정의만 봐도 **역할과 제약**이 명확히 드러나는가?
2. 이 조건문/분기 로직은 **한눈에 읽히는가**, 아니면 임시 변수/별도 컴포넌트로 분리하는 게 더 나은가?
3. 리스트 렌더링에서 key 전략이 **데이터의 실제 식별자**(id 등)를 제대로 반영하고 있는가?
4. 이 파일의 import 순서와 export 방식이 **프로젝트 전체의 규칙**(named export, import/order)을 따르고 있는가?
5. 이 코드는 ESLint/Prettier를 돌린 뒤에도 **추가로 설명이 필요한 복잡도**를 가지고 있는가? 그렇다면 주석이나 분리로 복잡도를 낮출 수는 없는가?
