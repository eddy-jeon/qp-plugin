# Saturday Plugin

코드 리뷰 기반 코드 품질 개선 워크플로우 - 기존 브랜치 개선 또는 새 브랜치 구현

## 개요

Saturday는 **코드 리뷰 ↔ 코드 구현 루프**를 통해 80점 이상의 코드 품질을 보장하는 플러그인입니다.

- **Jira 연동 없음**: 순수하게 코드 품질 개선에만 집중
- **PR 자동 생성 없음**: 사용자가 직접 PR 생성
- **frontend-doc 기준 평가**: 프로젝트 문서에 명시된 규칙만 감점 대상

## 사용법

### 1. 기존 브랜치 개선 (improve)

현재 브랜치 또는 지정한 브랜치의 변경사항을 리뷰하고 개선합니다.

```bash
# 현재 브랜치 개선
/saturday:improve

# 특정 브랜치 개선
/saturday:improve feature/user-profile
```

**워크플로우:**
1. 브랜치 확인 및 전환
2. base 브랜치(main/master) 대비 변경사항 분석
3. 코드 리뷰 수행
4. 80점 미만이면 피드백 반영 후 재리뷰
5. 80점 이상 통과 시 완료

### 2. 새 브랜치 구현 (implement)

요구사항을 받아 새 브랜치에서 코드를 구현합니다.

```bash
# 인자로 요구사항 전달
/saturday:implement "버튼 클릭 시 모달 표시"

# 대화형 입력
/saturday:implement
```

**워크플로우:**
1. 요구사항 파싱
2. 브랜치 생성 (feature/{slug})
3. frontend-doc 참고하여 코드 구현
4. 코드 리뷰 수행
5. 80점 미만이면 피드백 반영 후 재리뷰
6. 80점 이상 통과 시 완료

## 코드 리뷰 기준

### 감점 대상 (frontend-doc 규칙만)

- 컴포넌트 구조 규칙 위반
- 네이밍 컨벤션 위반
- 상태 관리 패턴 미준수
- API 호출 방식 위반
- 타입 정의 규칙 위반

### 심각도별 감점

| 심각도 | 감점 | 예시 |
|--------|------|------|
| Critical | -20 | 아키텍처 규칙 위반, 보안 규칙 위반 |
| Major | -10 | 컴포넌트 구조 위반, 상태 관리 패턴 위반 |
| Minor | -5 | 네이밍 컨벤션 위반, 스타일 가이드 위반 |

### 참고 정보 (감점 없음)

- 일반적인 React/TypeScript 베스트 프랙티스
- 성능 최적화 제안
- 접근성 개선 제안

## 요구 사항

- Git 저장소
- `apps/front/` 디렉토리 구조
- (권장) `apps/front/.claude/skills/frontend-doc/` 문서

## 플러그인 구조

```
plugins/saturday/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   ├── improve.md          # 기존 브랜치 개선
│   └── implement.md        # 새 브랜치 구현
├── agents/
│   └── code-reviewer.md    # 코드 리뷰 에이전트
├── skills/
│   └── code-quality/
│       └── SKILL.md        # 코드 품질 평가 기준
└── README.md
```

## 제한 사항

- **apps/front 전용**: 프론트엔드 코드만 대상
- **PR 미생성**: 완료 후 `gh pr create`로 직접 PR 생성 필요

## 라이선스

MIT
