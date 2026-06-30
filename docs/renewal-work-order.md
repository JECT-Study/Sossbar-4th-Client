# 리뉴얼 작업 순서 (1차 정리)

기획표(타겟 & 방향성 / 프로젝트 관리)를 기준으로, **현재 브랜치 `feature/renewal-404-project`에서 이어갈 작업**의 권장 순서를 정리한 문서입니다.

> **목적**: 본격 구현 전에 의존 관계·역할·우선순위를 한눈에 보고, FE 작업 단위(PRD/브랜치)를 나누기 위함  
> **범위**: 1차 정리 — 세부 API 스펙·Figma node ID는 각 작업 착수 시 보완

---

## 1. 작업 목록 요약

| #   | 분류          | 구분           | as-is                | to-be                                | 우선순위 | Figma | 주 담당      |
| --- | ------------- | -------------- | -------------------- | ------------------------------------ | -------- | ----- | ------------ |
| 0   | UI            | 404 페이지     | 큰 404 비주얼        | 362×124 크기로 축소                  | —        | —     | FE ✅        |
| 1   | 타겟 & 방향성 | 서비스 타겟    | 기업/동아리          | IT 동아리 단위로 축소·집중           | —        | —     | PM → PD      |
| 2   | 프로젝트 관리 | 확정 프로세스  | 확정 전/후 차이 모호 | **방장 확정 후**에만 본인 후기 열람  | P1       | —     | PM → BE → FE |
| 3   | 프로젝트 관리 | 확정 기능 이해 | 확정 시점 안내 없음  | 확정 버튼 옆 마이크로카피 추가       | P1       | ✅    | PM → PD → FE |
| 4   | 프로젝트 관리 | 초대 링크      | 제한 없음            | **일회성** 초대 링크                 | P1       | ✅    | PM → BE → FE |
| 5   | 프로젝트 관리 | 멤버 관리      | 제한 없음            | **확정 후** 팀원 내보내기 불가       | P1       | ✅    | PM → BE → FE |
| 6   | 프로젝트 관리 | 정보 입력      | 이미지만 업로드      | 프로젝트 생성 시 **사이트 URL** 첨부 | P1       | ✅    | PD → FE/BE   |

### 추가 논의 (기획표 비고)

- **확정 프로세스**: 팀 프로젝트 기간이 길어질 때 **이탈 방지** 대책 필요 (알림, 리마인더, UX 등 — PM 주도)

---

## 2. 권장 작업 순서

의존 관계와 **FE 단독 착수 가능 여부**를 기준으로 단계를 나눴습니다.

```text
[Phase 0] 완료
  └─ 404 비주얼 크기 조정 (362×124)

[Phase 1] 정책·카피 확정 (병렬 가능, 구현 전 필수)
  ├─ PM: P1 정책 확정 (확정 게이트 / 일회성 링크 / 확정 후 추방 불가)
  ├─ PM → PD: IT 동아리 타겟 랜딩·온보딩 카피
  └─ BE: API 변경 스펙 초안 공유 (아래 §4 참고)

[Phase 2] FE 단독·저위험 (BE 없이 또는 mock으로 선행)
  ├─ (3) 확정 마이크로카피 — project-card 확정 UI
  └─ (1) 랜딩/온보딩 카피 반영 — app/(home)/, 가이드 문구

[Phase 3] BE 연동 필요 (스펙 확정 후)
  ├─ (6) 프로젝트 생성 URL 필드 — create-project-modal + API
  ├─ (4) 일회성 초대 링크 — invite handler + 에러 화면
  └─ (5) 확정 후 멤버 내보내기 비활성 — project-card 액션

[Phase 4] BE 핵심 + FE 조건부 UI (가장 영향 큼)
  └─ (2) 확정 후에만 후기 열람 — review / profile / projects 전반
```

### Phase별 FE 착수 조건

| Phase | 착수 조건                   | 예상 PR 단위                                             |
| ----- | --------------------------- | -------------------------------------------------------- |
| 0     | —                           | `design: 404 이미지 크기 조정` ✅                        |
| 1     | 기획 회의/슬랙 합의         | 문서·카피 PR (코드 없음)                                 |
| 2     | 카피·Figma 확정             | `feat: 확정 버튼 마이크로카피`, `design: 랜딩 타겟 카피` |
| 3     | BE API 또는 MSW mock 반영   | 기능별 1 PR (URL / invite / member)                      |
| 4     | BE 권한 로직 배포 또는 mock | `feat: 확정 후 후기 열람 게이트`                         |

---

