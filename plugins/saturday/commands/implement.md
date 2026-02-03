---
name: saturday:implement
description: 새 브랜치에서 요구사항 기반 코드를 구현하고 80점 이상 통과할 때까지 개선합니다.
arguments:
  - name: requirement
    description: 구현할 요구사항 텍스트
    required: false
  - name: guide-branch
    description: frontend-doc을 참조할 브랜치 (기본값: develop)
    required: false
---

# /saturday:implement - 새 브랜치 구현

요구사항을 받아 새 브랜치에서 코드를 구현하고, **80점 이상 통과할 때까지** 코드 리뷰와 수정을 반복합니다.

## 워크플로우

```
요구사항 파싱 → 브랜치 생성 → 코드 구현 → 코드 리뷰 ↔ 코드 수정 (80점까지 무한 루프) → 완료
```

## 수행 절차

### 1. 요구사항 확인

`requirement` 인자가 없으면 사용자에게 질문:

```
구현할 요구사항을 입력해주세요:
예: "버튼 클릭 시 모달 표시", "사용자 프로필 페이지 추가"
```

### 2. 브랜치 생성

요구사항에서 브랜치명 생성:

1. 요구사항을 영문 slug로 변환
2. `feature/{slug}` 형식으로 브랜치명 생성
3. 사용자에게 확인

```
생성할 브랜치: feature/add-modal-on-button-click
[Y/n] 진행하시겠습니까?
```

브랜치 생성:

```bash
# 현재 브랜치 저장 (나중에 돌아올 수 있도록)
git branch --show-current

# base 브랜치로 이동
git checkout main

# 최신 상태로 업데이트
git pull origin main

# 새 브랜치 생성 및 이동
git checkout -b feature/{slug}
```

### 3. 코드 구현

frontend-doc을 참고하여 요구사항 구현:

1. **frontend-doc 로드** (guide-branch에서 참조, 기본값: develop)
   ```bash
   # guide-branch에서 파일 목록 조회
   git ls-tree -r --name-only {guide-branch} -- apps/front/.claude/skills/frontend-doc/

   # 각 파일 내용 읽기
   git show {guide-branch}:apps/front/.claude/skills/frontend-doc/SKILL.md
   ```

2. **구조 분석**
   - 기존 컴포넌트/페이지 구조 파악
   - 유사 기능 참고

3. **구현**
   - frontend-doc 규칙에 맞춰 코드 작성
   - 컴포넌트, 훅, 타입 등 필요한 파일 생성/수정

4. **초기 커밋**
   ```bash
   git add -A
   git commit -m "feat: {요구사항 요약}

   - 초기 구현"
   ```

### 4. 코드 리뷰 루프 시작

**80점 이상 통과할 때까지 다음을 반복:**

#### 4.1 코드 리뷰 수행

`code-reviewer` agent를 호출하여 리뷰 수행:

```
Task agent: code-reviewer
입력:
- git diff main...HEAD (apps/front/ 변경사항만)
- frontend-doc 스킬 참조
- guide-branch: {guide-branch} (기본값: develop)
```

> ⚠️ `guide-branch` 인자가 없으면 기본값 `develop` 사용

#### 4.2 점수 확인

- **80점 이상**: 루프 종료, 완료 단계로 이동
- **80점 미만**: 다음 단계로 진행

#### 4.3 피드백 반영

code-reviewer가 제시한 violations를 하나씩 수정:

1. 각 violation의 `suggestion`을 확인
2. 해당 파일의 해당 라인 수정
3. 수정 완료 후 커밋

```bash
git add -A
git commit -m "fix: code review 피드백 반영

- {violation 1 요약}
- {violation 2 요약}
..."
```

#### 4.4 재리뷰

수정 후 다시 4.1로 돌아가서 코드 리뷰 재수행

### 5. 완료

80점 이상 통과 시:

```
## 구현 완료

**요구사항**: {requirement}
**브랜치**: feature/{slug}
**최종 점수**: {score}점
**상태**: ✅ 통과

### 구현 내역
- 생성된 파일 목록
- 수정된 파일 목록

### 리뷰 요약
{summary}

### frontend-doc 보강 제안
{frontendDocSuggestions가 있으면 출력}

---
다음 단계: PR 생성을 원하시면 직접 `gh pr create` 명령을 실행해주세요.
```

## 루프 제한

- **최대 반복 횟수**: 5회
- 5회 반복 후에도 80점 미만이면:
  - 현재 상태 보고
  - 남은 violations 목록 출력
  - 사용자에게 수동 개입 요청

## 예시

### 인자로 요구사항 전달 (develop의 가이드 참조)

```
/saturday:implement "버튼 클릭 시 모달 표시"
```

### 대화형 입력

```
/saturday:implement
> 구현할 요구사항을 입력해주세요:
사용자 프로필 페이지에 아바타 업로드 기능 추가
```

### 다른 브랜치의 가이드 참조

```
/saturday:implement "버튼 클릭 시 모달 표시" --guide-branch main
```

## 주의 사항

1. **apps/front에만 구현**: 프론트엔드 코드만 대상
2. **frontend-doc 필수 참고**: 규칙에 맞게 구현해야 리뷰 통과
3. **자동 커밋**: 구현 및 수정사항은 자동으로 커밋됨
4. **PR 미생성**: PR은 사용자가 직접 생성해야 함
5. **main 브랜치 기준**: 항상 main에서 새 브랜치 생성
