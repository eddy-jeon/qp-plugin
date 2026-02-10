---
name: friday:review-pr
description: PR의 FE 영역을 리뷰합니다. PR 브랜치를 checkout하여 변경 파일을 직접 읽고 리뷰합니다.
arguments:
  - name: pr
    description: PR 번호 또는 URL
    required: true
  - name: guide-branch
    description: frontend-doc을 참조할 브랜치 (기본값: develop)
    required: false
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

**frontend-doc 스킬이 있는 경우**:

1. `guide-branch`의 `apps/front/.claude/skills/frontend-doc/` 하위의 모든 문서를 탐색합니다
2. SKILL.md를 먼저 읽어 전체 구조와 목차를 파악합니다
3. 리뷰 대상 파일과 관련된 문서를 선별하여 읽습니다:
   - 변경된 파일이 속한 도메인/모듈에 해당하는 문서
   - 아키텍처, 컨벤션, 패턴 관련 문서
   - 컴포넌트 설계 가이드, 상태 관리 규칙 등
4. 이 문서들을 리뷰 기준으로 **적극 활용**합니다. 프로젝트 고유의 규칙과 패턴이 일반적인 FE 모범 사례보다 우선합니다.

**frontend-doc 스킬이 없는 경우 (fallback)** (브랜치에 해당 경로가 없는 경우):

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

리뷰 항목을 발견하면 다음 형식으로 정리합니다 (라인 코멘트 게시를 위해 정확한 라인 정보 필수):

```
파일: {파일 경로}
라인: {시작 라인 번호} (또는 {시작}-{끝} 범위)
유형: 수정 필요 / 권장 / 잘된 점
제목: {이슈 요약}
현재: {현재 코드 설명}
제안: {구체적 수정 방법}
이유: {왜 수정이 필요한지}
```

**중요**: 라인 번호는 PR diff 기준으로 정확히 기록해야 합니다. `/friday:submit-review` 시 해당 라인에 코멘트가 달립니다.

### 5.5. 메타리뷰 루프

1차 리뷰 결과를 `meta-reviewer` agent로 검증합니다. **모두 통과할 때까지 자동으로 반복합니다.**

```
attempt = 0
maxAttempts = 10

while (attempt < maxAttempts) {
  result = meta-reviewer 호출()

  if (result.modified.length === 0 && result.rejected.length === 0) {
    // 모두 통과 → 6단계로 이동
    break
  } else {
    // 수정 필요 → 자체 수정 후 재시도
    자체수정(result.modified, result.rejected)
    attempt++
  }
}
```

**meta-reviewer 입력 정보**:
- 5단계에서 생성된 리뷰 항목들
- 변경된 파일들의 전체 코드
- 관련 기존 코드 (import하는 파일, 호출하는 파일 등)

**메타리뷰 기준**:
1. **맥락 적절성**: 기존 코드와의 융합 관점에서 적절한지
2. **Step-by-step**: 작업과 목적이 직관적으로 보이도록
3. **근거 필수**: 모든 의견에 근거 포함
4. **간결함**: 장황하지 않게

**검증 결과에 따른 처리**:
- **approved**: 그대로 유지
- **modified**: 수정된 버전으로 교체
- **rejected**: 목록에서 제거

### 5.6. 자체 수정 (메타리뷰 피드백 반영)

메타리뷰에서 수정/제외 판정을 받은 항목을 자동으로 수정:

1. **modified 항목**: 수정된 버전으로 교체
2. **rejected 항목**:
   - 제외 이유 분석
   - 근거 보강 또는 맥락에 맞게 재작성
   - 또는 목록에서 제거

수정 완료 후 5.5 메타리뷰로 복귀 (루프)

### 6. 자동 제출

메타리뷰에서 모든 항목이 통과한 경우:

1. 결과 브리핑 (정보 제공용)
2. 리뷰 제출 방식 결정
3. PR Review 제출 + 라인 코멘트 게시

**리뷰 제출 방식 결정**:

| 조건 | 제출 방식 | 메시지 |
|------|----------|--------|
| 수정 필요 항목 있음 | `REQUEST_CHANGES` | 라인 코멘트 + 요약 |
| 권장 사항만 있음 | `APPROVE` | 라인 코멘트 + 요약 |
| 코멘트 없음 | `APPROVE` | "LGTM 🎉" |

**브리핑 포맷**:

```markdown
## ✅ 메타리뷰 통과 - 자동 제출 진행

모든 리뷰 항목이 검증을 통과했습니다. (시도: {attempt}회)

### 리뷰 결과
- 수정 필요: {N}건 → {N > 0 ? "Request Changes" : ""}
- 권장 사항: {N}건 → {수정 필요 없으면 "Approve"}
- 코멘트 없음 → "LGTM 🎉"

PR Review를 제출합니다...
```

**PR Review + 라인 코멘트 제출** (한 번에):

```bash
gh api repos/{owner}/{repo}/pulls/{pr번호}/reviews \
  -X POST \
  -f event="{REQUEST_CHANGES|APPROVE}" \
  -f body="{요약}" \
  -f 'comments[0][path]=파일' \
  -f 'comments[0][body]=코멘트' \
  -F 'comments[0][line]=라인'
```

**코멘트 없는 경우 (LGTM)**:

```bash
gh api repos/{owner}/{repo}/pulls/{pr번호}/reviews \
  -X POST -f event="APPROVE" -f body="LGTM 🎉"
```

### 6b. 사용자 개입 요청 (최대 반복 도달 시)

10회 시도 후에도 통과하지 못한 경우:

1. 현재 상태 보고
2. 통과하지 못한 항목 목록
3. 사용자에게 수동 개입 요청

**브리핑 포맷**:

```markdown
## ⚠️ 메타리뷰 자동 수정 한계 도달 (10회 시도)

자동 수정으로 해결되지 않는 항목이 있습니다.

### 미해결 항목
- {항목}: {문제점}

수동으로 수정하거나, 현재 상태로 제출할지 선택해주세요.
```

## 주의사항

- PR 브랜치를 직접 checkout하므로 로컬 변경사항이 있으면 자동으로 stash합니다
- `apps/front/` 경로는 대상 프로젝트 구조에 따라 다를 수 있습니다. 실제 FE 파일 경로를 PR diff에서 확인하세요
- 리뷰는 변경된 파일만 대상으로 합니다 (전체 코드베이스 리뷰가 아님)
