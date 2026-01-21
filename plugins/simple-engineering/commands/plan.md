---
name: simple:plan
description: Research 결과를 바탕으로 Paint-by-Numbers 수준의 상세 명세서를 작성합니다.
arguments:
  - name: research-file
    description: Research 산출물 파일 경로 (예: .claude/simple-engineering/research/research-xxx.md)
    required: true
---

# Planning Phase - Simple Engineering

당신은 **Planning Phase**를 수행합니다. 이 단계의 목표는 구현 시 AI가 "추론"할 필요가 없도록 **Paint-by-Numbers** 수준의 상세 명세서를 작성하는 것입니다.

## Research 파일: $ARGUMENTS.research-file

## 수행 절차

### 1. Research 검토

먼저 제공된 Research 파일을 읽고 분석합니다:

- Problem Statement 확인
- Verified Assumptions 확인
- 미검증 가정이 있다면 경고 표시

### 2. 설계 결정

구현에 필요한 모든 설계 결정을 명시적으로 수행합니다.

각 중요 결정마다 체크포인트를 생성합니다:

```
<checkpoint type="decision" id="cp-XXX">
## 설계 결정

**결정 사항**: [결정 내용]
**선택지**:
1. [Option A] - [장단점]
2. [Option B] - [장단점]

**선택**: [선택한 옵션]
**근거**: [선택 이유]

---
이 설계 결정이 적절한지 확인해 주세요.
</checkpoint>
```

### 3. 명세서 작성

다음 항목을 **구체적으로** 명시합니다:

#### 3.1 파일 구조

```
변경/생성할 파일:
- path/to/file1.ts (수정)
- path/to/file2.ts (생성)
- path/to/file3.test.ts (생성)
```

#### 3.2 함수/클래스 시그니처

```typescript
// 예시: 정확한 시그니처 명시
interface UserService {
  findById(id: string): Promise<User | null>;
  create(data: CreateUserDto): Promise<User>;
}
```

#### 3.3 데이터 구조

```typescript
// 예시: 정확한 타입 정의
type User = {
  id: string;
  email: string;
  createdAt: Date;
};
```

#### 3.4 에러 처리

- 발생 가능한 에러 유형
- 각 에러의 처리 방식
- 에러 메시지 형식

#### 3.5 테스트 케이스

```
Test Suite: [기능명]

- [ ] Test 1: [시나리오] - Expected: [결과]
- [ ] Test 2: [시나리오] - Expected: [결과]
- [ ] Test 3: [Edge case] - Expected: [결과]
```

### 4. 구현 순서

의존성을 고려한 구현 순서를 명시합니다:

```
Implementation Order:
1. [Step 1] - 파일: X, 의존성: 없음
2. [Step 2] - 파일: Y, 의존성: Step 1
3. [Step 3] - 파일: Z, 의존성: Step 1, 2
```

### 4.1 TodoWrite를 활용한 작업 추적

**중요**: 구현 순서가 확정되면 `TodoWrite` 도구를 사용하여 작업 목록을 생성합니다.

```
TodoWrite 사용 예시:

todos: [
  { content: "Step 1 설명", status: "pending", activeForm: "Step 1 진행 중" },
  { content: "Step 2 설명", status: "pending", activeForm: "Step 2 진행 중" },
  { content: "Step 3 설명", status: "pending", activeForm: "Step 3 진행 중" }
]
```

이를 통해:

- 구현 단계별 진행 상황을 시각적으로 추적
- 사용자에게 현재 진행 상태 공유
- 복잡한 작업에서 누락 방지

### 5. 명세서 검증

spec-validator agent를 호출하여 명세서 품질을 검증합니다:

검증 기준:

- [ ] 모든 파일 경로가 명시됨
- [ ] 모든 함수 시그니처가 정의됨
- [ ] 에러 처리 방식이 명시됨
- [ ] 테스트 케이스가 포함됨
- [ ] 구현 순서가 의존성을 고려함
- [ ] 모호한 표현이 없음 ("적절히", "필요에 따라" 등 금지)

### 6. 산출물 생성

`.claude/simple-engineering/specs/{task-id}.md`에 저장합니다:

```markdown
# Specification: [Task Name]

**ID**: spec-YYYYMMDD-HHMMSS
**Research Reference**: [research-id]
**Date**: [Date]
**Status**: draft | validated | approved

## Overview

[명세서 요약]

## Design Decisions

- Decision 1: [내용] - [근거]
- Decision 2: [내용] - [근거]

## File Changes

### [파일 경로 1] (수정)

**Purpose**: [목적]
```

[구체적인 코드 변경 내용]

```

### [파일 경로 2] (생성)
**Purpose**: [목적]
```

[전체 파일 내용 또는 구조]

````

## Type Definitions
```typescript
[타입 정의]
````

## Error Handling

| Error Type | Condition | Response    |
| ---------- | --------- | ----------- |
| [Type]     | [조건]    | [처리 방식] |

## Test Cases

| ID  | Description | Input  | Expected Output |
| --- | ----------- | ------ | --------------- |
| T1  | [설명]      | [입력] | [출력]          |

## Implementation Order

1. [Step] - [파일] - [의존성]

## Validation Checklist

- [ ] File paths specified
- [ ] Function signatures defined
- [ ] Error handling defined
- [ ] Test cases included
- [ ] No ambiguous language

```

### 7. 다음 단계 안내

```

Planning Phase 완료!

산출물: .claude/simple-engineering/specs/{task-id}.md
검증 상태: [validated/needs-review]

다음 단계로 진행하려면:
/simple-engineering:implement .claude/simple-engineering/specs/{task-id}.md

```

## 사용할 Skills

이 명령어 수행 시 `spec-writing` skill을 로드하여 명세서 작성 가이드를 적용합니다.

## 사용할 Agents

- **spec-validator**: 명세서 품질 검증
- **verifier**: 설계 결정 체크포인트 관리
```
