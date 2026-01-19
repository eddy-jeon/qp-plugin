# Jira 설정 가이드

## 개요

Jira 연동은 Atlassian 공식 MCP 서버(SSE)를 통해 이루어집니다.

## MCP 서버 정보

| 항목 | 값 |
|------|-----|
| 타입 | SSE (Server-Sent Events) |
| URL | `https://mcp.atlassian.com/v1/sse` |

## 설정 단계

### 1. Atlassian 계정 확인

Jira Cloud를 사용하는 Atlassian 계정이 필요합니다.
- https://id.atlassian.com 에서 계정 확인

### 2. MCP 서버 연결

Atlassian MCP 서버는 SSE 방식으로 연결됩니다.
`.mcp.json`에 이미 설정되어 있습니다:

```json
{
  "jira": {
    "type": "sse",
    "url": "https://mcp.atlassian.com/v1/sse"
  }
}
```

### 3. 인증

MCP 서버 첫 연결 시 Atlassian OAuth 인증이 필요합니다:
1. 브라우저가 열리며 Atlassian 로그인 요청
2. 사이트 선택 (여러 Jira 사이트가 있는 경우)
3. 권한 승인
4. 인증 완료 후 토큰이 저장됨

## 연결 테스트

Claude Code에서 MCP 서버 상태 확인:
```
/mcp
```

jira 서버가 연결되어 있으면 성공입니다.

## 문제 해결

### 인증 실패

- Atlassian 계정 로그인 상태 확인
- 브라우저 쿠키/캐시 삭제 후 재시도
- 팝업 차단 해제 확인

### 연결 타임아웃

- 네트워크 연결 확인
- 방화벽/VPN 설정 확인
- Atlassian 서비스 상태 확인: https://status.atlassian.com

### 권한 부족

- Jira 프로젝트에 대한 접근 권한 확인
- 관리자에게 권한 요청 필요할 수 있음

### 사이트를 찾을 수 없음

- Atlassian 계정에 연결된 Jira 사이트 확인
- 올바른 사이트를 선택했는지 확인

## 사용 가능한 MCP 도구

Atlassian MCP 서버는 다음 기능을 제공합니다:

### 알림 관련
- `jira_get_notifications` - 알림 목록 조회

### 이슈 관련
- `jira_get_issue` - 이슈 상세 조회
- `jira_search_issues` - JQL로 이슈 검색
- `jira_create_issue` - 이슈 생성
- `jira_update_issue` - 이슈 수정
- `jira_add_comment` - 댓글 추가

### 프로젝트 관련
- `jira_get_projects` - 프로젝트 목록
- `jira_get_project` - 프로젝트 상세

## 유용한 JQL 쿼리

```
# 나에게 할당된 이슈
assignee = currentUser()

# 나에게 할당된 미완료 이슈
assignee = currentUser() AND status != Done

# 오늘 업데이트된 이슈
updated >= startOfDay()

# 나를 멘션한 이슈
text ~ currentUser()

# 긴급 이슈
priority = Highest AND status != Done
```

## 참고 링크

- Atlassian MCP 문서: https://developer.atlassian.com/cloud/mcp/
- Jira JQL 문서: https://support.atlassian.com/jira-software-cloud/docs/use-advanced-search-with-jira-query-language-jql/
