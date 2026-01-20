---
name: contribution:pr
description: GitHub PR을 한글로 작성하여 생성합니다. 템플릿이 있으면 활용합니다.
---

# GitHub PR 생성

현재 브랜치의 변경 사항을 분석하고 한글로 PR을 작성하여 생성합니다.

## 작업 순서

### 1. 현재 상태 확인

다음 명령어를 병렬로 실행하세요:

```bash
git status
git branch --show-current
git log --oneline main..HEAD  # 또는 master..HEAD
git diff main...HEAD --stat
```

### 2. PR 템플릿 확인

다음 위치에서 PR 템플릿을 찾아보세요:

```bash
# 템플릿 위치 확인 (우선순위 순)
ls -la .github/PULL_REQUEST_TEMPLATE.md 2>/dev/null
ls -la .github/pull_request_template.md 2>/dev/null
ls -la docs/PULL_REQUEST_TEMPLATE.md 2>/dev/null
ls -la PULL_REQUEST_TEMPLATE.md 2>/dev/null
```

템플릿이 있으면 Read 도구로 읽어서 형식을 따르세요.

### 3. 변경 사항 분석

- 이 브랜치에서 수행한 모든 커밋을 분석하세요
- 단일 커밋이 아닌 전체 변경 사항의 맥락을 파악하세요
- 주요 변경 파일과 그 목적을 정리하세요

### 4. PR 제목 작성

- 한글로 작성합니다
- 무엇을 했는지 명확하게 표현합니다
- 예: "소셜 로그인 기능 추가", "사용자 목록 페이지 성능 개선"

### 5. PR 본문 작성

**템플릿이 있는 경우**: 템플릿 형식을 따라 한글로 작성

**템플릿이 없는 경우**: 다음 형식으로 작성

```markdown
## 개요

{이 PR에서 수행한 작업을 1-2문장으로 요약}

## 변경 사항

- {주요 변경 내용 1}
- {주요 변경 내용 2}
- {주요 변경 내용 3}

## 테스트

- [ ] {테스트 항목 1}
- [ ] {테스트 항목 2}

---

🤖 Generated with [Claude Code](https://claude.ai/code)
```

### 6. PR 옵션 설정

AskUserQuestion 도구를 사용하여 다음 항목들을 확인하세요:

**질문 1: Draft PR 여부**

- 옵션: "일반 PR (바로 리뷰 요청)", "Draft PR (작업 중)"

**질문 2: Assignee (담당자)**

- 옵션: "나 자신", "지정 안 함", "직접 입력"

**질문 3: Labels (라벨)**

- 먼저 `gh label list`로 사용 가능한 라벨을 확인하세요
- 옵션으로 주요 라벨들을 제시하세요 (예: "enhancement", "bug", "documentation")
- multiSelect: true로 설정하여 여러 개 선택 가능하게 하세요

**질문 4: Reviewers (리뷰어)**

- 옵션: "지정 안 함", "직접 입력"
- Draft PR인 경우 이 질문은 건너뛰어도 됩니다

### 7. PR 생성

```bash
gh pr create \
  --title "PR 제목" \
  --body "$(cat <<'EOF'
PR 본문 내용
EOF
)" \
  --draft \
  --assignee "@me" \
  --label "label1,label2" \
  --reviewer "username"
```

사용하지 않는 옵션은 제외하세요:

- Draft PR이 아니면 `--draft` 제외
- Assignee를 지정 안 하면 `--assignee` 제외
- Labels이 없으면 `--label` 제외
- Reviewers가 없거나 Draft PR이면 `--reviewer` 제외

### 8. 결과 보고

PR이 생성되면 다음 정보를 알려주세요:

- PR URL
- PR 번호
- 설정된 옵션들 (assignee, labels, reviewers)

## 예시

### 템플릿 없는 경우 PR 본문 예시

```markdown
## 개요

사용자 인증 시스템에 Google OAuth 로그인 기능을 추가했습니다.

## 변경 사항

- Google OAuth 클라이언트 설정 추가
- 로그인 페이지에 Google 로그인 버튼 추가
- OAuth 콜백 처리 및 세션 생성 로직 구현
- 기존 로그인과의 통합 처리

## 테스트

- [ ] Google 계정으로 로그인 성공 확인
- [ ] 로그인 후 리다이렉트 정상 동작 확인
- [ ] 세션 만료 후 재로그인 동작 확인

---

🤖 Generated with [Claude Code](https://claude.ai/code)
```

## 주의사항

- 원격 브랜치에 푸시되지 않은 경우 먼저 `git push -u origin {branch}` 실행
- base 브랜치는 기본적으로 main (또는 master)을 사용
