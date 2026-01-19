# GitHub 설정 가이드

## 개요

GitHub 연동은 `gh` CLI를 통해 이루어집니다.

## 필요 조건

- `gh` CLI 설치
- GitHub 계정 인증 완료

## 설정 단계

### 1. gh CLI 설치

**macOS (Homebrew)**:
```bash
brew install gh
```

**Ubuntu/Debian**:
```bash
sudo apt install gh
```

**Windows (Scoop)**:
```bash
scoop install gh
```

**Windows (Winget)**:
```bash
winget install --id GitHub.cli
```

### 2. 인증

```bash
gh auth login
```

대화형 프롬프트가 나타납니다:
1. GitHub.com 또는 GitHub Enterprise 선택
2. 인증 방식 선택:
   - **Login with a web browser** (권장)
   - Login with an authentication token
3. 브라우저에서 코드 입력
4. 권한 승인

### 3. 인증 확인

```bash
gh auth status
```

출력 예시:
```
github.com
  ✓ Logged in to github.com as username
  ✓ Git operations for github.com configured to use https protocol.
  ✓ Token: gho_xxxx****xxxx
  ✓ Token scopes: gist, read:org, repo, workflow
```

## 연결 테스트

```bash
# 리뷰 요청된 PR 확인
gh search prs --review-requested=@me --state=open

# 내 PR 확인
gh search prs --author=@me --state=open

# 알림 확인
gh api notifications
```

## 문제 해결

### "gh: command not found"

- gh CLI가 설치되지 않음
- PATH에 gh가 포함되지 않음
- 터미널 재시작 필요

### "authentication required"

- `gh auth login` 실행 필요
- 또는 토큰이 만료됨

### 토큰 갱신

```bash
gh auth refresh
```

### 권한 부족

필요한 스코프가 없으면 재인증:
```bash
gh auth login --scopes "repo,read:org,notifications"
```

### SSH vs HTTPS 전환

```bash
# HTTPS 사용
gh config set git_protocol https

# SSH 사용
gh config set git_protocol ssh
```

## 사용하는 gh 명령어

### 리뷰 요청된 PR

```bash
gh search prs --review-requested=@me --state=open \
  --json number,title,repository,author,createdAt,url
```

### 내가 생성한 PR

```bash
gh search prs --author=@me --state=open \
  --json number,title,repository,state,createdAt,url,reviewDecision
```

### 알림

```bash
gh api notifications \
  --jq '.[] | {id, reason, title: .subject.title, type: .subject.type, url: .subject.url}'
```

### PR 상세 정보

```bash
gh pr view <number> --repo <owner/repo>
```

### 알림 읽음 처리

```bash
gh api -X PUT notifications/threads/<thread_id>
```

## 유용한 별칭 설정

```bash
# PR 목록 간단히 보기
gh alias set prs 'search prs --author=@me --state=open'

# 리뷰 요청 보기
gh alias set reviews 'search prs --review-requested=@me --state=open'
```

## 참고 링크

- gh CLI 문서: https://cli.github.com/manual/
- GitHub API 문서: https://docs.github.com/en/rest
