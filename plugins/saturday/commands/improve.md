---
name: saturday:improve
description: 기존 브랜치의 코드를 리뷰하고 80점 이상 통과할 때까지 개선합니다.
arguments:
  - name: branch
    description: 개선할 브랜치명 (생략 시 현재 브랜치)
    required: false
  - name: guide-branch
    description: frontend-doc을 참조할 브랜치 (기본값: develop)
    required: false
---

# /saturday:improve - 기존 브랜치 개선

기존 브랜치의 변경사항을 코드 리뷰하고, **80점 이상 통과할 때까지** 자동으로 개선합니다.

## 워크플로우

```
브랜치 확인 → 변경사항 분석 → 코드 리뷰 ↔ 코드 수정 (80점까지 무한 루프) → 완료
```

## 수행 절차

### 1. 브랜치 확인 및 전환

```bash
# 현재 브랜치 확인
git branch --show-current

# branch 인자가 있으면 해당 브랜치로 전환
git checkout {branch}
```

- `branch` 인자가 없으면 현재 브랜치에서 작업
- 브랜치가 존재하지 않으면 에러 출력 후 종료

### 2. Base 브랜치 식별

```bash
# main 또는 master 브랜치 확인
git branch -l main master 2>/dev/null | head -1 | tr -d ' *'
```

base 브랜치 우선순위:
1. `main`
2. `master`
3. 둘 다 없으면 사용자에게 질문

### 3. 변경사항 분석

```bash
# base 브랜치 대비 변경된 파일 목록
git diff {base}...HEAD --name-only

# apps/front 변경사항만 필터링
git diff {base}...HEAD --name-only | grep "^apps/front/"
```

변경된 파일이 없으면:
- "리뷰할 변경사항이 없습니다." 출력 후 종료

### 4. 코드 리뷰 루프 시작

**80점 이상 통과할 때까지 다음을 반복:**

#### 4.1 코드 리뷰 수행

`code-reviewer` agent를 호출하여 리뷰 수행:

```
Task agent: code-reviewer
입력:
- git diff {base}...HEAD (apps/front/ 변경사항만)
- frontend-doc 스킬 참조
- guide-branch: {guide-branch} (기본값: develop)
```

> ⚠️ `guide-branch` 인자가 없으면 기본값 `develop` 사용

#### 4.2 점수 확인

- **80점 이상**: 루프 종료, 완료 단계로 이동
- **80점 미만**: 다음 단계로 진행

#### 4.3 피드백 반영

code-reviewer가 제시한 violations를 하나씩 수정:

1. 각 violation의 `suggestion`을 확인
2. 해당 파일의 해당 라인 수정
3. 수정 완료 후 커밋

```bash
git add -A
git commit -m "fix: code review 피드백 반영

- {violation 1 요약}
- {violation 2 요약}
..."
```

#### 4.4 재리뷰

수정 후 다시 4.1로 돌아가서 코드 리뷰 재수행

### 5. 완료

80점 이상 통과 시:

```
## 코드 리뷰 완료

**최종 점수**: {score}점
**상태**: ✅ 통과

### 리뷰 요약
{summary}

### frontend-doc 보강 제안
{frontendDocSuggestions가 있으면 출력}

---
다음 단계: PR 생성을 원하시면 직접 `gh pr create` 명령을 실행해주세요.
```

## 루프 제한

- **최대 반복 횟수**: 5회
- 5회 반복 후에도 80점 미만이면:
  - 현재 상태 보고
  - 남은 violations 목록 출력
  - 사용자에게 수동 개입 요청

## 예시

### 기본 사용 (현재 브랜치, develop의 가이드 참조)

```
/saturday:improve
```

### 특정 브랜치 지정

```
/saturday:improve feature/user-profile
```

### 다른 브랜치의 가이드 참조

```
/saturday:improve --guide-branch main
/saturday:improve feature/user-profile --guide-branch main
```

## 주의 사항

1. **apps/front 변경사항만 대상**: 다른 디렉토리 변경사항은 무시
2. **frontend-doc 기준만 적용**: 일반 품질 이슈는 감점 안 함
3. **자동 커밋**: 수정사항은 자동으로 커밋됨
4. **PR 미생성**: PR은 사용자가 직접 생성해야 함
