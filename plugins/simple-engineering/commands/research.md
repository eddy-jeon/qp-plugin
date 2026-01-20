---
name: simple:research
description: 체계적 조사 및 분석을 수행하고, 인간 검증 체크포인트를 통해 가정과 사실을 구분합니다.
arguments:
  - name: task
    description: 조사할 작업 또는 주제
    required: true
---

# Research Phase - Simple Engineering

당신은 **Research Phase**를 수행합니다. 이 단계의 목표는 구현 전에 철저한 조사를 통해 **Earned Understanding(축적된 이해)**을 구축하는 것입니다.

## 작업: $ARGUMENTS.task

## 수행 절차

### 1. 상태 초기화

먼저 상태 디렉토리를 확인하고 초기화합니다:

```bash
mkdir -p .claude/simple-engineering/{research,specs,checkpoints}
```

고유 ID를 생성합니다 (예: `research-$(date +%Y%m%d-%H%M%S)`).

### 2. 체계적 조사

다음 영역을 순차적으로 조사합니다:

#### 2.1 현재 상태 파악

- 관련 코드/파일 탐색
- 기존 구현 분석
- 의존성 파악

#### 2.2 문제/요구사항 정의

- 해결해야 할 핵심 문제 식별
- 제약 조건 파악
- 성공 기준 정의

#### 2.3 가정 도출

**중요**: 조사 중 도출된 모든 가정을 명시적으로 기록합니다.

가정을 발견할 때마다 다음 형식으로 체크포인트를 생성합니다:

```
<checkpoint type="assumption" id="cp-XXX">
## 검증 필요

**가정**: [가정 내용]
**근거**: [이 가정을 하게 된 근거]
**검증 요청**: [사용자에게 확인받고 싶은 질문]

---
이 가정이 맞는지 확인해 주세요. `continue`로 진행하거나 수정 사항을 알려주세요.
</checkpoint>
```

### 3. 복잡성 분석

조사 결과를 바탕으로 복잡성을 분석합니다:

#### Essential Complexity (본질적 복잡성)

- 문제 도메인에서 피할 수 없는 복잡성
- 비즈니스 로직의 고유한 복잡성

#### Accidental Complexity (부수적 복잡성)

- 기술적 선택으로 인해 발생한 복잡성
- 제거하거나 단순화할 수 있는 부분

### 4. 산출물 생성

조사가 완료되면 `.claude/simple-engineering/research/{task-id}.md`에 다음 형식으로 저장합니다:

```markdown
# Research: [Task Name]

**ID**: research-YYYYMMDD-HHMMSS
**Date**: [Date]
**Status**: completed | in-progress

## Executive Summary

[2-3문장 요약]

## Problem Statement

[해결해야 할 문제]

## Current State Analysis

[현재 상태 분석 결과]

## Assumptions (Verified)

- [ ] Assumption 1: [내용] - verified/pending/rejected
- [ ] Assumption 2: [내용] - verified/pending/rejected

## Complexity Analysis

### Essential

- [본질적 복잡성 항목]

### Accidental

- [부수적 복잡성 항목]

## Key Findings

[핵심 발견 사항]

## Recommendations

[다음 단계 권장 사항]

## Checkpoints Log

- cp-001: [가정] - [상태]
- cp-002: [결정] - [상태]
```

### 5. 다음 단계 안내

Research가 완료되면 사용자에게 안내합니다:

```
Research Phase 완료!

산출물: .claude/simple-engineering/research/{task-id}.md

다음 단계로 진행하려면:
/simple-engineering:plan .claude/simple-engineering/research/{task-id}.md
```

## 권장 모드 동작

- 체크포인트에서 사용자 응답을 기다리되, `skip`으로 건너뛸 수 있습니다
- 건너뛴 체크포인트는 산출물에 `skipped` 상태로 기록됩니다
- 모든 가정이 검증되지 않아도 다음 단계로 진행할 수 있지만, 경고 메시지를 표시합니다

## 사용할 Skills

이 명령어 수행 시 `research-methodology` skill을 로드하여 체계적인 조사 방법론을 적용합니다.

## 사용할 Agents

필요 시 다음 agent를 활용합니다:

- **verifier**: 체크포인트 관리 및 검증 요청
- **complexity-analyst**: 복잡성 분석 수행
