# Workday-Prep

하루 업무 시작 전 여러 플랫폼의 알림과 업데이트를 확인하고 인터랙티브하게 처리하는 Claude Code 플러그인입니다.

## 지원 플랫폼

| 플랫폼 | 확인 항목 | 구현 방식 |
|--------|----------|----------|
| **Slack** | 읽지 않은 메시지, 멘션, DM, 리액션 필요 | MCP 서버 (OAuth 2.0) |
| **Google** | 이메일 + 일정 | MCP 서버 (mcp-gsuite, OAuth 2.0) |
| **Jira** | 알림(notifications) | MCP 서버 (Atlassian SSE) |
| **GitHub** | 리뷰 요청 PR, 내 PR 상태, 멘션 | `gh` CLI |

## 사용법

### 최초 설정

```
/workday-prep:setup
```

각 플랫폼 연결 상태를 확인하고 필요한 설정을 안내합니다.

### 업무 시작 체크

```
/workday-prep:start
```

활성화된 모든 플랫폼을 순차적으로 확인하고 각 항목에 대해 액션을 선택할 수 있습니다.

## 필요한 사전 설정

### 환경 변수

| 플랫폼 | 변수명 | 설명 |
|--------|--------|------|
| Google | `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| Google | `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| Slack | `SLACK_CLIENT_ID` | Slack OAuth Client ID |
| Slack | `SLACK_CLIENT_SECRET` | Slack OAuth Client Secret |

### OAuth 설정 가이드

#### Slack

1. https://api.slack.com/apps 에서 앱 생성
2. OAuth & Permissions에서 Redirect URL 추가: `http://localhost:9876/callback`
3. Bot Token Scopes 추가 (channels:history, im:history 등)
4. Basic Information에서 Client ID, Client Secret 복사
5. 환경 변수 설정

#### Google (Gmail + Calendar)

1. https://console.cloud.google.com 에서 프로젝트 생성
2. Gmail API, Google Calendar API 활성화
3. OAuth 동의 화면 설정
4. OAuth 클라이언트 ID 생성 (데스크톱 앱)
5. Client ID, Client Secret 복사
6. 환경 변수 설정

### CLI 도구

- **gh**: GitHub CLI
  ```bash
  brew install gh
  gh auth login
  ```

## 인증 방식

모든 MCP 서버는 **OAuth 2.0 자동 인증**을 지원합니다:

1. 환경 변수에 Client ID/Secret 설정
2. 첫 실행 시 브라우저가 자동으로 열림
3. 해당 플랫폼에 로그인 및 권한 승인
4. 토큰이 자동으로 저장됨 (재인증 불필요)

토큰 저장 위치:
- Slack: `~/.config/slack-mcp/token.json`
- Google: `~/.config/mcp-gsuite/token.json`

## 설정 파일

플러그인 설정은 `.claude/workday-prep.local.md`에 저장됩니다.

```yaml
---
platforms:
  gsuite: true    # Gmail + Calendar
  slack: true
  jira: true
  github: true
---
```

## 디렉토리 구조

```
workday-prep/
├── .claude-plugin/plugin.json
├── .mcp.json                    # MCP 서버 설정
├── mcp-servers/
│   └── slack-mcp/               # Slack OAuth MCP 서버
├── commands/
│   ├── start.md
│   └── setup.md
├── scripts/
│   └── github-check.sh
├── skills/
│   └── platform-setup/
│       └── references/
│           ├── slack-setup.md
│           ├── gsuite-setup.md  # Gmail + Calendar 통합
│           ├── jira-setup.md
│           └── github-setup.md
└── README.md
```

## 라이선스

MIT
