---
name: simple:analyze
description: Essential vs Accidental 복잡성을 분석하여 단순화 기회를 식별합니다.
arguments:
  - name: target
    description: 분석할 코드, 파일, 또는 시스템
    required: true
  - name: depth
    description: 분석 깊이 (shallow, medium, deep)
    required: false
    default: medium
---

# Complexity Analysis - Simple Engineering

당신은 **복잡성 분석**을 수행합니다. Simple vs Easy, Essential vs Accidental 복잡성을 구분하여 진정한 단순화 기회를 식별합니다.

## 대상: $ARGUMENTS.target
## 깊이: $ARGUMENTS.depth

## 핵심 개념

### Simple vs Easy

| Simple (단순함) | Easy (쉬움) |
|----------------|------------|
| 구조적 무결성 | 접근성 |
| 엮임(Interleaving)이 적음 | 익숙함 |
| 장기적 이해 용이 | 단기적 사용 용이 |
| 변경 영향 범위 작음 | 학습 곡선 낮음 |

**목표**: Easy가 아닌 Simple을 추구

### Essential vs Accidental Complexity

| Essential (본질적) | Accidental (부수적) |
|-------------------|-------------------|
| 문제 도메인 고유 | 기술적 선택으로 발생 |
| 제거 불가능 | 제거/감소 가능 |
| 비즈니스 요구사항 | 구현 결정 |

**목표**: Accidental Complexity 최소화

## 분석 절차

### 1. 대상 파악

분석 대상을 탐색하고 범위를 정의합니다:

```
Analysis Target:
- Scope: [파일/모듈/시스템]
- Size: [크기 메트릭]
- Depth: [shallow/medium/deep]
```

### 2. 복잡성 지표 측정

#### 구조적 복잡성
- **Coupling**: 모듈 간 의존성 수준
- **Cohesion**: 모듈 내부 응집도
- **Depth**: 추상화 계층 깊이
- **Width**: 동일 레벨의 컴포넌트 수

#### 인지적 복잡성
- **Indirection**: 코드 흐름을 따라가기 위한 점프 수
- **Abstraction**: 이해해야 할 추상화 개념 수
- **State**: 추적해야 할 상태 수
- **Branching**: 조건 분기 복잡도

### 3. Essential vs Accidental 분류

각 복잡성 요소를 분류합니다:

```
Complexity Classification:

## Essential Complexity
| 요소 | 이유 | 수준 |
|------|------|------|
| [요소] | [비즈니스 필수] | High/Medium/Low |

## Accidental Complexity
| 요소 | 원인 | 개선 가능성 |
|------|------|------------|
| [요소] | [기술적 선택] | High/Medium/Low |
```

### 4. 단순화 기회 식별

#### 제거 가능한 복잡성
```
Removable Complexity:
1. [복잡성 요소]
   - Current: [현재 상태]
   - Proposed: [제안]
   - Impact: [영향]
```

#### 감소 가능한 복잡성
```
Reducible Complexity:
1. [복잡성 요소]
   - Current: [현재 상태]
   - Proposed: [제안]
   - Tradeoff: [트레이드오프]
```

#### 수용해야 할 복잡성
```
Accepted Complexity:
1. [복잡성 요소]
   - Reason: [수용 이유]
   - Mitigation: [완화 방법]
```

### 5. 엮임(Interleaving) 분석

Simple의 핵심은 엮임의 부재입니다:

```
Interleaving Analysis:

High Interleaving (문제):
- [컴포넌트 A] ↔ [컴포넌트 B]: [엮임 설명]
  - 영향: 한 쪽 변경이 다른 쪽에 영향

Low Interleaving (양호):
- [컴포넌트 C] → [컴포넌트 D]: [독립적 관계]
  - 이유: 명확한 인터페이스로 분리
```

### 6. 권장 사항

```
## Recommendations

### High Priority (Accidental, High Impact)
1. [권장사항]
   - Why: [이유]
   - How: [방법]
   - Risk: [위험]

### Medium Priority
2. [권장사항]

### Low Priority
3. [권장사항]

### Accept As-Is
- [수용할 복잡성과 이유]
```

### 7. 산출물

```markdown
# Complexity Analysis: [Target]

**Date**: [Date]
**Depth**: [shallow/medium/deep]

## Executive Summary
[2-3문장 요약]

## Complexity Metrics

| Metric | Value | Assessment |
|--------|-------|------------|
| Coupling | [값] | [평가] |
| Cohesion | [값] | [평가] |
| Cognitive Load | [값] | [평가] |

## Essential Complexity
[본질적 복잡성 목록]

## Accidental Complexity
[부수적 복잡성 목록]

## Interleaving Map
[엮임 관계 시각화]

## Simplification Opportunities
[단순화 기회 목록]

## Recommendations
[우선순위별 권장사항]

## Tradeoffs
[단순화 시 트레이드오프]
```

### 8. 출력

```
Complexity Analysis 완료!

=== Summary ===
Essential Complexity: [High/Medium/Low]
Accidental Complexity: [High/Medium/Low]
Simplification Potential: [High/Medium/Low]

=== Top Opportunities ===
1. [기회 1]
2. [기회 2]
3. [기회 3]

상세 분석: .claude/simple-engineering/analysis/{id}.md
```

## 분석 깊이

### Shallow
- 파일/디렉토리 구조 수준
- 명시적 의존성만 분석
- 빠른 개요 제공

### Medium (기본)
- 모듈/클래스 수준
- 호출 관계 분석
- 주요 복잡성 식별

### Deep
- 함수/메서드 수준
- 데이터 흐름 분석
- 상세한 엮임 분석

## 사용할 Agents

- **complexity-analyst**: 상세 복잡성 분석 수행
- **compressor**: 분석 결과 압축 및 요약
