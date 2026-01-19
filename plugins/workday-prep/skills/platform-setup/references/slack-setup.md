# Slack 설정 가이드 (OAuth 2.0)

## 개요

Slack 연동은 OAuth 2.0 자동 인증을 지원하는 MCP 서버를 통해 이루어집니다.
첫 실행 시 브라우저에서 Slack 로그인 및 권한 승인 후 자동으로 토큰이 저장됩니다.

## 필요한 환경 변수

| 변수명 | 설명 |
|--------|------|
| `SLACK_CLIENT_ID` | Slack OAuth Client ID |
| `SLACK_CLIENT_SECRET` | Slack OAuth Client Secret |

## 설정 단계

### 1. Slack App 생성

1. https://api.slack.com/apps 접속
2. "Create New App" 클릭
3. "From scratch" 선택
4. App 이름 입력 (예: "Workday Prep")
5. 워크스페이스 선택

### 2. OAuth 설정

**OAuth & Permissions 페이지에서:**

1. **Redirect URLs** 추가:
   ```
   http://localhost:9876/callback
   ```

2. **Bot Token Scopes** 추가:

   **필수 스코프**:
   - `channels:history` - 공개 채널 메시지 읽기
   - `channels:read` - 공개 채널 목록
   - `groups:history` - 비공개 채널 메시지 읽기
   - `groups:read` - 비공개 채널 목록
   - `im:history` - DM 읽기
   - `im:read` - DM 목록
   - `mpim:history` - 그룹 DM 읽기
   - `mpim:read` - 그룹 DM 목록
   - `users:read` - 사용자 정보

   **선택 스코프 (메시지 전송용)**:
   - `chat:write` - 메시지 전송
   - `reactions:write` - 리액션 추가

### 3. Client 자격 증명 복사

**Basic Information 페이지에서:**

1. App Credentials 섹션 찾기
2. Client ID 복사
3. Client Secret 복사 (Show 클릭 후)

### 4. 환경 변수 설정

```bash
# ~/.zshrc 또는 ~/.bashrc에 추가
export SLACK_CLIENT_ID="your-client-id-here"
export SLACK_CLIENT_SECRET="your-client-secret-here"
```

설정 후 터미널 재시작 또는:
```bash
source ~/.zshrc
```

### 5. 첫 실행 - OAuth 인증

1. Claude Code에서 Slack MCP 도구 사용 시 자동으로 브라우저가 열림
2. Slack에 로그인
3. 앱 권한 승인
4. "Authentication Successful" 페이지 확인
5. 브라우저 창 닫기

토큰은 `~/.config/slack-mcp/token.json`에 자동 저장됩니다.

## 연결 테스트

Claude Code에서 MCP 서버 상태 확인:
```
/mcp
```

slack 서버가 연결되어 있으면 성공입니다.

## 문제 해결

### "OAuth timeout" 에러

- 5분 내에 인증을 완료하지 않음
- 다시 시도하세요

### "invalid_client" 에러

- Client ID 또는 Client Secret이 올바르지 않음
- Basic Information에서 값을 다시 확인

### "redirect_uri_mismatch" 에러

- Redirect URL이 정확히 `http://localhost:9876/callback`인지 확인
- trailing slash 없이 설정해야 함

### "missing_scope" 에러

- 필요한 스코프가 모두 추가되어 있는지 확인
- 스코프 추가 후 앱 재설치가 필요할 수 있음

### 채널 메시지를 읽을 수 없음

- Bot이 해당 채널에 추가되어 있는지 확인
- 비공개 채널의 경우 Bot을 초대해야 함

### 토큰 갱신/재인증 필요 시

```bash
rm ~/.config/slack-mcp/token.json
```

다음 실행 시 자동으로 OAuth 플로우가 다시 시작됩니다.

## 사용 가능한 MCP 도구

- `slack_list_channels` - 채널 목록 조회
- `slack_get_channel_history` - 채널 히스토리
- `slack_post_message` - 메시지 전송
- `slack_get_users` - 사용자 목록
- `slack_get_unread` - 읽지 않은 메시지
- `slack_add_reaction` - 리액션 추가

## 보안 참고사항

- Client Secret은 절대 공개 저장소에 커밋하지 마세요
- `.bashrc`/`.zshrc` 대신 환경 변수 관리 도구 사용을 권장합니다
- 토큰 파일(`~/.config/slack-mcp/token.json`)은 민감한 정보를 포함합니다
