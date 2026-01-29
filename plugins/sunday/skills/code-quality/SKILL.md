---
name: code-quality
description: frontend-doc 기반 코드 품질 평가 기준. frontend-doc에 명시된 규칙만 감점 대상으로 평가합니다.
when_to_use: code-reviewer agent가 코드 리뷰 시 평가 기준으로 사용
---

# Frontend Code Quality Evaluation

## 핵심 원칙

> ⚠️ **중요**: 프로젝트 상황이 이상적이지 않으므로 일반적인 코드 품질 기준이 아닌
> **frontend-doc에 명시된 가이드 준수 여부만** 점수로 평가합니다.

### 평가 철학

1. **frontend-doc이 유일한 기준**: 프로젝트에서 명시적으로 정의한 규칙만 감점 대상
2. **일반 품질은 참고 정보**: 베스트 프랙티스 위반은 알려주되 점수에 반영하지 않음
3. **frontend-doc 보강 제안**: 프로젝트에서 자주 사용되지만 문서화되지 않은 패턴 식별

## 점수 계산

### 기본 점수

- **시작 점수**: 100점
- **최종 점수**: 100점 - (violations의 deduction 합계)
- **통과 기준**: 80점 이상

### 감점 기준 (Violations)

frontend-doc에 명시된 규칙 위반 시에만 감점:

| 심각도 | 감점 | 설명 |
|--------|------|------|
| Critical | -20 | frontend-doc 핵심 규칙 위반 (아키텍처, 보안) |
| Major | -10 | frontend-doc 권장 패턴 미준수 |
| Minor | -5 | frontend-doc 스타일 가이드 위반 |

## 평가 영역

### 1. 감점 대상 (Violations) - frontend-doc 규칙만

다음 항목은 **frontend-doc에 명시된 경우에만** 감점:

- **컴포넌트 구조**: frontend-doc에 정의된 컴포넌트 구조 규칙
- **네이밍 컨벤션**: frontend-doc에 정의된 네이밍 규칙
- **상태 관리**: frontend-doc에 정의된 상태 관리 패턴
- **API 호출**: frontend-doc에 정의된 API 호출 방식
- **에러 처리**: frontend-doc에 정의된 에러 처리 방식
- **타입 정의**: frontend-doc에 정의된 타입 규칙
- **금지 패턴**: frontend-doc에서 명시적으로 금지한 패턴

### 2. 참고 정보 (References) - 감점 없음

다음 항목은 알려주되 **감점하지 않음**:

- 일반적인 React/TypeScript 베스트 프랙티스
- 성능 최적화 제안 (frontend-doc에 없는 경우)
- 접근성 개선 제안 (frontend-doc에 없는 경우)
- 코드 가독성 개선 제안
- 테스트 커버리지 제안

### 3. frontend-doc 보강 제안 (FrontendDocSuggestions)

프로젝트에서 반복 사용되지만 frontend-doc에 없는 패턴 식별:

- 자주 사용되는 패턴인데 문서화되지 않은 것
- 암묵적 규칙으로 보이는 것
- 문서화하면 일관성에 도움이 될 것

## 출력 형식

### JSON 구조

```json
{
  "score": 85,
  "passed": true,
  "violations": [
    {
      "severity": "major",
      "rule": "frontend-doc에 명시된 규칙 이름/섹션",
      "file": "apps/front/src/components/Example.tsx",
      "line": 42,
      "description": "위반 내용 설명",
      "suggestion": "수정 방법",
      "deduction": -10
    }
  ],
  "references": [
    {
      "type": "improvement",
      "file": "apps/front/src/components/Example.tsx",
      "line": 55,
      "description": "일반적인 개선 제안 (감점 아님)"
    }
  ],
  "frontendDocSuggestions": [
    {
      "topic": "에러 바운더리 사용법",
      "reason": "frontend-doc에 해당 내용이 없으나 프로젝트에서 자주 사용됨",
      "suggestedContent": "간략한 가이드 제안"
    }
  ],
  "summary": "전체 리뷰 요약"
}
```

## frontend-doc이 없는 경우

`apps/front/.claude/skills/frontend-doc`이 존재하지 않으면:

- **score**: 100점 (감점 대상 규칙 없음)
- **violations**: 빈 배열
- **references**: 일반적인 코드 품질 제안들
- **frontendDocSuggestions**: frontend-doc 생성 권장

## 리뷰 수행 가이드

### 1. frontend-doc 로드

```
apps/front/.claude/skills/frontend-doc/
├── SKILL.md (목차/개요)
├── architecture.md
├── components.md
├── state-management.md
├── api-patterns.md
└── ...
```

### 2. 변경사항 분석

```bash
git diff --name-only | grep "^apps/front/"
```

### 3. 규칙 대조

각 변경 파일에 대해:
1. frontend-doc의 관련 규칙 식별
2. 코드와 규칙 대조
3. 위반 사항 기록 (deduction 포함)
4. 일반 품질 이슈는 references에 기록

### 4. 피드백 생성

- violations: 구체적인 수정 방법 포함
- references: 참고하면 좋을 정보
- frontendDocSuggestions: 문서 보강 제안
