---
name: sunday:start
description: Jira 티켓 기반 완전 자동화 워크플로우를 시작합니다. 요구사항 분석부터 PR 오픈까지 자동으로 진행합니다.
arguments:
  - name: ticket
    description: Jira 티켓 키 (예: PROJ-123)
    required: true
  - name: guide-branch
    description: frontend-doc을 참조할 브랜치 (기본값: develop)
    required: false
---

# Sunday: 완전 자동화 개발 워크플로우

Jira 티켓 `{ticket}`에 대한 자동화 워크플로우를 시작합니다.

## 워크플로우 개요

```
1. Jira 티켓 조회 & 품질 체크
2. 요구사항 분석 & 작업 계획 수립 (planner agent)
3. 코드 구현 (frontend-doc 참고)
4. 코드 리뷰 루프 (code-reviewer agent, 80점까지)
5. 요구사항 리뷰 루프 (spec-reviewer agent, 80점까지)
6. PR 생성 & Jira 코멘트
```

---

## Phase 1: Jira 티켓 조회 & 품질 체크

### 1.1 Jira CLI 확인

```bash
which jira
```

jira CLI가 없으면 사용자에게 `/sunday:setup` 실행을 안내하고 종료합니다.

### 1.2 티켓 조회

```bash
jira issue view {ticket} --raw
```

### 1.3 티켓 품질 체크

다음 필수 필드가 있는지 확인:
- **Title**: 티켓 제목
- **Description**: 상세 설명

필수 필드가 누락되면 즉시 종료:

```
❌ 티켓 정보가 부족합니다.

누락된 필드:
- Description: 상세 설명이 없습니다

티켓을 보완한 후 다시 시도해주세요.
```

### 1.4 티켓 정보 저장

이후 단계에서 사용할 수 있도록 티켓 정보를 메모리에 저장:
- `TICKET_KEY`: {ticket}
- `TICKET_TITLE`: 티켓 제목
- `TICKET_DESCRIPTION`: 티켓 설명
- `TICKET_AC`: Acceptance Criteria (있는 경우)
- `TICKET_LABELS`: 라벨 (있는 경우)

---

## Phase 2: 요구사항 분석 & 작업 계획 수립

### 2.1 Planner Agent 호출

`planner` agent를 호출하여 작업 계획을 수립합니다.

**입력 정보**:
- Jira 티켓 내용 (TICKET_* 변수)
- frontend-doc 스킬 위치: `apps/front/.claude/skills/frontend-doc`

**기대 출력**:
- 요구사항 요약
- 프로젝트 컨텍스트
- 세부 작업 계획
- 테스트 계획
- 주의 사항

### 2.2 브랜치 생성

```bash
# 티켓 키와 제목으로 브랜치명 생성
BRANCH_NAME="feature/{ticket}-$(echo '{ticket_title_slug}' | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')"

# 브랜치 생성 및 이동
git checkout -b $BRANCH_NAME
```

---

## Phase 3: 코드 구현

### 3.1 frontend-doc 스킬 로드

`guide-branch`에서 frontend-doc을 읽습니다 (기본값: `develop`):

```bash
# 디렉토리 내 파일 목록 확인
git ls-tree -r --name-only {guide-branch} -- apps/front/.claude/skills/frontend-doc/

# 각 파일 내용 읽기
git show {guide-branch}:apps/front/.claude/skills/frontend-doc/SKILL.md
git show {guide-branch}:apps/front/.claude/skills/frontend-doc/components.md
# ... 모든 파일 읽기
```

> ⚠️ `guide-branch`가 지정되지 않으면 기본값 `develop` 사용

frontend-doc이 있으면:
1. `SKILL.md`를 읽어 전체 구조 파악
2. 관련 문서 (architecture, components, state-management 등) 로드
3. 프로젝트 규칙과 패턴을 구현에 적용

### 3.2 작업 계획 실행

planner가 수립한 작업 계획을 순서대로 실행:

