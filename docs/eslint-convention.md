## ESLint 컨벤션

이 문서는 `eslint.config.mjs` 기반으로 프로젝트에서 강제되는 주요 규칙을 정리한 것입니다.

### 기본 원칙

- **타입스크립트 우선**
  - `any` 사용 금지: `@typescript-eslint/no-explicit-any: error`
  - 사용하지 않는 변수 금지: `@typescript-eslint/no-unused-vars: error`
  - `await`는 실제 `Promise`에만 사용: `@typescript-eslint/await-thenable: error`
  - 타입은 `type import`를 우선 사용: `@typescript-eslint/consistent-type-imports: error`

- **콘솔 사용 금지**
  - `no-console: error`
  - 디버깅이 필요하면 `console` 대신 전용 로깅 유틸을 도입하는 것을 권장합니다.

### import 규칙

- **import 순서**
  - `import/order: error`
  - 그룹 순서: `builtin` → `external` → `internal` → `type` → `index` → `unknown`
  - `react`는 `external` 그룹 중 가장 위에 위치
  - `@/**` 패턴은 `internal` 그룹으로 취급
  - 그룹 사이에는 항상 한 줄 공백(`newlines-between: always`)
  - 알파벳 순 정렬(`alphabetize: { order: 'asc', caseInsensitive: true }`)

- **중복 import 금지**
  - `import/no-duplicates: error`

- **default export 금지**
  - 전역 규칙: `import/no-default-export: error`
  - **예외**: Next App Router 요구사항을 따르기 위해 다음 파일에서는 `default export` 허용
    - `app/**/page.tsx`, `app/**/page.ts`
    - `app/**/layout.tsx`, `app/**/layout.ts`

### unused import/variable 규칙

- **완전히 사용되지 않는 import 금지**
  - `unused-imports/no-unused-imports: error`

- **사용되지 않는 변수는 경고**
  - `unused-imports/no-unused-vars: warn`
  - 사용하지 않는 변수/인자를 의도적으로 남겨야 할 경우 이름을 `_` 혹은 `_<name>` 형태로 선언
    - 예: `const _unused = value;`, `function fn(_event: MouseEvent) { ... }`

### 제어문 규칙 (if/for/while 등)

- **중괄호 필수**
  - `curly: ['error', 'all']`
  - `if`, `else`, `for`, `while` 등 모든 제어문에서 항상 `{}`를 사용해야 합니다.
    - ❌ `if (condition) doSomething();`
    - ✅ `if (condition) { doSomething(); }`

### React 컴포넌트 규칙

- **컴포넌트 정의 방식**
  - `react/function-component-definition: error`
  - **모든 컴포넌트는 화살표 함수로 정의**
    - ✅ `const MyComponent = () => { ... }`
    - ❌ `function MyComponent() { ... }`

- **JSX 네이밍**
  - `react/jsx-pascal-case: error`
  - 컴포넌트 이름은 PascalCase를 사용해야 하며, ALL_CAPS 컴포넌트는 허용하지 않습니다.

- **배열 index를 key로 사용 금지**
  - `react/no-array-index-key: error`
  - 리스트 렌더링 시 `key={index}` 대신 **안정적인 고유 값**을 key로 사용합니다.
    - ✅ `items.map((item) => <Row key={item.id} />)`
    - ❌ `items.map((item, index) => <Row key={index} />)`

- **불필요한 Fragment 금지**
  - `react/jsx-no-useless-fragment: ['error', { allowExpressions: false }]`
  - 의미 없이 하나의 자식만 감싸는 Fragment는 허용되지 않습니다.
    - ❌ `<>{child}</>`
    - ✅ `<>{child1}{child2}</>`
    - ✅ `<FragmentWithKey>{child}</FragmentWithKey>` (key가 필요한 경우, 별도 컴포넌트 사용 고려)

- **render 시점에 bind 금지**
  - `react/jsx-no-bind: warn`
  - JSX 안에서 `bind`를 호출하는 패턴은 경고가 발생합니다.
    - ❌ `<button onClick={handleClick.bind(null, id)} />`
    - ✅ `<button onClick={() => handleClick(id)} />`
    - 성능이 중요한 경우, 상위에서 `useCallback` 등으로 핸들러를 만들어 내려보내는 것을 권장합니다.

### 기타

- **React 버전 자동 감지**
  - `settings.react.version: 'detect'`로 설정되어 있어, 설치된 React 버전에 맞춰 규칙이 자동으로 적용됩니다.

- **lint 대상에서 제외되는 파일**
  - 빌드 산출물 및 Next 기본 생성 파일:
    - `.next/**`, `out/**`, `build/**`, `next-env.d.ts`
  - TS 프로젝트 서비스와 충돌을 피하기 위한 설정 파일:
    - `eslint.config.mjs`, `postcss.config.mjs`
