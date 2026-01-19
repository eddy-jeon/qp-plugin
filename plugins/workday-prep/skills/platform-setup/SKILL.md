---
description: "workday-prep 플랫폼 설정 가이드. 사용자가 Slack, Google (Gmail/Calendar), Jira, GitHub 연동 설정을 요청하거나 연결 문제를 해결할 때 사용"
---

# Platform Setup 스킬

workday-prep 플러그인에서 사용하는 각 플랫폼의 설정 및 문제 해결 가이드입니다.

## 트리거 문구

- "Slack 설정 방법"
- "Gmail 연동이 안 돼요"
- "GitHub 인증 문제"
- "Calendar 연결 방법"
- "Jira MCP 설정"
- "Google OAuth 설정"
- "workday-prep 플랫폼 설정"

## 지원 플랫폼

### 1. Slack (OAuth 2.0)

**구현 방식**: MCP 서버 (OAuth 자동 인증)

**필요한 환경 변수**:
- `SLACK_CLIENT_ID`: Slack OAuth Client ID
- `SLACK_CLIENT_SECRET`: Slack OAuth Client Secret

**인증 방식**: 첫 실행 시 브라우저에서 Slack 로그인 후 자동 토큰 저장

**설정 가이드**: [slack-setup.md](references/slack-setup.md)

### 2. Google (Gmail + Calendar)

**구현 방식**: MCP 서버 (`mcp-gsuite`, OAuth 자동 인증)

**필요한 환경 변수**:
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret

**인증 방식**: 첫 실행 시 브라우저에서 Google 로그인 후 자동 토큰 저장

**설정 가이드**: [gsuite-setup.md](references/gsuite-setup.md)

### 3. Jira

**구현 방식**: MCP 서버 (Atlassian SSE)

**URL**: `https://mcp.atlassian.com/v1/sse`

**인증 방식**: 첫 실행 시 Atlassian 계정으로 브라우저 인증

**설정 가이드**: [jira-setup.md](references/jira-setup.md)

### 4. GitHub

**구현 방식**: `gh` CLI

**필요 조건**:
- gh CLI 설치
- `gh auth login` 완료

**설정 가이드**: [github-setup.md](references/github-setup.md)

## 문제 해결 프로세스

1. 사용자가 어떤 플랫폼에 문제가 있는지 확인
2. 해당 플랫폼의 레퍼런스 파일 참조
3. 단계별로 설정 상태 확인
4. 누락된 설정 안내
5. 연결 테스트 수행

## 필요 환경 변수 요약

| 플랫폼 | 변수명 | 설명 |
|--------|--------|------|
| Google | `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| Google | `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| Slack | `SLACK_CLIENT_ID` | Slack OAuth Client ID |
| Slack | `SLACK_CLIENT_SECRET` | Slack OAuth Client Secret |

## 공통 문제

### 환경 변수 설정

환경 변수는 다음 위치에 설정할 수 있습니다:
- `~/.zshrc` 또는 `~/.bashrc`
- `.env` 파일
- Claude Code 설정

### OAuth 인증 실패

1. Client ID/Secret 값이 올바른지 확인
2. Redirect URI가 정확히 설정되어 있는지 확인
3. 필요한 API 스코프가 활성화되어 있는지 확인

### 토큰 갱신/재인증

토큰 파일을 삭제하면 다음 실행 시 자동으로 OAuth 플로우가 시작됩니다:

```bash
# Google
rm ~/.config/mcp-gsuite/token.json

# Slack
rm ~/.config/slack-mcp/token.json
```

### MCP 서버 연결 실패

1. 네트워크 연결 확인
2. 환경 변수 설정 확인
3. 토큰/인증 정보 유효성 확인
4. MCP 서버 버전 업데이트

### CLI 도구 인증 만료

- GitHub: `gh auth refresh`
