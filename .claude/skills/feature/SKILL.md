---
name: feature
description: Sossbar feature 구현 오케스트레이터. "~기능 만들어줘", "~컴포넌트 추가해줘", "~페이지 구현해줘", "~훅 만들어줘", "~API 연동해줘", "~도메인에 추가해줘", "기능 구현해줘", "feature 추가" 등 새 기능 구현 요청이면 반드시 이 스킬을 사용할 것. "다시 해줘", "수정해줘", "보완해줘", "이전 결과 개선해줘" 등 재실행 요청에도 트리거된다.
---

# Feature 구현 오케스트레이터

**실행 모드:** 서브 에이전트 (순차 파이프라인)
**에이전트:** planner → implementer → guardian
**데이터 전달:** 파일 기반 (`_workspace/`)

## Phase 0: 컨텍스트 확인

`_workspace/` 존재 여부로 실행 모드를 결정한다:

```bash
ls _workspace/ 2>/dev/null && echo "EXISTS" || echo "NEW"
```

| 상황                                | 실행 모드                                        |
| ----------------------------------- | ------------------------------------------------ |
| `_workspace/` 없음                  | **초기 실행** — 전체 파이프라인                  |
| `_workspace/` 있음 + 부분 수정 요청 | **부분 재실행** — 해당 단계부터                  |
| `_workspace/` 있음 + 새 요청        | `mv _workspace _workspace_prev` 후 **초기 실행** |

## Phase 1: 작업 디렉토리 준비

```bash
mkdir -p _workspace
```

## Phase 2: planner 실행

```
Agent(
  subagent_type: "Plan",
  model: "opus",
  description: "feature 계획 수립",
  prompt: """
    [agent:planner] `.claude/agents/planner.md`를 읽고 역할과 원칙을 따른다.
    `.claude/skills/domain-planning/SKILL.md`를 읽고 절차를 따른다.

    **요구사항:** {사용자 요구사항}

    `_workspace/01_planner_plan.md`를 생성하고 완료를 보고하라.
  """
)
```

`_workspace/01_planner_plan.md` 생성 확인 후 Phase 3 진행.

## Phase 3: implementer 실행

```
Agent(
  subagent_type: "frontend-architect",
  model: "opus",
  description: "feature 코드 구현",
  prompt: """
    [agent:implementer] `.claude/agents/implementer.md`를 읽고 역할과 원칙을 따른다.
    `.claude/skills/react-implementation/SKILL.md`를 읽고 패턴을 따른다.

    `_workspace/01_planner_plan.md`를 읽고 계획에 따라 코드를 구현하라.
    완료 후 `_workspace/02_implementer_summary.md`를 생성하라.
  """
)
```

`_workspace/02_implementer_summary.md` 생성 확인 후 Phase 4 진행.

## Phase 4: guardian 실행

```
Agent(
  subagent_type: "general-purpose",
  model: "opus",
  description: "코드 품질 검증 및 수정",
  prompt: """
    [agent:guardian] `.claude/agents/guardian.md`를 읽고 역할과 원칙을 따른다.
    `.claude/skills/code-validation/SKILL.md`를 읽고 검증 절차를 따른다.

    `_workspace/02_implementer_summary.md`를 읽고 구현된 코드를 검증하라.
    완료 후 `_workspace/03_guardian_report.md`를 생성하라.
  """
)
```

## Phase 5: 결과 요약

`_workspace/03_guardian_report.md`를 읽고 사용자에게 보고:

```
## 구현 완료

**생성/수정된 파일:**
- [파일 목록]

**검증 결과:** DONE / ESCALATE

**수정된 문제:** (있으면)
- [수정 내역]

**다음 단계:**
- ship으로 커밋/PR 생성 가능
- [에스컬레이션 사항이 있으면 기술]
```

## 에러 핸들링

- 단계별 실패 시 1회 재시도
- guardian이 ESCALATE 반환 시 planner를 재실행하여 설계 수정 후 전체 재실행
- 재실패 시 보고서에 미완성 상태 명시하고 사용자에게 보고

## 테스트 시나리오

**정상:** "review 도메인에 후기 작성자 닉네임 표시 컴포넌트 추가해줘"
→ planner: `features/review/components/reviewer-name.tsx` 계획
→ implementer: 컴포넌트 + 타입 작성
→ guardian: lint/build PASS, 경계면 검증 완료 → DONE

**에러:** implementer가 shared/에 도메인 전용 컴포넌트 배치
→ guardian: 아키텍처 규칙 위반 감지 → ESCALATE
→ 오케스트레이터: planner 재실행하여 features/review/로 재배치
