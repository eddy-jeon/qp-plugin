---
name: friday:review-pr
description: PR의 FE 영역을 리뷰합니다. PR 브랜치를 checkout하여 변경 파일을 직접 읽고 리뷰합니다.
arguments:
  - name: pr
    description: PR 번호 또는 URL
    required: true
---

# PR FE 코드 리뷰

지정된 PR의 프론트엔드 변경 사항을 리뷰합니다.

## 워크플로우

### 1. PR 정보 획득

```bash
gh pr view {pr} --json number,title,body,headRefName,baseRefName
```

PR 번호, 제목, 본문, head/base 브랜치 정보를 확인합니다.

### 2. PR 브랜치로 이동

현재 브랜치를 저장하고 PR 브랜치로 checkout합니다:

```bash
# 현재 브랜치 저장
ORIGINAL_BRANCH=$(git branch --show-current)

# 변경사항이 있으면 stash
git stash

# PR 브랜치 fetch 및 checkout
git fetch origin {headRefName}
git checkout {headRefName}
```

**중요**: `ORIGINAL_BRANCH`와 stash 여부를 기억해두세요. 리뷰 완료 후 `/friday:submit-review`에서 복귀할 때 필요합니다.

### 3. FE 변경 파일 목록 추출

```bash
gh pr diff {pr} --name-only
```

출력에서 `apps/front/` 하위 파일만 필터링합니다. FE 변경 파일이 없으면 사용자에게 알리고 종료합니다.

### 4. frontend-doc 스킬 로드

`apps/front/.claude/` 디렉토리에서 `frontend-doc` 스킬을 찾습니다:

```bash
# frontend-doc 스킬 탐색
ls apps/front/.claude/skills/frontend-doc/
```

**frontend-doc 스킬이 있는 경우 (기본 경로)**:

1. `apps/front/.claude/skills/frontend-doc/` 하위의 모든 문서를 탐색합니다
2. SKILL.md를 먼저 읽어 전체 구조와 목차를 파악합니다
3. 리뷰 대상 파일과 관련된 문서를 선별하여 읽습니다:
   - 변경된 파일이 속한 도메인/모듈에 해당하는 문서
   - 아키텍처, 컨벤션, 패턴 관련 문서
   - 컴포넌트 설계 가이드, 상태 관리 규칙 등
4. 이 문서들을 리뷰 기준으로 **적극 활용**합니다. 프로젝트 고유의 규칙과 패턴이 일반적인 FE 모범 사례보다 우선합니다.

**frontend-doc 스킬이 없는 경우 (fallback)**:

friday 내장 `fe-review` skill을 사용합니다.
경로: `${CLAUDE_PLUGIN_ROOT}/skills/fe-review/SKILL.md`

### 5. FE 코드 리뷰 수행

변경된 `apps/front/` 하위 파일을 하나씩 Read 도구로 읽으며 리뷰합니다.

**frontend-doc 스킬이 있는 경우**: 문서에 명시된 프로젝트 규칙, 컨벤션, 패턴을 기준으로 리뷰합니다. 예를 들어:
- 프로젝트가 정의한 컴포넌트 구조 규칙을 따르는지
- 프로젝트의 상태 관리 패턴과 일치하는지
- 프로젝트 네이밍 컨벤션을 준수하는지
- 프로젝트에서 금지하거나 권장하는 패턴을 따르는지

**frontend-doc 스킬이 없는 경우**: 일반적인 FE 모범 사례를 기준으로 리뷰합니다:
- 컴포넌트 구조 및 책임 분리
- 상태 관리 패턴
- 타입 안전성
- 성능 (불필요한 리렌더, 메모이제이션)
- 접근성
- 에러 처리
- 코드 스타일 일관성

리뷰 항목을 발견하면 다음 형식으로 정리합니다:

```
파일: {파일 경로}:{라인 번호}
유형: 수정 필요 / 권장 / 잘된 점
제목: {이슈 요약}
현재: {현재 코드 설명}
제안: {구체적 수정 방법}
이유: {왜 수정이 필요한지}
```

### 6. 피드백 루프

리뷰 결과를 사용자에게 제시한 후, 사용자의 피드백을 대기합니다.

**단계 전환 규칙**:
- 사용자가 명시적으로 "제출", "submit", "게시" 등을 말하기 전까지 리뷰 모드를 유지합니다
- 사용자 피드백을 리뷰 결과에 반영합니다 (항목 수정, 삭제, 추가)
- 리뷰가 완료되면 `/friday:submit-review` 사용을 안내합니다

## 주의사항

- PR 브랜치를 직접 checkout하므로 로컬 변경사항이 있으면 자동으로 stash합니다
- `apps/front/` 경로는 대상 프로젝트 구조에 따라 다를 수 있습니다. 실제 FE 파일 경로를 PR diff에서 확인하세요
- 리뷰는 변경된 파일만 대상으로 합니다 (전체 코드베이스 리뷰가 아님)
