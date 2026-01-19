---
description: 업무 시작 전 모든 플랫폼 알림 확인 및 인터랙티브 처리
---

# Workday-Prep 시작

하루 업무를 시작하기 전 모든 플랫폼의 알림과 업데이트를 확인합니다.

## 워크플로우

### 1. 설정 파일 확인

먼저 `.claude/workday-prep.local.md` 파일을 읽어 활성화된 플랫폼 목록을 확인합니다.

설정 파일이 없으면 사용자에게 `/workday-prep:setup`을 먼저 실행하도록 안내합니다.

### 2. 플랫폼별 확인 순서

기본 순서 (설정에서 변경 가능):
1. **Google (Calendar)** - 오늘 일정
2. **Slack** - 읽지 않은 메시지
3. **Google (Gmail)** - 읽지 않은 이메일
4. **Jira** - 알림
5. **GitHub** - PR 및 알림

### 3. 각 플랫폼별 확인 방법

#### Google Calendar (MCP gsuite 서버 사용)

MCP gsuite 서버의 도구를 사용합니다:
- `calendar_list_events` - 일정 목록

오늘 일정을 조회하여 표시합니다:
- 시간
- 일정 제목
- 위치 (있는 경우)
- 참석자 (있는 경우)

#### Slack (MCP 서버 사용)

MCP slack 서버의 도구를 사용합니다:
- `slack_list_channels` - 채널 목록
- `slack_get_channel_history` - 채널 메시지
- `slack_get_users` - 사용자 정보
- `slack_get_unread` - 읽지 않은 메시지

확인 항목:
- 읽지 않은 DM
- 멘션된 메시지
- 리액션이 필요한 메시지

#### Gmail (MCP gsuite 서버 사용)

MCP gsuite 서버의 도구를 사용합니다:
- `gmail_list_messages` - 메시지 목록
- `gmail_get_message` - 메시지 상세
- `gmail_search_messages` - 메시지 검색

확인 항목:
- 읽지 않은 이메일 (is:unread)
- 중요 이메일 (is:important is:unread)

#### Jira (MCP 서버 사용)

MCP jira 서버의 도구를 사용합니다:
- `jira_get_notifications` - 알림 목록
- `jira_get_issue` - 이슈 상세

확인 항목:
- 새 알림
- 나에게 할당된 이슈

#### GitHub

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/github-check.sh all
```

확인 항목:
- 리뷰 요청된 PR
- 내 PR 상태 (approved, changes requested, pending)
- 멘션된 알림

### 4. 인터랙티브 액션

각 항목에 대해 AskUserQuestion을 사용하여 액션을 선택합니다:

```
옵션:
1. "확인 완료" - 해당 항목을 처리 완료로 표시
2. "나중에" - 나중에 처리할 항목으로 표시
3. "자세히 보기" - 해당 항목의 상세 정보 표시
4. "건너뛰기" - 다음 항목으로 이동
```

여러 항목이 있는 경우 일괄 처리 옵션도 제공:
- "모두 확인 완료"
- "다음 플랫폼으로"

### 5. 최종 요약

모든 플랫폼 확인 후 요약을 표시합니다:

```
## 오늘의 업무 준비 요약

### 일정
- 09:00 팀 스탠드업 미팅
- 14:00 디자인 리뷰

### 처리 필요 항목
- Slack: 3개 메시지 (나중에)
- GitHub: 2개 PR 리뷰 대기

### 완료 항목
- Gmail: 5개 이메일 확인 완료
- Jira: 2개 알림 확인 완료

좋은 하루 되세요!
```

## 실행 지침

1. `.claude/workday-prep.local.md` 파일 읽기
2. 설정 파일이 없으면 setup 안내
3. 활성화된 플랫폼 순서대로 확인:
   - MCP 서버 사용 (gsuite, slack, jira)
   - CLI 도구 사용 (GitHub)
   - 결과를 읽기 쉽게 포맷팅
   - 각 항목에 대해 AskUserQuestion으로 액션 선택
4. 모든 플랫폼 확인 후 최종 요약 표시

## 에러 처리

- CLI 도구 없음: 해당 플랫폼 건너뛰고 설정 안내
- MCP 서버 연결 실패: 해당 플랫폼 건너뛰고 설정 안내
- OAuth 인증 필요: 브라우저에서 인증 플로우 시작됨을 안내
- 인증 만료: 토큰 파일 삭제 후 재인증 방법 안내

## 팁

- 항목이 많을 경우 중요도순으로 정렬
- 긴급한 항목은 상단에 하이라이트
- 처리 완료 항목은 기록하여 추후 참조 가능
