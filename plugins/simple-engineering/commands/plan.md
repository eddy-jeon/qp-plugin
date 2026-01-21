---
name: simple-engineering:plan
description: Research 결과를 바탕으로 Paint-by-Numbers 수준의 상세 명세서를 작성합니다.
arguments:
  - name: research-file
    description: Research 산출물 파일 경로 (예: .claude/simple-engineering/research/research-xxx.md)
    required: true
---

# Planning Phase - Simple Engineering

당신은 **Planning Phase**를 수행합니다. 이 단계의 목표는 구현 시 AI가 "추론"할 필요가 없도록 **Paint-by-Numbers** 수준의 상세 명세서를 작성하는 것입니다.

## ⚠️ 단계 전환 규칙 (필수)

**절대 원칙**: 사용자가 명시적으로 "구현 시작", "implement 진행", "plan 완료" 등을 말하기 전까지 **절대로 Implement 단계로 넘어가지 않습니다**.

### 피드백 루프 동작

1. **사용자 피드백 수신 시**: 현재 Plan 단계 내에서 피드백을 반영하여 명세서를 수정합니다
2. **설계 변경 요청 시**: 해당 내용을 명세서에 반영하고, 영향받는 부분을 재검토합니다
3. **단계 전환 요청 시에만**: Implement 단계 진행을 안내합니다

### 금지 사항

- ❌ 사용자 피드백을 받자마자 "그러면 Implement로 넘어가겠습니다" 금지
- ❌ 명세서 생성 후 자동으로 Implement 명령어 실행 금지
- ❌ "구현을 시작할까요?" 라고 먼저 제안하는 것 금지

### 허용 사항

- ✅ Plan이 충분히 완료되었다고 판단되면 **안내만** 제공
- ✅ 사용자가 명시적으로 요청하면 Implement 단계로 전환

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

### 7. 산출물 검토 및 피드백 요청

명세서 산출물을 생성한 후, **반드시 사용자와 함께 검토**합니다.

#### 7.1 명세서 요약 제시

명세서의 핵심 내용을 구조화하여 제시합니다:

```
---
📋 Planning Phase 산출물 생성 완료

산출물: .claude/simple-engineering/specs/{task-id}.md
검증 상태: [validated/needs-review]
---

## 📊 명세서 요약

### 설계 결정 사항
| 결정 | 선택 | 근거 |
|------|------|------|
| [결정1] | [선택한 옵션] | [이유] |
| [결정2] | [선택한 옵션] | [이유] |

### 파일 변경 계획
| 파일 | 작업 | 주요 변경 |
|------|------|----------|
| [파일1] | 수정 | [변경 내용 요약] |
| [파일2] | 생성 | [파일 목적] |

### 구현 순서
1. [Step 1] → 2. [Step 2] → 3. [Step 3]

### 테스트 계획
- 정상 케이스: [N]개
- 엣지 케이스: [M]개
- 에러 케이스: [K]개
```

#### 7.2 검토 요청 체크리스트

사용자에게 다음 항목을 **명시적으로 질문**합니다:

```
---
## 🔍 검토 요청

다음 항목을 확인해 주세요:

### 1. 설계 결정 검토
> 주요 설계 결정 [N]개:
> - [결정1]: [선택] 선택 (근거: [이유])
> - [결정2]: [선택] 선택 (근거: [이유])
- 이 설계 결정들이 적절한가요?
- 다른 접근 방식을 고려해야 할까요?

### 2. 파일 구조 검토
> 변경 예정 파일: [파일 목록]
- 파일 위치가 프로젝트 구조에 맞나요?
- 기존 패턴/컨벤션과 일치하나요?

### 3. 인터페이스 검토
> 주요 함수/타입:
> ```typescript
> [핵심 시그니처 요약]
> ```
- 네이밍이 적절한가요?
- 파라미터/리턴 타입이 맞나요?

### 4. 테스트 커버리지 검토
> 테스트 케이스 [N]개 계획됨
- 놓친 시나리오가 있나요?
- 특별히 중요한 엣지 케이스가 더 있나요?

### 5. 누락 확인
- 에러 처리에서 빠진 케이스가 있나요?
- 성능/보안 고려사항이 더 있나요?
- 기존 코드와의 호환성 이슈가 있나요?
---
```

#### 7.3 피드백 대기

```
💬 위 명세서를 검토하시고 피드백을 주세요.
   수정/보완이 필요하면 말씀해 주시고,
   구현 단계로 넘어가려면 "구현 시작"이라고 말씀해 주세요.
```

**중요**: 이 안내 후 사용자의 명시적 전환 요청이 있을 때까지 대기합니다. 사용자가 추가 피드백을 주면 명세서를 계속 수정/보완합니다.

## 사용할 Skills

이 명령어 수행 시 `spec-writing` skill을 로드하여 명세서 작성 가이드를 적용합니다.

## 사용할 Agents

- **spec-validator**: 명세서 품질 검증
- **verifier**: 설계 결정 체크포인트 관리
```
