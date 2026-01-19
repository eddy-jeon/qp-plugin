---
name: simple:implement
description: 명세서를 기반으로 One-shot 코드 생성을 수행합니다. 대화의 소용돌이를 방지합니다.
arguments:
  - name: spec-file
    description: 명세서 파일 경로 (예: .claude/simple-engineering/specs/spec-xxx.md)
    required: true
---

# Implementation Phase - Simple Engineering

당신은 **Implementation Phase**를 수행합니다. 이 단계의 목표는 명세서를 기반으로 **One-shot** 코드 생성을 수행하여 "대화의 소용돌이(Conversation Spiral)"를 방지하는 것입니다.

## Spec 파일: $ARGUMENTS.spec-file

## 핵심 원칙

### One-shot Implementation
- 명세서에 모든 정보가 있으므로 추가 질문 없이 구현
- "대화의 소용돌이" 방지: 반복적인 수정 요청 최소화
- 명세서에 없는 내용은 구현하지 않음

### Paint-by-Numbers 실행
- 명세서의 파일 경로를 **정확히** 따름
- 명세서의 시그니처를 **정확히** 구현
- 명세서의 에러 처리를 **정확히** 적용

## 수행 절차

### 1. 명세서 검증

먼저 명세서를 읽고 구현에 필요한 모든 정보가 있는지 확인합니다:

```
Spec Validation Checklist:
- [ ] File paths: 모든 파일 경로가 명시됨
- [ ] Signatures: 함수/클래스 시그니처가 정의됨
- [ ] Types: 데이터 타입이 정의됨
- [ ] Errors: 에러 처리 방식이 명시됨
- [ ] Order: 구현 순서가 명시됨
```

**누락된 정보가 있는 경우**:
```
명세서에 다음 정보가 누락되었습니다:
- [누락 항목]

/simple:plan 으로 돌아가 명세서를 보완하거나,
continue 입력 시 최선의 판단으로 진행합니다.
```

### 2. 구현 순서 확인

명세서의 Implementation Order를 따릅니다:

```
Implementation Plan:
1. [Step 1] - [파일] ⏳ Pending
2. [Step 2] - [파일] ⏳ Pending
3. [Step 3] - [파일] ⏳ Pending
```

### 3. 단계별 구현

각 단계를 순차적으로 구현합니다:

```
=== Step 1/N: [파일명] ===
Status: 🔄 In Progress

[구현 수행]

Status: ✅ Complete
```

### 4. 구현 중 원칙

#### DO:
- 명세서에 명시된 대로 정확히 구현
- 명시된 에러 처리 적용
- 명시된 테스트 케이스 구현

#### DON'T:
- 명세서에 없는 "개선" 추가하지 않음
- 추가 기능 제안하지 않음
- 구조 변경 제안하지 않음

#### 불명확한 경우:
명세서에 명시되지 않은 세부사항은 다음 우선순위로 결정:
1. 기존 코드베이스의 패턴 따름
2. 언어/프레임워크의 관례 따름
3. 가장 단순한 방법 선택

### 5. 검증

구현 완료 후 명세서와 대조 검증합니다:

```
Implementation Verification:

Files Created/Modified:
- [x] path/to/file1.ts ✅
- [x] path/to/file2.ts ✅

Function Signatures:
- [x] functionA(param: Type): ReturnType ✅
- [x] functionB(param: Type): ReturnType ✅

Test Cases:
- [x] T1: [Description] ✅
- [x] T2: [Description] ✅

Error Handling:
- [x] ErrorType1: [Handling] ✅
- [x] ErrorType2: [Handling] ✅
```

### 6. 테스트 실행

명세서에 테스트가 포함된 경우 실행합니다:

```bash
# 프로젝트의 테스트 명령어 실행
npm test  # 또는 적절한 테스트 명령어
```

### 7. 완료 보고

```
Implementation Phase 완료!

=== Summary ===
Files Modified: N
Files Created: N
Tests: N passed, N failed

=== Changes ===
- path/to/file1.ts: [변경 요약]
- path/to/file2.ts: [변경 요약]

=== Spec Compliance ===
All items: ✅ Implemented as specified

=== Notes ===
[구현 중 발견한 특이사항, 있는 경우]
```

### 8. 불일치 처리

명세서와 다르게 구현해야 하는 경우:

```
<checkpoint type="deviation" id="cp-XXX">
## 명세서 불일치

**명세서 내용**: [원래 명세]
**실제 구현**: [변경된 구현]
**이유**: [변경 이유]

---
이 변경이 적절한지 확인해 주세요.
</checkpoint>
```

## 권장 모드 동작

- 명세서가 불완전해도 경고 후 진행 가능
- 불일치 발생 시 체크포인트로 알림
- 사용자가 `skip`으로 검증 생략 가능

## 사용할 Agents

- **verifier**: 불일치 체크포인트 관리
- **spec-validator**: 구현 후 명세서 대조 검증
