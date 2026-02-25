# Friday - FE 코드 워크플로우 비서

프론트엔드 코드 작업을 위한 통합 워크플로우 플러그인입니다.

- **PR 리뷰**: 기존 PR의 FE 코드를 리뷰하고 메타리뷰로 품질 검증
- **코드 개선**: 기존 브랜치의 코드를 80점 이상까지 자동 개선
- **구현**: 요구사항 기반 새 코드 구현 및 품질 검증
- **Jira 자동화**: Jira 티켓 기반 완전 자동화 워크플로우

## 명령어

### PR 리뷰

```bash
/friday:review-pr 123
/friday:review-pr 123 --guide-branch main
```

기존 PR의 FE 변경사항을 리뷰합니다. 메타리뷰 통과 시 자동으로 PR 코멘트 게시.

**자연어 요청도 가능**:
```
"friday의 review 스킬로 PR 123 리뷰해줘"
"PR 456 FE 리뷰해줘"
```

### 리뷰 수동 제출

```bash
/friday:submit-review
```

메타리뷰 자동 수정 한계(10회) 도달 시 현재 상태로 게시.

### 코드 개선

```bash
/friday:improve
/friday:improve feature/user-profile
/friday:improve --guide-branch main
```

기존 브랜치의 코드를 리뷰하고 **80점 이상 통과할 때까지** 자동 개선.

### 새 코드 구현

```bash
/friday:implement "버튼 클릭 시 모달 표시"
/friday:implement --guide-branch main
```

요구사항을 받아 새 브랜치에서 구현하고 **80점 이상 통과할 때까지** 코드 리뷰와 수정 반복.

### Jira 기반 자동화

```bash
/friday:jira PROJ-123
/friday:jira PROJ-123 --guide-branch main
```

Jira 티켓 기반 **완전 자동화** 워크플로우:
1. 티켓 분석 & 작업 계획 수립
2. 코드 구현
3. 코드 리뷰 (80점 게이트)
4. 요구사항 리뷰 (80점 게이트)
5. PR 생성 & Jira 코멘트

### 테스트 코드 점진적 작성

```bash
/friday:write-test
/friday:write-test --guide-branch main
```

프로젝트의 테스트 코드를 **한 파일씩** 점진적으로 작성합니다. 진행 상황을 `~/.claude/friday/test-progress/`에 추적하여 세션 간 이어서 작업 가능.

### Jira CLI 설정

```bash
/friday:setup
```

Jira 연동을 위한 CLI 설정 가이드.

## 컴포넌트

### Commands

| 명령어 | 설명 |
|--------|------|
| `review-pr` | PR FE 코드 리뷰 |
| `submit-review` | 리뷰 결과 PR 코멘트 게시 |
| `improve` | 기존 브랜치 코드 개선 |
| `implement` | 요구사항 기반 새 코드 구현 |
| `write-test` | 테스트 코드 점진적 작성 |
| `jira` | Jira 티켓 기반 자동화 |
| `setup` | Jira CLI 설정 |

### Agents

| 에이전트 | 모델 | 설명 |
|----------|------|------|
| `meta-reviewer` | sonnet | 리뷰 결과 품질 검증 (메타리뷰) |
| `review-formatter` | haiku | 리뷰 결과 마크다운 포맷터 |
| `code-reviewer` | sonnet | 코드 품질 리뷰 (frontend-doc 기준) |
| `spec-reviewer` | sonnet | 요구사항 충족도 평가 |
| `planner` | **opus** | Jira 티켓 분석 및 작업 계획 수립 |

### Skills

| 스킬 | 설명 |
|------|------|
| `review` | PR FE 코드 리뷰 워크플로우 (자연어 요청 가능) |
| `fe-review` | 기본 FE 리뷰 가이드 (fallback) |
| `code-quality` | frontend-doc 기반 코드 품질 평가 기준 |
| `spec-compliance` | 요구사항 충족도 평가 기준 |

## 워크플로우 비교

| 명령어 | 대상 | 출력 | 자동화 수준 |
|--------|------|------|-------------|
| `review-pr` | 기존 PR | PR 코멘트 | 메타리뷰 → 자동 게시 |
| `improve` | 내 브랜치 | 코드 수정 | 80점까지 자동 수정 |
| `implement` | 새 브랜치 | 코드 구현 | 80점까지 자동 수정 |
| `write-test` | 소스 파일 | 테스트 파일 | 한 파일씩 점진 작성 |
| `jira` | Jira 티켓 | PR 생성 | 완전 자동화 |

## 주요 특징

### frontend-doc 우선

모든 코드 리뷰는 **frontend-doc에 명시된 규칙만** 감점 대상:
- 일반 품질 이슈는 참고 정보로만 제공
- frontend-doc이 없으면 100점 (감점 기준 없음)

### 80점 게이트

`improve`, `implement`, `jira` 명령어는 **80점 이상** 통과해야 완료:
- 코드 리뷰: frontend-doc 규칙 준수
- 요구사항 리뷰: Jira 티켓 충족도 (jira만 해당)

### 메타리뷰

`review-pr` 명령어는 **메타리뷰**로 리뷰 품질 검증:
- 맥락 적절성, Step-by-step, 근거 필수, 간결함
- 통과할 때까지 자동 수정 (최대 10회)
