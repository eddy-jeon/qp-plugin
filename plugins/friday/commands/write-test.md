---
name: friday:write-test
description: 프로젝트의 테스트 코드를 점진적으로 작성합니다. 진행 상황을 추적하여 세션 간 이어서 작업합니다.
arguments:
  - name: guide-branch
    description: frontend-doc을 참조할 브랜치 (기본값: develop)
    required: false
---

# /friday:write-test - 테스트 코드 점진적 작성

프로젝트의 테스트 코드를 점진적으로 작성합니다. 진행 상황을 추적하여 세션 간 이어서 작업할 수 있습니다.

## 워크플로우

```
프로젝트 식별 → frontend-doc 로드 → 진행 상황 확인 → 다음 대상 선정 → 테스트 작성 → 완료 처리
```

## 수행 절차

### 1단계: 프로젝트 식별

```bash
# Git 원격 저장소에서 프로젝트 ID 추출
git remote get-url origin | sed 's/.*[:/]\([^/]*\/[^/]*\)\.git$/\1/' | tr '/' '-'

# fallback: 원격 저장소 없는 경우
basename $(git rev-parse --show-toplevel)
```

이 값을 `{project-id}`로 사용합니다.

### 2단계: frontend-doc 로드

`guide-branch`에서 frontend-doc을 읽습니다 (기본값: `develop`):

```bash
# 디렉토리 내 파일 목록 확인
git ls-tree -r --name-only {guide-branch} -- apps/front/.claude/skills/frontend-doc/

# 각 파일 내용 읽기
git show {guide-branch}:apps/front/.claude/skills/frontend-doc/SKILL.md
# ... 모든 파일 읽기
```

> ⚠️ `guide-branch`가 지정되지 않으면 기본값 `develop` 사용

**frontend-doc 스킬이 있는 경우**:

1. 전체 frontend-doc을 숙지합니다
2. **unit-testing 관련 가이드를 중점적으로** 숙지합니다
   - 테스트 파일 위치 규칙, 네이밍 컨벤션
   - 테스트 대상 우선순위
   - 테스트 작성 패턴 및 금지 패턴
   - 모킹 전략

**frontend-doc 스킬이 없는 경우 (fallback)**:

friday 내장 `fe-review` skill을 사용합니다.
경로: `${CLAUDE_PLUGIN_ROOT}/skills/fe-review/SKILL.md`

### 3단계: 진행 상황 확인

```bash
cat ~/.claude/friday/test-progress/{project-id}.md
```

- **파일 없음** → 빈 완료 목록으로 시작 (파일은 6단계에서 생성)
- **파일 있음** → 완료 목록 로드

### 4단계: 다음 대상 선정

다음 순서로 대상 파일을 결정합니다:

1. **unit-testing 가이드의 우선순위** 기준으로 다음 대상 파일을 결정
   - 가이드에 우선순위가 없으면: hooks → utils → components 순
2. **완료 목록에 이미 있는 파일은 스킵**
3. **실제 테스트 파일 존재 여부 확인**:
   - 테스트 파일이 이미 존재하면 → 완료 목록에 `(pre-existing)` 표시로 추가하고 스킵
4. **대상이 없으면** 모든 작업 완료 메시지 출력 후 종료:

```markdown
## ✅ 테스트 작성 완료

모든 대상 파일의 테스트가 작성되었습니다.

### 진행 현황
- 총 완료: {N}개 파일
- 이번 세션: 0개 (추가 대상 없음)

진행 상황 파일: ~/.claude/friday/test-progress/{project-id}.md
```

### 5단계: 테스트 코드 작성

#### 5.1 소스 파일 분석

1. 대상 소스 파일 전체 읽기
2. 기존 테스트 파일 참고 (패턴 일관성 유지)
   - 같은 디렉토리 또는 `__tests__` 디렉토리의 기존 테스트 확인
   - import 패턴, describe/it 구조, 모킹 방식 등 참고

#### 5.2 테스트 코드 작성

frontend-doc + unit-testing 가이드 기준으로 테스트를 작성합니다:
- 가이드에 명시된 테스트 패턴 준수
- 기존 테스트와 일관된 스타일 유지
- 의미 있는 테스트 케이스 위주 (커버리지 채우기용 아님)

#### 5.3 테스트 실행 및 검증

**작성한 테스트 파일만** 실행하여 통과 확인:

```bash
npx jest {작성한-테스트-파일-경로} --no-coverage
```

- **통과**: 6단계로 이동
- **실패**: 실패 원인 분석 후 수정, **최대 3회** 재시도

```
attempt = 0
maxAttempts = 3

while (attempt < maxAttempts) {
  result = jest 실행()

  if (result.success) {
    // 통과 → 6단계로 이동
    break
  } else {
    // 실패 → 원인 분석 후 수정
    수정(result.errors)
    attempt++
  }
}
```

3회 시도 후에도 실패하면:

```markdown
## ⚠️ 테스트 실행 실패 (3회 시도)

{테스트-파일-경로} 테스트가 통과하지 않습니다.

### 실패 원인
{마지막 에러 메시지}

수동으로 확인해주세요.
```

### 6단계: 완료 처리

#### 6.1 진행 상황 파일 업데이트

진행 상황 파일에 완료 항목을 추가합니다. 파일이 없으면 새로 생성합니다.

**파일 경로**: `~/.claude/friday/test-progress/{project-id}.md`

**파일 형식**:

```markdown
---
project: {repo-name}
guide_branch: develop
created: {최초 생성일}
last_updated: {오늘 날짜}
---

# Test Progress

## 완료
- [x] src/components/Button.tsx → Button.test.tsx (2026-02-26)
- [x] src/hooks/useAuth.ts → useAuth.test.ts (2026-02-26)
- [x] src/utils/format.ts → format.test.ts (2026-02-26, pre-existing)
```

#### 6.2 커밋

```bash
git add {test-file-path}
git commit -m "test: {source-file} 테스트 추가"
```

#### 6.3 진행 현황 출력

```markdown
## ✅ 테스트 작성 완료

### 이번 세션
- 작성: {source-file} → {test-file}
- 테스트 결과: ✅ 통과

### 전체 진행 현황
- 총 완료: {N}개 파일
- 이번 세션: 1개

진행 상황 파일: ~/.claude/friday/test-progress/{project-id}.md

---
다음 파일 테스트를 계속하려면 `/friday:write-test`를 다시 실행하세요.
```

## 주의사항

1. **한 번 실행에 한 파일만 작성**: 각 실행마다 하나의 소스 파일에 대한 테스트만 작성합니다
2. **중복 방지**: 완료 목록과 실제 테스트 파일 존재 여부를 모두 확인합니다
3. **패턴 일관성**: 기존 테스트 파일의 스타일을 참고하여 일관성을 유지합니다
4. **커밋 단위**: 테스트 파일 하나당 커밋 하나로 관리합니다
5. **frontend-doc 우선**: 가이드에 명시된 규칙이 일반적인 테스트 작성 관례보다 우선합니다
