---
name: friday:submit-review
description: 진행된 리뷰 결과를 PR 라인 코멘트로 게시하고, 원래 브랜치로 복귀합니다.
---

# 리뷰 결과 PR 코멘트 게시

현재 세션에서 진행된 리뷰 결과를 PR의 해당 라인에 코멘트로 게시합니다.

## 워크플로우

### 1. 리뷰 내용 수집

현재 세션에서 `/friday:review-pr`로 진행한 리뷰 내용을 수집합니다. 리뷰 항목이 없으면 사용자에게 알리고 종료합니다.

각 리뷰 항목에서 다음 정보를 추출합니다:
- 파일 경로
- 라인 번호 (또는 범위)
- 코멘트 내용

### 2. PR 정보 획득

라인 코멘트를 달기 위해 필요한 정보를 수집합니다:

```bash
# PR의 head commit SHA 획득
gh pr view {pr번호} --json headRefOid --jq '.headRefOid'
```

### 3. 미리보기

게시할 코멘트 목록을 사용자에게 보여줍니다:

```markdown
## 게시할 라인 코멘트

### 1. {파일명}:{라인}
{코멘트 내용}

### 2. {파일명}:{라인}
{코멘트 내용}

...
```

AskUserQuestion 도구를 사용합니다:

**질문: 이 내용으로 라인 코멘트를 게시할까요?**
- 옵션: "게시", "수정 후 게시", "취소"

- **게시**: 각 라인에 코멘트를 게시합니다
- **수정 후 게시**: 사용자가 수정 사항을 알려주면 반영 후 다시 미리보기
- **취소**: 게시를 취소하고 종료합니다

### 4. 리뷰 제출 방식 결정

리뷰 항목 분석 결과에 따라 제출 방식을 결정합니다:

| 조건 | 제출 방식 | 메시지 |
|------|----------|--------|
| 수정 필요 항목 있음 | `REQUEST_CHANGES` | 라인 코멘트 + 요약 |
| 권장 사항만 있음 | `APPROVE` | 라인 코멘트 + 요약 |
| 코멘트 없음 | `APPROVE` | "LGTM 🎉" |

### 5. PR Review 제출 (라인 코멘트 포함)

`gh pr review` 명령어로 라인 코멘트와 함께 리뷰를 제출합니다.

**수정 필요 항목이 있는 경우 (Request Changes)**:

```bash
gh pr review {pr번호} --request-changes --body "$(cat <<'EOF'
## 🔍 Code Review by Friday

### 요약
- 수정 필요: {N}건
- 권장 사항: {N}건

라인별 코멘트를 확인해 주세요.

---
*🤖 Reviewed by [Friday](https://github.com/anthropics/claude-code) — PR Code Review Assistant*
EOF
)"
```

**권장 사항만 있는 경우 (Approve)**:

```bash
gh pr review {pr번호} --approve --body "$(cat <<'EOF'
## 🔍 Code Review by Friday

### 요약
- 권장 사항: {N}건
- 잘된 점: {N}건

라인별 코멘트를 확인해 주세요.

---
*🤖 Reviewed by [Friday](https://github.com/anthropics/claude-code) — PR Code Review Assistant*
EOF
)"
```

**코멘트가 없는 경우 (LGTM)**:

```bash
gh pr review {pr번호} --approve --body "LGTM 🎉

---
*🤖 Reviewed by [Friday](https://github.com/anthropics/claude-code) — PR Code Review Assistant*"
```

### 6. 라인 코멘트 게시

각 리뷰 항목을 해당 파일의 라인에 코멘트로 게시합니다.

> ⚠️ `gh pr review`는 라인 코멘트를 직접 지원하지 않으므로, API로 별도 게시합니다.

**단일 라인 코멘트**:

```bash
gh api repos/{owner}/{repo}/pulls/{pr번호}/comments \
  -f body="{코멘트 내용}" \
  -f path="{파일 경로}" \
  -F line={라인 번호} \
  -f commit_id="{head commit SHA}" \
  -f side="RIGHT"
```

**멀티 라인 코멘트** (범위가 있는 경우):

```bash
gh api repos/{owner}/{repo}/pulls/{pr번호}/comments \
  -f body="{코멘트 내용}" \
  -f path="{파일 경로}" \
  -F start_line={시작 라인} \
  -F line={끝 라인} \
  -f commit_id="{head commit SHA}" \
  -f side="RIGHT"
```

**코멘트 포맷**:

```markdown
**{유형}**: {제목}

{현재 상태 설명}

**제안**: {구체적 수정 방법}

**이유**: {왜 수정이 필요한지}
```

### 7. 원래 브랜치로 복귀

```bash
# 원래 브랜치로 돌아가기
git checkout {ORIGINAL_BRANCH}

# stash한 변경사항이 있으면 복원
git stash pop
```

### 8. 결과 보고

- 게시된 라인 코멘트 수
- PR URL
- 복귀한 브랜치 정보

## 주의사항

- 라인 번호는 PR diff 기준입니다. 파일 전체 라인 번호와 다를 수 있습니다.
- `{owner}/{repo}`는 현재 레포지토리 정보를 `gh repo view --json owner,name`으로 획득합니다.
- 코멘트 게시 중 오류가 발생하면 해당 항목을 건너뛰고 계속 진행합니다.
