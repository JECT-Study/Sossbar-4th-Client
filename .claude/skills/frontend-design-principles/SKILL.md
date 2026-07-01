---
name: frontend-design-principles
description: 'MUST READ for all code authoring. 코드를 작성·구조화·리뷰할 때 항상 이 원칙을 판단 기준으로 삼는다. 응집도·결합도·의존성·추상화·인터페이스·비즈니스 로직 분리·DRY·YAGNI·네이밍·레이어 의존성 방향 — 모든 설계 결정의 근거가 여기에 있다. 요청이 설계 관련이든 구현 관련이든 상관없이 적용한다.'
---

# 프론트엔드 소프트웨어 설계 원칙

코드를 작성하거나 리뷰할 때 이 원칙들을 판단 기준으로 삼는다.
원칙은 교조적으로 적용하지 않는다 — **왜** 이 원칙이 존재하는지를 이해하고, 상황에 맞게 판단한다.

---

## 1. 응집도 (Cohesion)

**핵심:** 하나의 모듈/파일/컴포넌트는 **하나의 이유**로만 변경되어야 한다.

같은 이유로 변경되는 코드는 함께, 다른 이유로 변경되는 코드는 분리한다.

### 낮은 응집도 신호

- 파일명에 `Utils`, `Helpers`, `Manager`가 붙고 관련 없는 함수가 혼재
- 하나의 컴포넌트가 데이터 패칭 + 상태 관리 + 렌더링을 모두 담당
- 한 파일을 수정할 때 이유가 2가지 이상

### 높은 응집도 설계

```tsx
// ❌ 낮은 응집도 — 프로필 표시와 인증 상태가 섞임
const Header = () => {
  const user = useUser();
  const profile = useProfile(user?.id);
  const isLoggedIn = !!user;
  // ...
};

// ✅ 높은 응집도 — 각자의 관심사만
const HeaderAuthArea = () => {
  // 인증 상태 관심사
  const { data: me } = useMe();
  // ...
};
const HeaderProfileSection = () => {
  // 프로필 표시 관심사
  const { data: profile } = useProfile();
  // ...
};
```

### Sossbar 적용

- `features/[domain]/` 폴더 단위가 응집 경계
- 한 도메인의 변경이 다른 도메인 파일을 건드리면 응집도 설계 재검토

---

## 2. 결합도 (Coupling)

**핵심:** 모듈 간 의존은 **최소화**하고, 불가피하다면 **안정적인 것**에만 의존한다.

결합도가 높으면 하나를 바꿀 때 연쇄적으로 다른 것들이 깨진다.

### 결합도 종류 (나쁜 순서)

| 종류            | 설명                         | 예시                                         |
| --------------- | ---------------------------- | -------------------------------------------- |
| **콘텐츠 결합** | 내부 구현에 직접 접근        | 다른 모듈의 내부 변수 직접 수정              |
| **전역 결합**   | 전역 상태 공유               | `window.globalUser`                          |
| **제어 결합**   | 플래그로 동작 제어           | `<Button isLarge isRound isPrimary ...>`     |
| **데이터 결합** | 필요한 데이터만 props로 전달 | `<Avatar src={url} name={name}>` ← 이게 목표 |

### 느슨한 결합 설계

```tsx
// ❌ 강한 결합 — UserCard가 User 객체 전체 구조에 의존
const UserCard = ({ user }: { user: User }) => (
  <div>
    {user.profile.name} / {user.auth.email}
  </div>
);

// ✅ 느슨한 결합 — 필요한 값만 받음
const UserCard = ({ name, email }: { name: string; email: string }) => (
  <div>
    {name} / {email}
  </div>
);
```

### Sossbar 적용

- 도메인 간 참조는 반드시 `index.ts`를 통해서만 (내부 구현 결합 방지)
- 다른 도메인의 타입을 직접 import하지 않는다

---

## 3. 의존성 (Dependency)

**핵심:** 의존 방향은 **단방향**이어야 하고, **안정적인 것 → 불안정한 것** 방향으로 흘러선 안 된다.

