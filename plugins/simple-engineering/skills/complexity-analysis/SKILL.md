---
name: complexity-analysis
description: Essential vs Accidental 복잡성 분석 프레임워크를 제공합니다. Simple과 Easy를 구분하고, 진정한 단순화 기회를 식별합니다.
when_to_use: 복잡성 분석 시, 리팩토링 계획 시, 아키텍처 검토 시
---

# Complexity Analysis Skill

## 개요

이 Skill은 소프트웨어 복잡성을 체계적으로 분석하는 프레임워크를 제공합니다.
핵심은 **Simple vs Easy**, **Essential vs Accidental** 복잡성을 구분하여 올바른 단순화 전략을 수립하는 것입니다.

## 핵심 개념

### Simple vs Easy

Rich Hickey의 "Simple Made Easy"에서:

```
Simple (단순함)          Easy (쉬움)
─────────────────────────────────────────
하나의 역할/개념          익숙함
엮임(interleaving) 없음   가까이 있음
객관적                   주관적
변경 영향 범위 작음       학습 비용 낮음
```

**예시**:
```
Simple but not Easy:
- Lisp의 S-expressions
- Unix pipes

Easy but not Simple:
- ORM의 마법 메서드
- 프레임워크의 암묵적 설정

Simple AND Easy:
- Python의 list comprehension
- HTTP의 GET/POST
```

### Essential vs Accidental Complexity

Fred Brooks의 "No Silver Bullet"에서:

```
Essential (본질적)        Accidental (부수적)
─────────────────────────────────────────
문제 도메인 고유          기술 선택으로 발생
제거 불가능              제거/감소 가능
비즈니스 요구사항         구현 결정
```

**예시**:
```
Essential:
- 결제 시스템의 거래 무결성
- 의료 시스템의 데이터 검증
- 금융의 규제 준수 로직

Accidental:
- 프레임워크 보일러플레이트
- 레거시 호환성 레이어
- 불필요한 추상화 계층
```

## 분석 프레임워크

### 1. 복잡성 지표

#### 구조적 지표

| 지표 | 측정 방법 | 문제 신호 |
|------|----------|----------|
| **Coupling** | 모듈 간 의존성 수 | 순환 의존성, 과도한 import |
| **Cohesion** | 모듈 내 관련성 | God object, 유틸리티 덤프 |
| **Depth** | 추상화 계층 수 | 5단계 이상 상속, 과도한 래핑 |
| **Width** | 동일 레벨 컴포넌트 수 | 15+ 형제 모듈 |

#### 인지적 지표

| 지표 | 측정 방법 | 문제 신호 |
|------|----------|----------|
| **Indirection** | 코드 흐름 추적 점프 수 | 3회 이상 파일 이동 |
| **State** | 추적해야 할 변수 수 | 5개 이상 상태 변수 |
| **Branching** | 조건 분기 수 (Cyclomatic) | 10 이상 |
| **Naming** | 이름만으로 이해 가능 여부 | 약어, 모호한 이름 |

### 2. 엮임(Interleaving) 분석

Simple의 핵심은 **엮임의 부재**:

```
높은 엮임 (문제):
┌─────────────────┐
│  Component A    │
│  ┌───────────┐  │
│  │ Component │  │
│  │    B      │  │
│  └───────────┘  │
└─────────────────┘

낮은 엮임 (양호):
┌──────────┐    ┌──────────┐
│Component │───>│Component │
│    A     │    │    B     │
└──────────┘    └──────────┘
    명확한 인터페이스
```

#### 엮임 유형

| 유형 | 설명 | 예시 |
|------|------|------|
| **State** | 공유 상태 | 전역 변수, 싱글톤 남용 |
| **Order** | 실행 순서 의존 | 초기화 순서 민감 |
| **Name** | 이름 공간 충돌 | 같은 이름 다른 의미 |
| **Value** | 값 표현 혼재 | 문자열로 여러 의미 표현 |
| **Time** | 시간 의존성 | 타이밍 민감한 코드 |

### 3. 복잡성 분류 매트릭스

```
                    Essential           Accidental
              ┌───────────────────┬───────────────────┐
    High      │ Inherent          │ Removable         │
    Impact    │ (수용, 캡슐화)    │ (우선 제거)       │
              ├───────────────────┼───────────────────┤
    Low       │ Required          │ Ignorable         │
    Impact    │ (유지)            │ (무시 가능)       │
              └───────────────────┴───────────────────┘
```

