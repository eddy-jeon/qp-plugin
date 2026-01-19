---
description: Workday-Prep 플러그인 초기 설정 및 플랫폼 연결 가이드
---

# Workday-Prep 설정

사용자의 업무 환경에 맞게 플랫폼을 설정합니다.

## 설정 절차

### 1. 플랫폼 선택

AskUserQuestion을 사용하여 사용자가 연동할 플랫폼을 선택하게 합니다:

- **Google (Gmail + Calendar)**: 이메일 및 일정 확인 (mcp-gsuite)
- **Slack**: 읽지 않은 메시지, 멘션, DM (OAuth 인증)
- **Jira**: 알림 및 할당된 이슈 (Atlassian OAuth)
- **GitHub**: 리뷰 요청, 내 PR, 멘션 (gh CLI)

### 2. 각 플랫폼별 연결 설정

#### Google (Gmail + Calendar) - OAuth 자동 인증

**필요 환경 변수:**
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret

**설정 방법:**
1. https://console.cloud.google.com 접속
2. 프로젝트 생성 또는 선택
3. Gmail API, Google Calendar API 활성화
4. "API 및 서비스" > "사용자 인증 정보" > "OAuth 클라이언트 ID 만들기"
5. 애플리케이션 유형: "데스크톱 앱"
6. 클라이언트 ID와 클라이언트 보안 비밀 복사
7. 환경 변수 설정:
   ```bash
   export GOOGLE_CLIENT_ID="your-client-id"
   export GOOGLE_CLIENT_SECRET="your-client-secret"
   ```
8. 첫 실행 시 브라우저에서 Google 계정 인증 팝업이 열림

#### Slack - OAuth 자동 인증

**필요 환경 변수:**
- `SLACK_CLIENT_ID`: Slack OAuth Client ID
- `SLACK_CLIENT_SECRET`: Slack OAuth Client Secret

**설정 방법:**
1. https://api.slack.com/apps 접속
2. "Create New App" > "From scratch"
3. 앱 이름 입력, 워크스페이스 선택
4. "OAuth & Permissions"에서 Redirect URL 추가: `http://localhost:9876/callback`
5. Bot Token Scopes 추가:
   - `channels:history`, `channels:read`
   - `groups:history`, `groups:read`
   - `im:history`, `im:read`
   - `mpim:history`, `mpim:read`
   - `users:read`, `chat:write`, `reactions:write`
6. "Basic Information"에서 Client ID, Client Secret 복사
7. 환경 변수 설정:
   ```bash
   export SLACK_CLIENT_ID="your-client-id"
   export SLACK_CLIENT_SECRET="your-client-secret"
   ```
8. 첫 실행 시 브라우저에서 Slack 인증 팝업이 열림

#### GitHub (gh CLI)

```bash
# 설치 확인
which gh

# 인증 상태 확인
gh auth status
```

설치되어 있지 않으면:
```bash
brew install gh
gh auth login
```

#### Jira (Atlassian MCP)

Atlassian MCP 서버 사용 (https://mcp.atlassian.com)
- SSE 연결 방식으로 별도 설정 불필요
- 첫 사용 시 Atlassian 계정으로 브라우저 인증

### 3. 설정 파일 생성

`.claude/workday-prep.local.md` 파일을 생성하여 활성화할 플랫폼을 저장합니다:

```yaml
---
platforms:
  gsuite: true      # Gmail + Calendar 통합
  slack: true
  jira: true
  github: true
check_order:
  - gsuite
  - slack
  - jira
  - github
---

# Workday-Prep 설정

이 파일은 workday-prep 플러그인의 로컬 설정을 저장합니다.
```

### 4. 연결 테스트

각 플랫폼에 대해 간단한 연결 테스트를 수행합니다:

- **Google**: MCP 서버 연결 확인 (gsuite 서버)
- **Slack**: MCP 서버 연결 확인
- **GitHub**: `gh auth status` 실행
- **Jira**: MCP 서버 연결 확인

## 실행 지침

1. 먼저 AskUserQuestion으로 어떤 플랫폼을 사용할지 물어봅니다 (multiSelect: true)
2. 선택된 플랫폼에 대해 순차적으로 환경 변수 설정 상태를 확인합니다
3. 환경 변수가 없는 플랫폼은 설정 방법을 안내합니다
4. 모든 설정이 완료되면 `.claude/workday-prep.local.md` 파일을 생성합니다
5. 설정 완료 후 `/workday-prep:start`로 테스트할 수 있음을 안내합니다

## 필요 환경 변수 요약

| 플랫폼 | 변수명 | 설명 |
|--------|--------|------|
| Google | `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| Google | `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| Slack | `SLACK_CLIENT_ID` | Slack OAuth Client ID |
| Slack | `SLACK_CLIENT_SECRET` | Slack OAuth Client Secret |

## 문제 해결

설정 중 문제가 발생하면 `platform-setup` 스킬을 참조하세요.

### OAuth 인증 실패 시

1. Client ID/Secret이 올바른지 확인
2. Redirect URI가 정확히 설정되어 있는지 확인
3. 토큰 파일 삭제 후 재인증:
   ```bash
   # Google
   rm ~/.config/mcp-gsuite/token.json
   # Slack
   rm ~/.config/slack-mcp/token.json
   ```