### 의존성 역전 원칙 (DIP)

구체 구현이 아닌 추상(인터페이스)에 의존한다. 고수준 모듈이 저수준 모듈에 의존하지 않는다.

```tsx
// ❌ 구체 구현에 의존
const ProfileSection = () => {
  const res = await fetch('/api/profile'); // 구체적인 fetch
};

// ✅ 추상에 의존
const ProfileSection = ({ fetchProfile }: { fetchProfile: () => Promise<Profile> }) => {
  const data = await fetchProfile(); // 무엇을 쓸지 모름
};
```

### Sossbar 레이어 의존 방향

```
shared/                              ← 모두가 의존 (가장 안정적)
  ↑
features/auth                        ← Layer 0 (가장 안정적 도메인)
  ↑
features/profile, project            ← Layer 1
  ↑
features/review, spectrum, tag, notifications  ← Layer 2 (가장 불안정)
```

**역방향 참조는 항상 금지.** 역방향이 필요해 보이면 공통 의존을 `shared/`로 올리거나 설계를 재검토한다.

---

## 4. 추상화 (Abstraction)

**핵심:** 사용하는 쪽이 **세부 구현을 몰라도** 되도록 인터페이스만 노출한다.

추상화는 변경을 격리한다 — 내부 구현이 바뀌어도 사용처는 수정하지 않아도 된다.

### 추상화 레벨 맞추기

같은 함수/컴포넌트 안에서 추상화 레벨을 일치시킨다.

```tsx
// ❌ 추상화 레벨 불일치
const ProfilePage = () => {
  const res = await fetch('/api/profile'); // 저수준
  const profile = res.json();
  return <ProfileSection profile={profile} />; // 고수준
};

// ✅ 추상화 레벨 일치
const ProfilePage = () => {
  const { data: profile } = useProfile(); // 고수준
  return <ProfileSection profile={profile} />; // 고수준
};
```

### 과도한 추상화 경계

추상화는 **실제 변경이 발생했을 때** 도입한다. 미래를 예측한 추상화는 YAGNI 위반이다.

---

## 5. 인터페이스 (Interface)

**핵심:** 컴포넌트/함수의 **외부 계약**을 명확히 정의한다. 구현이 아닌 인터페이스가 소통의 언어다.

### Props 인터페이스 설계 원칙

```tsx
// ❌ 내부 구현 노출
interface ButtonProps {
  isLoading: boolean;
  loadingText: string;
  spinnerColor: string; // 구현 세부사항
}

// ✅ 의도 중심 인터페이스
interface ButtonProps {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}
```

**좋은 인터페이스 체크리스트:**

- 사용처가 내부 구현을 알 필요가 없는가?
- props 이름이 "무엇"을 하는지 말하는가, "어떻게"를 말하는가?
- 필수/선택 구분이 명확한가?
- props 수가 5개를 초과한다면 분리 또는 객체화를 검토한다

### 컴포넌트 합성 인터페이스

복잡한 컴포넌트는 합성 패턴으로 제어권을 사용처에 준다.

```tsx
// 합성 패턴 — Sossbar의 Dropdown이 이 패턴
<Dropdown.Root>
  <Dropdown.Trigger>열기</Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Item>메뉴 1</Dropdown.Item>
  </Dropdown.Content>
</Dropdown.Root>
```

---

## 6. 비즈니스 로직과 UI 관심사 분리

**핵심:** "무엇을 보여줄지"(비즈니스 로직)와 "어떻게 보여줄지"(UI)는 다른 이유로 변경된다.

### 분리 기준

| 비즈니스 로직    | UI 관심사             |
| ---------------- | --------------------- |
| 데이터 패칭·변환 | 레이아웃·스타일       |
| 유효성 검사 규칙 | 에러 메시지 표시 방식 |
| 상태 전이 로직   | 애니메이션·트랜지션   |
| 권한 판단        | 버튼 비활성화 표현    |

### 분리 패턴

