# Contribution Plugin

Conventional Commit 형식의 한글 커밋과 PR 생성을 지원하는 Claude Code 플러그인입니다.

## 기능

### `/contribution:commit`

Git 변경 사항을 분석하고 Conventional Commit 형식의 한글 커밋 메시지를 작성합니다.

**특징**:
- Conventional Commit 형식 준수 (`type(scope): 요약`)
- Summary와 Body 모두 한글로 작성
- Angular 스타일 확장 타입 지원 (feat, fix, docs, style, refactor, test, chore, build, ci, perf, revert)

**사용 예**:
```
/contribution:commit
```

### `/contribution:pr`

GitHub PR을 한글로 작성하여 생성합니다.

**특징**:
- `PULL_REQUEST_TEMPLATE.md` 자동 감지 및 활용
- 템플릿이 없으면 표준 형식으로 작성
- Assignee, Labels, Reviewers를 대화형으로 설정

**사용 예**:
```
/contribution:pr
```

## 설치

이 플러그인을 사용하려면 Claude Code 설정에 플러그인 경로를 추가하세요.

## 요구사항

- Git CLI
- GitHub CLI (`gh`) - PR 생성 시 필요
- GitHub 인증 완료 (`gh auth login`)

## 커밋 타입 가이드

| Type | 설명 |
|------|------|
| feat | 새로운 기능 추가 |
| fix | 버그 수정 |
| docs | 문서 변경 |
| style | 코드 포맷팅 (기능 변경 없음) |
| refactor | 리팩토링 |
| test | 테스트 추가/수정 |
| chore | 빌드 설정, 패키지 관리 등 |
| build | 빌드 시스템 변경 |
| ci | CI 설정 변경 |
| perf | 성능 개선 |
| revert | 커밋 되돌리기 |
