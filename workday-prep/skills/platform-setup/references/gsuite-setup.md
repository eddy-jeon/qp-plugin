# Google Workspace (GSuite) 설정 가이드

## 개요

`mcp-gsuite`는 Gmail과 Google Calendar를 하나의 MCP 서버로 통합하여 제공합니다.
OAuth 2.0 자동 인증을 지원하며, 첫 실행 시 브라우저에서 Google 계정 로그인 후 자동으로 토큰이 저장됩니다.

## 지원 기능

| 서비스 | 기능 |
|--------|------|
| **Gmail** | 이메일 목록, 읽기, 검색, 전송 |
| **Calendar** | 일정 조회, 생성, 수정, 삭제 |

## 필요한 환경 변수

| 변수명 | 설명 |
|--------|------|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |

## 설정 단계

### 1. Google Cloud 프로젝트 생성

1. https://console.cloud.google.com 접속
2. 상단의 프로젝트 선택 드롭다운 클릭
3. "새 프로젝트" 클릭
4. 프로젝트 이름 입력 (예: "Workday Prep")
5. "만들기" 클릭

### 2. API 활성화

1. 왼쪽 메뉴에서 "API 및 서비스" > "라이브러리"
2. **Gmail API** 검색 후 "사용" 클릭
3. **Google Calendar API** 검색 후 "사용" 클릭

### 3. OAuth 동의 화면 설정

1. "API 및 서비스" > "OAuth 동의 화면"
2. 사용자 유형: "외부" 선택 (또는 조직 계정이면 "내부")
3. 앱 정보 입력:
   - 앱 이름: "Workday Prep"
   - 사용자 지원 이메일: 본인 이메일
   - 개발자 연락처: 본인 이메일
4. "저장 후 계속"

5. **스코프 추가**:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.modify` (선택사항)
   - `https://www.googleapis.com/auth/calendar.readonly`
   - `https://www.googleapis.com/auth/calendar` (선택사항)

6. **테스트 사용자 추가**:
   - 본인 이메일 주소 추가

### 4. OAuth 클라이언트 ID 생성

1. "API 및 서비스" > "사용자 인증 정보"
2. "+ 사용자 인증 정보 만들기" > "OAuth 클라이언트 ID"
3. 애플리케이션 유형: **"데스크톱 앱"**
4. 이름 입력 (예: "Workday Prep Desktop")
5. "만들기" 클릭
6. **Client ID**와 **Client Secret** 복사

### 5. 환경 변수 설정

```bash
# ~/.zshrc 또는 ~/.bashrc에 추가
export GOOGLE_CLIENT_ID="your-client-id-here.apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="your-client-secret-here"
```

설정 후 터미널 재시작 또는:
```bash
source ~/.zshrc
```

### 6. 첫 실행 - OAuth 인증

1. Claude Code에서 GSuite MCP 도구 사용 시 자동으로 브라우저가 열림
2. Google 계정으로 로그인
3. "Workday Prep" 앱 권한 승인
4. 권한 범위 확인 후 "허용"
5. 인증 완료 페이지 확인

토큰은 `~/.config/mcp-gsuite/token.json`에 자동 저장됩니다.

## 연결 테스트

Claude Code에서 MCP 서버 상태 확인:
```
/mcp
```

gsuite 서버가 연결되어 있으면 성공입니다.

## 문제 해결

### "access_denied" 에러

- OAuth 동의 화면에서 테스트 사용자로 등록되지 않음
- 또는 앱이 "테스트" 상태에서 다른 사용자가 접근 시도
- **해결**: 테스트 사용자에 본인 이메일 추가

### "invalid_client" 에러

- Client ID 또는 Client Secret이 올바르지 않음
- **해결**: 사용자 인증 정보에서 값을 다시 확인

### "invalid_grant" 에러

- 토큰이 만료되었거나 무효화됨
- **해결**: 토큰 파일 삭제 후 재인증
  ```bash
  rm ~/.config/mcp-gsuite/token.json
  ```

### "quota_exceeded" 에러

- API 일일 할당량 초과
- **해결**: 다음 날 자동으로 리셋됨

### 캘린더가 표시되지 않음

- 캘린더 공유 설정 확인
- 숨겨진 캘린더인지 확인

### 이메일이 표시되지 않음

- Gmail API 스코프가 활성화되어 있는지 확인
- 토큰 재발급 시 모든 스코프가 포함되었는지 확인

## 사용 가능한 MCP 도구

### Gmail 도구

- `gmail_list_messages` - 이메일 목록 조회
- `gmail_get_message` - 이메일 상세 조회
- `gmail_search_messages` - 이메일 검색
- `gmail_send_message` - 이메일 전송 (modify 스코프 필요)

### Calendar 도구

- `calendar_list_events` - 일정 목록 조회
- `calendar_get_event` - 일정 상세 조회
- `calendar_create_event` - 일정 생성
- `calendar_update_event` - 일정 수정
- `calendar_delete_event` - 일정 삭제

## 유용한 Gmail 검색 쿼리

- `is:unread` - 읽지 않은 이메일
- `is:important` - 중요 이메일
- `from:someone@example.com` - 특정 발신자
- `newer_than:1d` - 최근 1일 이내
- `has:attachment` - 첨부파일 있는 이메일
- `label:inbox` - 받은편지함

## 유용한 Calendar 조회 옵션

- 오늘 일정: 시작/종료 시간을 오늘로 설정
- 이번 주 일정: 7일 범위 조회
- 특정 캘린더만: 캘린더 ID 지정

## 보안 참고사항

- Client Secret은 절대 공개 저장소에 커밋하지 마세요
- 토큰 파일(`~/.config/mcp-gsuite/token.json`)은 민감한 정보를 포함합니다
- 프로덕션 환경에서는 앱을 "게시" 상태로 변경하고 Google의 검토를 받아야 합니다

## 기존 gcalcli/gmail-mcp에서 마이그레이션

이전에 별도의 gcalcli나 gmail-mcp-server를 사용했다면:

1. 기존 토큰/인증 정보 삭제:
   ```bash
   rm -rf ~/.gcalcli_oauth
   rm -rf ~/.config/gmail-mcp
   ```

2. 새 환경 변수 설정 (위 단계 참조)

3. `mcp-gsuite`가 Gmail과 Calendar를 모두 처리하므로 별도 설정 불필요