```tsx
// ❌ 섞인 경우 — 로직이 바뀌면 UI 파일을 건드려야 함
const ReviewForm = () => {
  const [text, setText] = useState('');
  const isValid = text.length >= 10 && text.length <= 500;
  const handleSubmit = async () => {
    if (!isValid) return;
    await fetch('/api/reviews', { method: 'POST', body: text });
  };
  return <textarea onChange={(e) => setText(e.target.value)} />;
};

// ✅ 분리된 경우
// hooks/use-review-form.ts — 비즈니스 로직
const useReviewForm = () => {
  const [text, setText] = useState('');
  const isValid = text.length >= 10 && text.length <= 500;
  const submit = useMutation(...);
  return { text, setText, isValid, submit };
};

// components/review-form.tsx — UI만
const ReviewForm = () => {
  const { text, setText, isValid, submit } = useReviewForm();
  return <textarea value={text} onChange={(e) => setText(e.target.value)} />;
};
```

### Sossbar 적용

- 비즈니스 로직 → `features/[domain]/hooks/`, `features/[domain]/lib/`
- UI → `features/[domain]/components/`
- 컴포넌트 파일에 `fetch`, 복잡한 조건 분기, 데이터 변환이 있으면 분리 신호

---

## 7. DRY (Don't Repeat Yourself)

**핵심:** 지식의 중복을 제거한다. **코드의 중복**이 아닌 **지식(의도)의 중복**이 진짜 문제다.

### DRY의 오해

코드가 비슷하게 생겼다고 무조건 추출하지 않는다. 코드가 비슷해도 **이유가 다르면** 분리가 맞다.

```tsx
// 이 두 컴포넌트는 코드가 비슷해도 DRY 대상이 아님
// — 변경 이유가 달라서 (하나는 마케팅 페이지, 하나는 대시보드)
const MarketingCard = ({ title, description }: ...) => ...
const DashboardCard = ({ title, description }: ...) => ...
```

### DRY 적용 기준 — **Rule of Three**

처음엔 그냥 쓴다. 두 번째도 참는다. **세 번째** 중복이 생기면 추출한다.

```tsx
// 3번 이상 반복되는 패턴 → 추출 대상
const getNavLinkClassName = (isActive: boolean) =>
  cn('inline-flex h-10 items-center px-5', isActive && 'text-text-basic');
```

### 진짜 DRY 위반 신호

- 같은 비즈니스 규칙이 두 곳에 구현됨 (한쪽 수정 시 다른 곳을 빠뜨릴 위험)
- API 엔드포인트 문자열이 하드코딩으로 여러 곳에 반복
- 동일한 유효성 검사 로직이 컴포넌트마다 복사됨

---

## 8. YAGNI (You Aren't Gonna Need It)

**핵심:** 지금 필요하지 않은 것은 만들지 않는다.

미래를 예측한 코드는 대부분 틀리고, 짐만 남는다.

### YAGNI 위반 패턴

```tsx
// ❌ "나중에 필요할 것 같아서"
interface ButtonProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // 현재 md만 씀
  iconPosition?: 'left' | 'right' | 'top' | 'bottom'; // top/bottom 쓸 일 없음
  loadingStrategy?: 'spinner' | 'skeleton' | 'blur'; // spinner만 씀
}

// ✅ 지금 필요한 것만
interface ButtonProps {
  size?: 'sm' | 'md';
  isLoading?: boolean;
}
```

### YAGNI와 DRY의 균형

| 상황                           | 적용 원칙                    |
| ------------------------------ | ---------------------------- |
| 중복이 2번 이하                | YAGNI — 아직 추출하지 않는다 |
| 중복이 3번 이상                | DRY — 추출한다               |
| 미래 확장을 위한 파라미터 추가 | YAGNI — 필요할 때 추가한다   |
| 지금 쓰이는 공통 로직          | DRY — 즉시 추출한다          |

### Sossbar 적용

- `shared/`로 승격 기준: **2번째 실제 사용**이 생겼을 때 (CLAUDE.md 명시)
- MVP 범위 외 기능은 구현 보류 (CLAUDE.md 명시)

---

## 9. 의도 중심 네이밍 (Intention-Revealing Names)

