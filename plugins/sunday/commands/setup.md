---
name: sunday:setup
description: Jira CLI 환경 설정 가이드. jira-cli 설치 및 로그인 설정을 진행합니다.
---

# Jira CLI 환경 설정

Sunday 플러그인 사용을 위한 Jira CLI 설정을 진행합니다.

## 1. Jira CLI 설치 확인

```bash
which jira
```

### 설치되어 있지 않은 경우

**macOS (Homebrew)**:
```bash
brew install ankitpokhrel/jira-cli/jira-cli
```

**기타 플랫폼**:
공식 설치 가이드를 참조하세요: https://github.com/ankitpokhrel/jira-cli#installation

## 2. Jira CLI 초기 설정

설치 후 초기 설정을 진행합니다:

```bash
jira init
```

설정 시 필요한 정보:
- Jira 서버 URL (예: `https://your-company.atlassian.net`)
- 이메일 주소
- API 토큰 (https://id.atlassian.com/manage-profile/security/api-tokens 에서 생성)

## 3. 연결 확인

설정이 완료되면 연결을 확인합니다:

```bash
jira me
```

현재 로그인된 사용자 정보가 표시되면 설정이 완료된 것입니다.

## 4. 테스트

티켓 조회가 정상적으로 되는지 테스트합니다:

```bash
jira issue list --project YOUR-PROJECT -q "status != Done" --limit 5
```

## 문제 해결

### API 토큰 관련

- API 토큰은 Atlassian 계정 설정에서 생성합니다
- 토큰 생성 후 복사해두세요 (다시 볼 수 없음)
- 토큰에 적절한 라벨을 붙여 관리하세요 (예: "jira-cli")

### 인증 오류

```bash
jira init --force
```

로 설정을 초기화하고 다시 시도하세요.

### 프로젝트 접근 권한

Jira에서 해당 프로젝트에 대한 접근 권한이 있는지 확인하세요.

## 완료

설정이 완료되었습니다. 이제 `/sunday:start {JIRA-123}` 명령어로 자동화 워크플로우를 시작할 수 있습니다.