1. **각 Task 수행**:
   - 변경 대상 파일 확인
   - 3.1에서 로드한 `guide-branch`의 frontend-doc 규칙에 맞게 구현
   - 필요한 컴포넌트/함수/타입 추가

2. **테스트 코드 작성**:
   - 테스트 계획에 따라 테스트 작성
   - 단위 테스트, 통합 테스트 포함

### 3.3 구현 완료 확인

```bash
# 변경 파일 확인
git status

# apps/front 변경사항만 확인
git diff --name-only | grep "^apps/front/"
```

---

## Phase 4: 코드 리뷰 루프

**80점 통과까지 무한 반복**

### 4.1 Code Reviewer Agent 호출

`code-reviewer` agent를 호출합니다.

**입력 정보**:
- git diff (`apps/front/` 변경사항만)
- frontend-doc 스킬 위치
- guide-branch: {guide-branch} (기본값: develop)

**요구사항 정보는 전달하지 않습니다** (순수 코드 품질 평가)

### 4.2 리뷰 결과 확인

```json
{
  "score": 75,
  "passed": false,
  "violations": [...],
  "references": [...],
  "frontendDocSuggestions": [...]
}
```

### 4.3 통과/재시도 판단

- **score >= 80**: Phase 5로 진행
- **score < 80**: 피드백 반영 후 재리뷰

### 4.4 피드백 반영 (score < 80인 경우)

violations의 각 항목에 대해:
1. 해당 파일/라인 수정
2. suggestion 적용
3. 모든 violations 해결

```bash
# 수정 후 다시 diff 확인
git diff --name-only | grep "^apps/front/"
```

### 4.5 재리뷰

4.1로 돌아가 다시 리뷰 (80점 이상까지 반복)

### 4.6 frontend-doc 보강 제안 출력

리뷰 통과 후, frontendDocSuggestions가 있으면 출력:

```
📝 frontend-doc 보강 제안:

1. **에러 바운더리 사용법**
   - 이유: frontend-doc에 해당 내용이 없으나 프로젝트에서 자주 사용됨
   - 제안: ## Error Boundary...

이 제안들은 향후 frontend-doc 업데이트 시 참고하세요.
```

---

## Phase 5: 요구사항 리뷰 루프

**80점 통과까지 무한 반복**

### 5.1 Spec Reviewer Agent 호출

`spec-reviewer` agent를 호출합니다.

**입력 정보**:
- git diff (전체 변경사항)
- Jira 티켓 내용 (TICKET_* 변수) ← **요구사항 전달**

### 5.2 리뷰 결과 확인

```json
{
  "score": 70,
  "passed": false,
  "requirements": [...],
  "missingImplementations": [...]
}
```

### 5.3 통과/재시도 판단

- **score >= 80**: Phase 6으로 진행
- **score < 80**: 추가 구현 필요

### 5.4 추가 구현 (score < 80인 경우)

missingImplementations의 각 항목에 대해:
1. 해당 기능 구현
2. suggestion 적용
3. 모든 missing 항목 구현

### 5.5 코드 리뷰로 복귀

추가 구현 후:
1. **Phase 4 (코드 리뷰)** 다시 수행
2. 코드 리뷰 통과 후 **Phase 5 (요구사항 리뷰)** 재수행

### 5.6 재리뷰

5.1로 돌아가 다시 리뷰 (80점 이상까지 반복)

---

## Phase 6: PR 생성 & Jira 코멘트

### 6.1 변경사항 커밋

변경 파일을 **연관성 높은 묶음으로 커밋 분리**합니다.

**규칙**:
- 각 커밋은 Conventional Commit 형식 사용 (`feat`, `fix`, `chore`, `test` 등)
- 모든 커밋 메시지에 `Jira: {ticket}` 포함
- 빈 커밋은 생성하지 않음

### 6.2 원격 푸시

```bash
git push -u origin $BRANCH_NAME
```

### 6.3 PR 템플릿 확인

**PR 생성 전** 프로젝트의 PR 템플릿을 확인합니다:

