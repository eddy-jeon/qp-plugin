---
name: review
description: PR의 FE 영역을 리뷰합니다. PR 브랜치를 checkout하여 변경 파일을 직접 읽고 메타리뷰를 거쳐 PR 코멘트로 자동 게시합니다.
when_to_use: |
  - "PR 리뷰해줘", "PR 123 리뷰해줘"
  - "friday review로 리뷰해줘"
  - "FE 코드 리뷰해줘"
  - PR 번호나 URL이 포함된 리뷰 요청
---

# PR FE 코드 리뷰

지정된 PR의 프론트엔드 변경 사항을 리뷰합니다.

## 필수 정보

- **PR 번호 또는 URL**: 사용자에게 확인 필요
- **guide-branch** (선택): frontend-doc을 참조할 브랜치 (기본값: `develop`)

## 워크플로우

### 1. PR 정보 획득

```bash
gh pr view {pr} --json number,title,body,headRefName,baseRefName,labels,state,isDraft,reviews,reviewRequests
```

PR 번호, 제목, 본문, head/base 브랜치 정보, 라벨, 상태, 드래프트 여부, 리뷰 정보를 확인합니다.

### 1.5. 리뷰 대상 확인 (조기 종료 체크)

다음 조건을 **순서대로** 체크하여 조기 종료 여부를 결정합니다:

| # | 조건 | 메시지 |
|---|------|--------|
| 1 | PR이 OPEN 상태가 아님 | "이 PR은 이미 {Merged/Closed} 상태입니다" |
| 2 | Draft PR임 | "이 PR은 아직 Draft 상태입니다" |
| 3 | 내가 리뷰할 필요 없음 | "이미 리뷰를 완료했고 재요청이 없습니다" |
| 4 | FE 변경 없고 라벨 없음 | "FE 리뷰 대상이 아닙니다" |

#### 조건 1: PR 상태 확인

1단계에서 획득한 `state` 필드 확인:
- `OPEN`: 리뷰 진행
- `MERGED` 또는 `CLOSED`: 조기 종료

#### 조건 2: Draft 여부 확인

1단계에서 획득한 `isDraft` 필드 확인:
- `false`: 리뷰 진행
- `true`: 조기 종료

#### 조건 3: 리뷰 필요 여부 확인

1단계에서 획득한 `reviews`와 `reviewRequests` 필드로 확인:

```bash
# 내 GitHub 사용자명 획득
gh api user --jq '.login'
```

**리뷰 필요 여부 로직**:
- `내가 리뷰함` = reviews에서 내 login이 있는지
- `내가 요청받음` = reviewRequests에서 내 login이 있는지

```
리뷰 진행 조건: (내가 리뷰 안함) OR (내가 요청받음)
조기 종료 조건: (내가 이미 리뷰함) AND (요청 없음)
```

#### 조건 4: FE 변경 여부 확인

**다음 조건 중 하나라도 만족하면 리뷰를 진행**합니다:

1. **FE 변경 파일 존재**: `apps/front/` 하위 파일이 변경됨
2. **FE 라벨 존재**: PR에 `apps/front` 라벨이 있음

```bash
# FE 변경 파일 확인
gh pr diff {pr} --name-only | grep "^apps/front/"
```

---

**조기 종료 시 브랜치 이동 없이 바로 종료합니다.**

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

**중요**: `ORIGINAL_BRANCH`와 stash 여부를 기억해두세요. 리뷰 완료 후 복귀할 때 필요합니다.

### 3. FE 변경 파일 목록 추출

```bash
gh pr diff {pr} --name-only
```

출력에서 `apps/front/` 하위 파일만 필터링합니다.

### 4. frontend-doc 스킬 로드

`guide-branch`에서 frontend-doc을 읽습니다 (기본값: `develop`):

```bash
# 디렉토리 내 파일 목록 확인
git ls-tree -r --name-only {guide-branch} -- apps/front/.claude/skills/frontend-doc/

# 각 파일 내용 읽기
git show {guide-branch}:apps/front/.claude/skills/frontend-doc/SKILL.md
```

**frontend-doc 스킬이 있는 경우**:

1. `guide-branch`의 `apps/front/.claude/skills/frontend-doc/` 하위의 모든 문서를 탐색합니다
2. SKILL.md를 먼저 읽어 전체 구조와 목차를 파악합니다
3. 리뷰 대상 파일과 관련된 문서를 선별하여 읽습니다
4. 이 문서들을 리뷰 기준으로 **적극 활용**합니다

**frontend-doc 스킬이 없는 경우 (fallback)**:

friday 내장 `fe-review` skill을 사용합니다.
경로: `${CLAUDE_PLUGIN_ROOT}/skills/fe-review/SKILL.md`

### 5. FE 코드 리뷰 수행

변경된 `apps/front/` 하위 파일을 하나씩 Read 도구로 읽으며 리뷰합니다.

**frontend-doc 스킬이 있는 경우**: 문서에 명시된 프로젝트 규칙, 컨벤션, 패턴을 기준으로 리뷰합니다.

**frontend-doc 스킬이 없는 경우**: 일반적인 FE 모범 사례를 기준으로 리뷰합니다:
- 컴포넌트 구조 및 책임 분리
- 상태 관리 패턴
- 타입 안전성
- 성능 (불필요한 리렌더, 메모이제이션)
- 접근성
- 에러 처리

리뷰 항목을 발견하면 다음 형식으로 정리합니다:

```
파일: {파일 경로}
라인: {시작 라인 번호} (또는 {시작}-{끝} 범위)
유형: 수정 필요 / 권장 / 잘된 점
제목: {이슈 요약}
현재: {현재 코드 설명}
제안: {구체적 수정 방법}
이유: {왜 수정이 필요한지}
```

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

**메타리뷰 기준**:
1. **맥락 적절성**: 기존 코드와의 융합 관점에서 적절한지
2. **Step-by-step**: 작업과 목적이 직관적으로 보이도록
3. **근거 필수**: 모든 의견에 근거 포함
4. **간결함**: 장황하지 않게

### 6. 자동 제출

메타리뷰에서 모든 항목이 통과한 경우:

**리뷰 제출 방식 결정**:

| 조건 | 제출 방식 | 메시지 |
|------|----------|--------|
| 수정 필요 항목 있음 | `REQUEST_CHANGES` | 라인 코멘트 + 요약 |
| 권장 사항만 있음 | `APPROVE` | 라인 코멘트 + 요약 |
| 코멘트 없음 | `APPROVE` | "LGTM" |

**PR Review + 라인 코멘트 제출**:

```bash
gh api repos/{owner}/{repo}/pulls/{pr번호}/reviews \
  -X POST \
  -f event="{REQUEST_CHANGES|APPROVE}" \
  -f body="{요약}" \
  -f 'comments[0][path]=파일' \
  -f 'comments[0][body]=코멘트' \
  -F 'comments[0][line]=라인'
```

### 7. 원래 브랜치로 복귀

```bash
git checkout {ORIGINAL_BRANCH}
git stash pop  # stash 했었다면
```

## 주의사항

- PR 브랜치를 직접 checkout하므로 로컬 변경사항이 있으면 자동으로 stash합니다
- `apps/front/` 경로는 대상 프로젝트 구조에 따라 다를 수 있습니다
- 리뷰는 변경된 파일만 대상으로 합니다 (전체 코드베이스 리뷰가 아님)