## 분석 절차

### Phase 1: 매핑

```markdown
## Complexity Map

### Module: [모듈명]

**Responsibilities**:
1. [책임 1]
2. [책임 2]

**Dependencies**:
- Incoming: [이 모듈을 사용하는 것]
- Outgoing: [이 모듈이 사용하는 것]

**Complexity Indicators**:
| Indicator | Value | Assessment |
|-----------|-------|------------|
| Lines of Code | XXX | - |
| Cyclomatic | XXX | - |
| Coupling | XXX | - |
```

### Phase 2: 분류

```markdown
## Complexity Classification

### Essential Complexity

| Element | Reason | Mitigation |
|---------|--------|------------|
| [요소] | [비즈니스 필수 이유] | [복잡성 관리 방법] |

### Accidental Complexity

| Element | Cause | Removal Strategy |
|---------|-------|------------------|
| [요소] | [발생 원인] | [제거/감소 방법] |
```

### Phase 3: 우선순위

```markdown
## Simplification Priority

### Priority 1: High Impact, Accidental
[가장 먼저 제거해야 할 복잡성]

### Priority 2: High Impact, Essential
[캡슐화/추상화로 관리해야 할 복잡성]

### Priority 3: Low Impact, Accidental
[시간 있을 때 정리]

### Priority 4: Low Impact, Essential
[그대로 유지]
```

## 단순화 전략

### 전략 1: Decomplect (분리하기)

엮인 것들을 풀어서 분리:

```
Before:
function processOrder(order) {
  validate(order);
  calculateTax(order);
  updateInventory(order);
  sendEmail(order);
  logAnalytics(order);
}

After:
// 각 관심사를 분리
const validated = validate(order);
const withTax = calculateTax(validated);
await updateInventory(withTax);
await notify(withTax);  // 이메일, 분석 등 별도 처리
```

### 전략 2: 값으로 표현 (Values over References)

```
Before:
class User {
  updateEmail(newEmail) {
    this.email = newEmail;  // 참조를 통한 변경
  }
}

After:
function updateUserEmail(user, newEmail) {
  return { ...user, email: newEmail };  // 새 값 반환
}
```

### 전략 3: 명시적으로 만들기 (Make It Explicit)

```
Before:
// 암묵적 동작
@Transactional
@Validated
@Cached(ttl = "1h")
async function getUser(id) { ... }

After:
// 명시적 동작
async function getUser(id) {
  return withTransaction(async () => {
    const input = validate(id, IdSchema);
    return withCache('1h', async () => {
      return db.users.find(input);
    });
  });
}
```

### 전략 4: 경계 정의 (Define Boundaries)

```
┌─────────────────────────────────────────┐
│              Application                │
│  ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  │ Domain   │ │ Domain   │ │ Domain │  │
│  │    A     │ │    B     │ │   C    │  │
│  └────┬─────┘ └────┬─────┘ └───┬────┘  │
│       │            │           │        │
│  ┌────┴────────────┴───────────┴────┐  │
│  │        Integration Layer          │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## 레드 플래그

복잡성 문제를 나타내는 신호:

### 코드 레벨
- 500줄 이상의 파일
- 50줄 이상의 함수
- 5단계 이상의 중첩
- 10개 이상의 매개변수
- "Util", "Helper", "Manager" 클래스

### 아키텍처 레벨
- 순환 의존성
- God 모듈/클래스
- 산탄총 수술 (하나 바꾸면 여러 곳 변경)
- 기능 선망 (다른 모듈 데이터 과도하게 사용)

### 프로세스 레벨
- "역사적 이유"로 존재하는 코드
- 아무도 건드리기 두려워하는 코드
- 문서가 코드와 다른 부분

## 산출물 템플릿

```markdown
# Complexity Analysis: [Target]

**Date**: [Date]
**Analyst**: [Name/AI]

## Executive Summary
[주요 발견 사항 2-3문장]

## Complexity Metrics

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Coupling | X | <10 | ✅/⚠️/❌ |
| Cohesion | X | >0.7 | ✅/⚠️/❌ |
| Cyclomatic | X | <10 | ✅/⚠️/❌ |

## Essential Complexity
[수용해야 할 복잡성]

## Accidental Complexity
[제거 가능한 복잡성]

## Interleaving Analysis
[엮임 분석 결과]

## Recommendations
[우선순위별 권장 사항]

## Tradeoffs
[단순화 시 고려할 트레이드오프]
```