## 3. FE 작업별 코드 위치 (현재 코드베이스)

구현 시 손대게 될 **대표 파일**입니다. 상세는 착수 시 재확인.

| #   | 작업              | 관련 파일·영역                                                                                                                                         |
| --- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0   | 404               | `app/not-found.tsx`                                                                                                                                    |
| 1   | 타겟 카피         | `app/(home)/` 랜딩 섹션, `shared/constants/guidance-copy.ts` 등                                                                                        |
| 2   | 확정 후 후기 열람 | `features/review/`, `features/profile/`, `app/(protected)/projects/`                                                                                   |
| 3   | 확정 마이크로카피 | `features/project/components/project-card.tsx` (`useConfirmProjectMembers`)                                                                            |
| 4   | 일회성 초대       | `features/project/components/project-invite-handler.tsx`, `project-invite-accept-modal.tsx`, `mocks/handlers/projects.ts`                              |
| 5   | 확정 후 추방 불가 | `features/project/components/project-card.tsx`, `features/project/api/mutations.ts` (`removeMember`)                                                   |
| 6   | URL 입력          | `features/project/components/create-project-modal.tsx`, `use-create-project-modal.ts`, `features/project/types.ts`, `features/project/api/fetchers.ts` |

---

## 4. BE 협의 체크리스트 (FE 착수 전)

FE Phase 3·4 전에 BE와 맞춰야 할 항목입니다.

### (2) 확정 프로세스

- [ ] `projectStatus === 'COMPLETED'`(또는 별도 `confirmedAt`) 기준으로 **본인 후기 조회 API** 차단 여부
- [ ] 차단 시 HTTP 상태·에러 코드·클라이언트 표시 문구
- [ ] 방장/팀원별 노출 차이 (후기 작성 vs 열람)

### (4) 일회성 초대 링크

- [ ] 토큰 1회 사용 후 만료 규칙 (이미 참여 멤버 재클릭 시 처리)
- [ ] 만료/재사용 시 에러 코드 (현재 `project-invite-handler`는 404·409 위주)
- [ ] 초대 URL 형식 변경 여부 (`build-project-invite-url.ts`)

### (5) 멤버 관리

- [ ] `DELETE /projects/:projectId/:userId` 확정 후 403 등 거부
- [ ] FE는 `projectStatus`만으로 버튼 숨김 vs API 에러 핸들링 병행

### (6) 사이트 URL

- [ ] `POST /projects`, `PATCH /projects/:id` 요청·응답 필드명 (`siteUrl` 등)
- [ ] URL 검증 규칙 (필수/선택, max length, scheme)

---

## 5. 브랜치·PR 전략 제안

현재 브랜치명은 `feature/renewal-404-project`이지만, 이후 작업은 **도메인·리스크가 달라** PR을 나누는 편이 리뷰·롤백에 유리합니다.

| PR   | 브랜치 예시                           | 포함 작업            |
| ---- | ------------------------------------- | -------------------- |
| 1 ✅ | `feature/renewal-404-project`         | #0 404               |
| 2    | `feature/renewal-landing-copy`        | #1 타겟 카피         |
| 3    | `feature/project-confirm-microcopy`   | #3 확정 안내 문구    |
| 4    | `feature/project-site-url`            | #6 URL 필드          |
| 5    | `feature/project-one-time-invite`     | #4 일회성 링크       |
| 6    | `feature/project-post-confirm-member` | #5 추방 불가         |
| 7    | `feature/project-confirm-review-gate` | #2 확정 후 후기 열람 |

> develop 기준 feature 브랜치는 [`docs/workflow-and-gitflow.md`](./workflow-and-gitflow.md) 네이밍(`feature/이슈번호-설명`)을 따릅니다. 이슈 번호가 생기면 브랜치명에 반영하세요.

---

## 6. 다음 액션 (바로 할 일)

1. **PM/BE와 Phase 1 체크리스트(§4) 30분 sync** — 특히 #2·#4 스펙
2. **Phase 2부터 FE 착수** — #3 마이크로카피 + #1 랜딩 카피 (BE 불필요)
3. **404 PR 머지 후** — 위 표대로 브랜치 분리 여부 결정
4. **Figma node ID** — #3·#4·#5·#6 각 작업 시작 시 dev mode 링크를 이 문서 하단 또는 이슈에 추가

---

## 변경 이력

| 날짜       | 내용                                                      |
| ---------- | --------------------------------------------------------- |
| 2026-06-13 | 1차 작성 — 기획표 기반 작업 순서·FE 코드 맵·BE 체크리스트 |
