---
name: contribution:commit
description: Conventional Commit 형식으로 한글 커밋 메시지를 작성하고 커밋합니다
---

# Conventional Commit 한글 커밋 생성

Git 변경 사항을 분석하고 Conventional Commit 형식의 한글 커밋 메시지를 작성하여 커밋합니다.

## 작업 순서

### 1. 변경 사항 확인

다음 명령어를 병렬로 실행하여 현재 상태를 파악하세요:

```bash
git status
git diff --staged
git diff
git log --oneline -5
```

### 2. 변경 사항 분석

- 스테이징된 변경 사항이 없으면 `git add`로 추가할지 사용자에게 물어보세요
- 변경된 파일들을 분석하여 어떤 작업이 수행되었는지 파악하세요
- 기존 커밋 스타일을 참고하세요

### 3. Conventional Commit 메시지 작성

**형식**: `type(scope): 한글 요약`

**사용 가능한 Type**:
| Type | 설명 |
|------|------|
| feat | 새로운 기능 추가 |
| fix | 버그 수정 |
| docs | 문서 변경 |
| style | 코드 포맷팅, 세미콜론 누락 등 (기능 변경 없음) |
| refactor | 리팩토링 (기능 변경 없음, 버그 수정 없음) |
| test | 테스트 추가 또는 수정 |
| chore | 빌드 설정, 패키지 매니저 설정 등 |
| build | 빌드 시스템 또는 외부 종속성 변경 |
| ci | CI 설정 파일 및 스크립트 변경 |
| perf | 성능 개선 |
| revert | 이전 커밋 되돌리기 |

**Scope 규칙**:

- 변경된 모듈, 컴포넌트, 기능 영역을 나타냅니다
- 소문자 영어로 작성합니다
- 예: `auth`, `api`, `ui`, `db`, `config`

**메시지 작성 규칙**:

- Summary는 한글로 작성 (50자 이내 권장)
- 명령형으로 작성 ("추가", "수정", "삭제" 등)
- 마침표 사용하지 않음
- Body는 빈 줄 후 상세 내용 작성 (한글)

### 4. 커밋 실행

다음 형식으로 커밋하세요:

```bash
git commit -m "$(cat <<'EOF'
type(scope): 한글 요약

상세 설명 (선택사항)
- 변경 내용 1
- 변경 내용 2

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### 5. 결과 확인

커밋 후 `git status`로 결과를 확인하고 사용자에게 알려주세요.

## 예시

```
feat(auth): 소셜 로그인 기능 추가

- Google OAuth 연동 구현
- 로그인 후 리다이렉트 처리 추가
- 세션 관리 로직 개선

Co-Authored-By: Claude <noreply@anthropic.com>
```

```
fix(api): 사용자 조회 API 응답 오류 수정

null 체크 누락으로 인한 500 에러를 수정했습니다.

Co-Authored-By: Claude <noreply@anthropic.com>
```

## 주의사항

- 민감한 정보(API 키, 비밀번호 등)가 포함된 파일은 커밋하지 마세요
- `.env`, `credentials.json` 등의 파일이 스테이징되어 있으면 경고하세요
- `--amend`나 `--force` 옵션은 사용자가 명시적으로 요청한 경우에만 사용하세요