**핵심:** 이름은 **무엇인지/무엇을 하는지**를 말해야 한다. 어떻게 구현됐는지, 어디에 속하는지를 말하면 안 된다.

이름이 좋으면 주석이 필요 없다. 이름이 나쁘면 주석도 거짓말이 된다.

### 나쁜 네이밍 패턴

| 패턴             | 문제                           | 예시                                   |
| ---------------- | ------------------------------ | -------------------------------------- |
| 기술 구현을 담음 | 구현이 바뀌면 이름도 바꿔야 함 | `useQuery`, `fetchData`, `handleClick` |
| 소속·위치를 담음 | 이동하면 이름이 거짓말이 됨    | `useAuthMe`, `headerData`              |
| 너무 짧음        | 의도를 추측해야 함             | `useMe`, `data`, `info`, `res`         |
| 너무 넓음        | 책임 범위를 알 수 없음         | `useUser`, `getInfo`, `handleSubmit`   |

### 좋은 네이밍 패턴

**변수/상수** — 무엇을 담고 있는가

```ts
// ❌
const data = await fetchMe();
const res = me?.username ?? me?.email;

// ✅
const myProfile = await fetchMyProfile();
const displayName = myProfile?.username ?? myProfile?.email;
```

**함수/훅** — 무엇을 하는가, 무엇을 제공하는가

```ts
// ❌ 기술 구현이 이름에 노출됨
const useMe = () => useSuspenseQuery(...);
const fetchData = () => apiRequest('/users/profile');

// ✅ 의도가 이름에 드러남
const useMyProfile = () => useSuspenseQuery(...);
const fetchMyProfile = () => apiRequest('/users/profile');
```

**컴포넌트** — 무엇을 렌더링하는가, 어떤 역할인가

```tsx
// ❌ 위치·기술 구현 중심
const HeaderAuthArea = () => ...    // "auth area"가 뭔지 모름
const UserSection = () => ...       // 너무 범용적

// ✅ 역할 중심
const HeaderAuthGate = () => ...    // 인증 게이트키퍼
const HeaderMyProfile = () => ...   // 내 프로필을 헤더에 표시
```

**이벤트 핸들러** — 무엇에 반응하는가

```tsx
// ❌
onClick = { handleClick };
onSubmit = { submit };

// ✅
onClick = { handleLogout };
onSubmit = { handleReviewSubmit };
```

### 네이밍 체크리스트

이름을 짓고 나서 아래를 확인한다:

- 이름만 보고 **무엇을 담당하는지** 알 수 있는가?
- **구현 방식**이 이름에 들어가 있지 않은가? (`useQuery`, `fetchData`)
- **소속·위치**가 이름에 들어가 있지 않은가? (위치가 바뀌면 이름도 바꿔야 함)
- 팀원이 이 이름을 처음 보고 **오해할 여지**가 없는가?

### Sossbar 적용

- 훅: `use{도메인}{행위/대상}` — `useMyProfile`, `useProjectCards`, `useSignupForm`
- 패처: `fetch{대상}` — `fetchMyProfile`, `fetchProjectDetail`
- 컴포넌트: `{문맥}{역할}` — `HeaderAuthGate`, `HeaderMyProfile`, `ReviewWriteForm`
- 이벤트 핸들러: `handle{대상}{행위}` — `handleLogout`, `handleReviewSubmit`

---

## 10. 폴더 위계와 의존성 방향

**핵심:** 의존성은 항상 **안정적인 것(아래)** 을 향해야 한다. 아래 레이어가 위 레이어를 참조하는 순간 아키텍처가 무너진다.

### Sossbar 레이어 구조

```
app/                               ← 조합 지점 (가장 불안정)
  layout.tsx                       ← 모든 feature를 조합하는 유일한 허용 지점
    ↓
features/ (peer domains)
  review/, spectrum/, tag/, notifications/  ← Layer 2 (가장 불안정한 도메인)
    ↓
  profile/, project/               ← Layer 1
    ↓
  auth/                            ← Layer 0 (가장 안정적인 도메인)
    ↓
shared/                            ← 모두가 의존 (가장 안정적)
```

