---
name: research-methodology
description: 체계적인 조사 방법론을 제공합니다. Research Phase에서 가정과 사실을 구분하고, 검증 가능한 형태로 발견 사항을 정리하는 방법을 안내합니다.
when_to_use: Research Phase 수행 시, 코드베이스 조사 시, 문제 분석 시
---

# Research Methodology Skill

## 개요

이 Skill은 효과적인 기술 조사를 위한 체계적인 방법론을 제공합니다.
핵심은 **가정과 사실을 명확히 구분**하고, **검증 가능한 형태**로 발견 사항을 정리하는 것입니다.

## 조사 프레임워크

### 1. 문제 정의 (Problem Framing)

조사를 시작하기 전에 문제를 명확히 정의합니다:

```markdown
## Problem Statement

### What
[무엇을 해결/구현해야 하는가?]

### Why
[왜 이것이 필요한가?]

### Constraints
[제약 조건은 무엇인가?]

### Success Criteria
[성공을 어떻게 측정하는가?]
```

### 2. 조사 영역 (Investigation Areas)

체계적으로 조사할 영역을 정의합니다:

| 영역 | 질문 | 방법 |
|------|------|------|
| **Context** | 이 코드/시스템의 맥락은? | 파일 구조, 문서 검토 |
| **Current State** | 현재 어떻게 동작하는가? | 코드 분석, 실행 테스트 |
| **Dependencies** | 무엇에 의존하는가? | import 분석, 호출 추적 |
| **Constraints** | 기술적 제약은? | 설정 파일, 환경 검토 |
| **History** | 왜 이렇게 되었는가? | git history, 주석 검토 |

### 3. 증거 기반 발견 (Evidence-Based Findings)

모든 발견 사항에 증거를 첨부합니다:

```markdown
## Finding: [발견 사항 제목]

**Claim**: [주장/발견]

**Evidence**:
- File: `path/to/file.ts:42`
- Code: `relevantCodeSnippet()`
- Test: [재현 방법]

**Confidence**: High / Medium / Low

**Implications**: [이 발견의 의미]
```

### 4. 가정 vs 사실 구분

#### 사실 (Fact)
- 코드에서 직접 확인됨
- 테스트로 검증됨
- 문서에 명시됨

#### 가정 (Assumption)
- 추론으로 도출됨
- 간접적 증거만 있음
- 검증이 필요함

```markdown
## Assumptions Register

| ID | Assumption | Basis | Risk if Wrong | Verification |
|----|------------|-------|---------------|--------------|
| A1 | [가정] | [근거] | [틀릴 경우 위험] | [검증 방법] |
```

## 조사 패턴

### Pattern 1: Outside-In

전체 구조에서 세부사항으로:
1. 디렉토리 구조 파악
2. 주요 진입점 식별
3. 핵심 모듈 분석
4. 세부 구현 조사

### Pattern 2: Data Flow

데이터 흐름 추적:
1. 입력 지점 식별
2. 변환 과정 추적
3. 출력 지점 확인
4. 에러 경로 파악

### Pattern 3: Dependency Chain

의존성 체인 분석:
1. 대상 모듈 식별
2. 상위 의존성 (이 모듈이 사용하는 것)
3. 하위 의존성 (이 모듈을 사용하는 것)
4. 순환 의존성 확인

## 체크포인트 활용

### 언제 체크포인트를 만드는가?

1. **중요한 가정 도출 시**
   - 코드에서 직접 확인할 수 없는 동작 추론
   - 비즈니스 로직에 대한 해석

2. **분기점 발견 시**
   - 여러 가능한 해석이 있을 때
   - 구현 방향을 결정해야 할 때

3. **위험 발견 시**
   - 잠재적 버그나 문제점
   - 성능 이슈나 보안 취약점

### 체크포인트 형식

```markdown
<checkpoint type="assumption" id="cp-XXX">
## Verification Required

**Context**: [발견 맥락]

**Assumption**: [가정 내용]

**Evidence**:
- [증거 1]
- [증거 2]

**Risk if Wrong**: [틀릴 경우 영향]

**Please verify**:
1. [구체적 질문 1]
2. [구체적 질문 2]

---
`continue` - 가정이 맞음
`skip` - 나중에 확인
[직접 입력] - 수정 사항 제공
</checkpoint>
```

## 산출물 템플릿

### Research Document Structure

```markdown
# Research: [Task Name]

**ID**: research-YYYYMMDD-HHMMSS
**Status**: [in-progress | completed]
**Confidence**: [High | Medium | Low]

## Executive Summary
[2-3문장 핵심 요약]

## Problem Statement
[문제 정의]

## Investigation Log

### Area 1: [영역명]
**Method**: [조사 방법]
**Findings**:
- Finding 1: [내용] (Evidence: [증거])
- Finding 2: [내용] (Evidence: [증거])

### Area 2: [영역명]
...

## Key Findings
[핵심 발견 사항 목록]

## Assumptions
| ID | Assumption | Status | Verified By |
|----|------------|--------|-------------|
| A1 | [가정] | verified/pending/rejected | [검증자/방법] |

## Risks & Concerns
[위험 요소 및 우려 사항]

## Recommendations
[다음 단계 권장 사항]

## Open Questions
[아직 답을 찾지 못한 질문들]

## References
[참조한 파일, 문서, 외부 자료]
```

## 도구 활용 가이드

### 코드 탐색
- `Glob`: 파일 패턴으로 관련 파일 찾기
- `Grep`: 키워드로 코드 내 사용처 찾기
- `Read`: 파일 내용 확인

### 의존성 분석
```bash
# import 문 찾기
grep -r "import.*from" src/

# 특정 모듈 사용처
grep -r "ModuleName" src/
```

### 히스토리 분석
```bash
# 파일 변경 이력
git log --oneline path/to/file

# 특정 시점의 코드
git show commit:path/to/file
```

## 품질 체크리스트

조사 완료 전 확인:

- [ ] 문제가 명확히 정의됨
- [ ] 모든 영역이 조사됨
- [ ] 발견 사항에 증거가 첨부됨
- [ ] 가정이 명시적으로 기록됨
- [ ] 중요한 가정은 체크포인트로 검증 요청됨
- [ ] 다음 단계가 명확함
