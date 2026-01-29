---
name: spec-compliance
description: 요구사항 충족도 평가 기준. Jira 티켓의 요구사항 대비 구현 완성도를 평가합니다.
when_to_use: spec-reviewer agent가 요구사항 리뷰 시 평가 기준으로 사용
---

# Specification Compliance Evaluation

## 개요

Jira 티켓에 명시된 요구사항 대비 실제 구현의 완성도를 평가합니다.

## 평가 카테고리

### 1. 기능 요구사항 (40점)

Jira 티켓의 Description에 명시된 핵심 기능 구현 여부:

| 상태 | 배점 | 설명 |
|------|------|------|
| Fulfilled | 100% | 완전히 구현됨 |
| Partial | 50% | 일부만 구현됨 |
| Missing | 0% | 구현되지 않음 |

**평가 기준**:
- 티켓에서 요구하는 모든 기능이 구현되었는가
- 기능이 의도한 대로 동작하는가
- 필요한 UI 요소가 모두 포함되었는가

### 2. Acceptance Criteria (25점)

티켓에 정의된 인수 조건 충족 여부:

**평가 기준**:
- 각 AC 항목별 충족 여부 체크
- AC가 명확하지 않은 경우 합리적 해석 적용
- AC가 없는 경우: Description 기반으로 핵심 요구사항 도출

### 3. 엣지 케이스 (15점)

명시적/암묵적 엣지 케이스 처리:

**평가 기준**:
- 빈 데이터 처리 (empty state)
- 에러 상태 처리
- 로딩 상태 처리
- 경계값 처리 (최대/최소)
- null/undefined 방어 코드

### 4. 비기능 요구사항 (10점)

티켓에 명시된 비기능적 요구사항:

**평가 기준**:
- 성능 요구사항 (명시된 경우)
- 접근성 요구사항 (명시된 경우)
- 브라우저 호환성 (명시된 경우)
- 반응형 요구사항 (명시된 경우)

### 5. 통합 요구사항 (10점)

다른 시스템/컴포넌트와의 통합:

**평가 기준**:
- API 연동 (명시된 경우)
- 기존 컴포넌트 재사용 (명시된 경우)
- 상태 관리 통합 (명시된 경우)
- 라우팅 통합 (명시된 경우)

## 점수 계산

```
최종 점수 = (기능 점수 × 0.4) + (AC 점수 × 0.25) + (엣지케이스 점수 × 0.15)
          + (비기능 점수 × 0.1) + (통합 점수 × 0.1)
```

### 통과 기준

- **80점 이상**: 통과
- **80점 미만**: 추가 구현 필요

## 출력 형식

### JSON 구조

```json
{
  "score": 85,
  "passed": true,
  "requirements": [
    {
      "category": "functional",
      "requirement": "사용자 프로필 편집 기능",
      "status": "fulfilled",
      "evidence": "ProfileEditForm 컴포넌트에서 이름, 이메일, 프로필 이미지 편집 구현",
      "points": 40
    },
    {
      "category": "acceptance_criteria",
      "requirement": "AC1: 저장 버튼 클릭 시 API 호출",
      "status": "fulfilled",
      "evidence": "handleSubmit에서 updateProfile API 호출",
      "points": 12.5
    },
    {
      "category": "acceptance_criteria",
      "requirement": "AC2: 성공 시 토스트 메시지 표시",
      "status": "partial",
      "evidence": "성공 토스트는 있으나 실패 토스트 미구현",
      "points": 6.25,
      "gap": "실패 시 토스트 메시지 추가 필요"
    },
    {
      "category": "edge_case",
      "requirement": "빈 프로필 이미지 처리",
      "status": "fulfilled",
      "evidence": "기본 아바타 이미지 fallback 구현",
      "points": 7.5
    },
    {
      "category": "non_functional",
      "requirement": "이미지 업로드 5MB 제한",
      "status": "missing",
      "evidence": "파일 크기 검증 로직 없음",
      "points": 0,
      "gap": "이미지 업로드 시 파일 크기 검증 추가 필요"
    },
    {
      "category": "integration",
      "requirement": "전역 상태 업데이트",
      "status": "fulfilled",
      "evidence": "저장 성공 시 UserContext 업데이트",
      "points": 10
    }
  ],
  "summary": "전체 요구사항 충족도 요약",
  "missingImplementations": [
    {
      "requirement": "AC2: 실패 시 토스트 메시지",
      "suggestion": "handleSubmit의 catch 블록에서 toast.error 호출 추가"
    },
    {
      "requirement": "이미지 업로드 크기 제한",
      "suggestion": "onFileChange에서 file.size 검증 추가"
    }
  ]
}
```

## 리뷰 수행 가이드

### 1. 요구사항 파싱

Jira 티켓에서 다음 정보 추출:
- **Title**: 핵심 기능 요약
- **Description**: 상세 요구사항
- **Acceptance Criteria**: 인수 조건 목록
- **Labels/Components**: 비기능 요구사항 힌트

### 2. 구현 분석

변경된 파일에서:
- 새로 추가된 컴포넌트/함수 식별
- API 호출 로직 확인
- 상태 관리 로직 확인
- UI 렌더링 로직 확인

### 3. 매핑 및 평가

각 요구사항에 대해:
1. 관련 구현 코드 찾기
2. 충족 상태 판단 (fulfilled/partial/missing)
3. 증거(evidence) 기록
4. 미충족 시 gap 설명

### 4. 피드백 생성

- 각 요구사항별 상태와 증거
- 미충족 항목에 대한 구체적 구현 제안
- 전체 요약

## 특수 케이스

### AC가 없는 티켓

Description 기반으로 합리적인 AC 도출:
- "~해야 한다" 형태의 문장을 AC로 변환
- 일반적인 UX 기대사항 추가

### 모호한 요구사항

합리적 해석 적용 후 명시:
- 해석 근거 기록
- 다른 해석 가능성 언급

### 범위 외 요구사항

티켓에 없지만 관련된 요구사항:
- references로 분류
- 점수에 반영하지 않음
- 별도 티켓 생성 권장