### 의존성 규칙

| 방향                                | 허용 여부 | 설명            |
| ----------------------------------- | --------- | --------------- |
| 위 → 아래 (app → features → shared) | ✅        | 항상 허용       |
| 같은 레이어 간 (peer → peer)        | ❌        | 원칙적으로 금지 |
| 아래 → 위 (shared → features)       | ❌        | 절대 금지       |

### 아래를 향하는 의존성 — 금지

```ts
// ❌ shared가 feature를 참조 — 절대 금지
// shared/components/header.tsx
import { useMyProfile } from '@/features/my-profile/hooks/use-my-profile';

// ❌ Layer 0가 Layer 1을 참조
// features/auth/signup/use-signup.mutation.ts
import { myProfileKeys } from '@/features/my-profile/api/my-profile-keys'; // ← 위반
```

```ts
// ✅ 올바른 방향 — 위가 아래를 참조
// app/layout.tsx (조합 지점)
import { fetchMyProfileOptional } from '@/features/my-profile/api/fetch-my-profile';
import { createSignup } from '@/features/auth/api/auth.mutations';
```

### Peer 도메인 간 의존 — 원칙적 금지

같은 레이어의 도메인끼리는 서로 모르는 것이 이상적이다. 한 도메인이 다른 도메인을 import하면 둘이 묶여서 함께 변경되어야 한다.

```ts
// ❌ auth가 my-profile을 참조 (peer 의존)
// features/auth/signup/hooks/use-signup.mutation.ts
import { myProfileKeys } from '@/features/my-profile/api/my-profile-keys';

// ✅ 해결: 각 도메인이 독립적으로 동작하도록 설계
// auth/signup은 순수하게 인증만 담당
// my-profile 캐시 갱신은 App Router 서버 re-render가 담당
```

### 위반 감지 방법

```bash
# features 내에서 다른 features를 참조하는 파일 찾기
grep -rn "from '@/features/" features/ --include="*.ts" --include="*.tsx"
```

결과에서 **같은 레이어 또는 아래 레이어를 참조하는 것**이 있으면 위반이다.

### 위반 해결 패턴

| 상황                                       | 해결책                                                                |
| ------------------------------------------ | --------------------------------------------------------------------- |
| 두 도메인이 같은 것을 필요로 함            | `shared/`로 승격                                                      |
| 낮은 레이어가 높은 레이어 결과를 알아야 함 | 조합을 위로 올림 (app 레벨에서 처리)                                  |
| Peer 도메인이 서로 참조함                  | 공통 의존을 `shared/`로, 조합 로직은 `app/`으로                       |
| Cache 무효화 크로스 도메인                 | App Router 서버 re-render 활용, 또는 `onSuccess` 콜백을 호출부로 위임 |

### Sossbar 적용 예시

```
❌ 이전: features/auth/signup → features/my-profile (peer 의존)
✅ 이후: features/auth/signup (순수 인증) + App Router re-render (캐시 갱신)

❌ 이전: features/auth/components/header.tsx (auth가 전역 레이아웃 담당)
✅ 이후: shared/components/header/header.tsx (shell) + app/layout.tsx (조합)
```

---

## 원칙 간 충돌 해소

원칙끼리 충돌할 때는 **현재 코드베이스의 고통**을 기준으로 판단한다.

| 충돌                              | 우선순위                                |
| --------------------------------- | --------------------------------------- |
| DRY vs YAGNI                      | 실제 3회 중복이 생기기 전까지 YAGNI     |
| 응집도 vs 결합도                  | 도메인 경계가 맞으면 결합도를 낮추는 쪽 |
| 추상화 vs 단순성                  | 변경이 발생했을 때 추상화 도입          |
| 인터페이스 분리 vs 오버엔지니어링 | 사용처가 2개 이상일 때 분리             |

> 코드가 읽기 어렵거나, 변경이 두렵거나, 같은 수정을 여러 곳에 해야 한다면 — 설계 원칙 중 하나가 위반된 신호다.