```bash
# PR 템플릿 탐색 (일반적인 경로들)
ls -la .github/PULL_REQUEST_TEMPLATE.md 2>/dev/null || \
ls -la .github/PULL_REQUEST_TEMPLATE/ 2>/dev/null || \
ls -la docs/PULL_REQUEST_TEMPLATE.md 2>/dev/null || \
echo "PR template not found"
```

#### 템플릿이 있는 경우

1. 템플릿 파일을 읽습니다
2. 템플릿의 **구조를 유지**하면서 내용을 채웁니다
3. 체크박스(`- [ ]`)는 해당하는 경우 체크(`- [x]`)로 변경
4. 불필요한 섹션은 적절히 축약

#### 템플릿이 없는 경우

기본 형식을 사용합니다 (아래 6.4 참조)

### 6.4 PR 생성

**템플릿이 없는 경우 기본 형식**:

```bash
gh pr create --title "[{ticket}] {TICKET_TITLE}" --body "$(cat <<'EOF'
## Summary

{요구사항 요약}

## Changes

- {주요 변경 1}
- {주요 변경 2}
- {주요 변경 3}

## Test Plan

- {테스트 항목 1}
- {테스트 항목 2}

## Review Scores

| Review Type | Score | Status |
|-------------|-------|--------|
| Code Quality | {code_review_score}/100 | ✅ Passed |
| Spec Compliance | {spec_review_score}/100 | ✅ Passed |

## Checklist

- [x] 코드 리뷰 통과
- [x] 요구사항 리뷰 통과
- [x] 테스트 코드 작성

## Related

- Jira: [{ticket}]({JIRA_URL})

---

🤖 Generated with [Sunday](https://github.com/anthropics/claude-code) — Automated Development Workflow
EOF
)"
```

**템플릿이 있는 경우**:

템플릿 내용을 읽고, 다음 정보로 채워서 PR 생성:
- **Summary/Description**: 요구사항 요약 및 구현 내용
- **Changes/What's Changed**: 주요 변경사항 목록
- **Test Plan/Testing**: 테스트 방법 및 검증 항목
- **Related Issues/Links**: Jira 티켓 링크
- **Checklist**: 해당 항목 체크

### 6.5 Jira 코멘트 추가

```bash
PR_URL=$(gh pr view --json url -q '.url')

jira issue comment add {ticket} -b "$(cat <<'EOF'
🔗 PR 생성됨: {PR_URL}

**코드 리뷰 점수**: {code_review_score}
**요구사항 충족도**: {spec_review_score}

---
_Sunday 자동화 워크플로우로 생성됨_
EOF
)"
```

### 6.6 완료 메시지

```
✅ 워크플로우 완료!

📋 Jira 티켓: {ticket}
🌿 브랜치: {BRANCH_NAME}
🔗 PR: {PR_URL}

📊 점수:
- 코드 리뷰: {code_review_score}점
- 요구사항 충족: {spec_review_score}점

{frontend_doc_suggestions가 있으면 출력}
```

---

## 안전장치

### Jira 티켓 정보 부족

필수 필드(title, description) 누락 시 즉시 종료:
- 사용자에게 티켓 보완 요청
- 워크플로우 진행 안 함

### apps/front 외 변경

`apps/front` 하위 파일만 코드 리뷰 대상:
- 다른 디렉토리 변경사항은 리뷰에서 제외
- PR에는 모든 변경사항 포함

### frontend-doc 없음

frontend-doc이 없는 경우:
- 코드 리뷰 점수 100점 (감점 대상 없음)
- 일반 품질은 참고 정보로만 제공
- frontend-doc 생성 권장

---

## 주의사항

1. **완전 자동화**: 한 번 시작하면 PR 오픈까지 사람 개입 없이 진행
2. **Frontend 전용**: `apps/front` 디렉토리 대상
3. **frontend-doc 우선**: 프로젝트 문서화된 규칙이 일반 품질보다 우선
4. **80점 게이트**: 코드 리뷰, 요구사항 리뷰 모두 80점 이상 필요
5. **Jira CLI 필수**: 사전에 `/sunday:setup` 으로 설정 필요
