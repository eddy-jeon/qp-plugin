# Simple Engineering Plugin

AI 협업 시 **"쉬움(Easy)"이 아닌 "단순함(Simple)"**을 추구하는 워크플로우 플러그인입니다.

## 핵심 철학

- **Simple vs Easy**: 구조적 무결성(Simple) vs 접근성(Easy) 구분
- **Essential vs Accidental**: 본질적 복잡성 vs 부수적 복잡성 식별
- **Earned Understanding**: 인간이 시스템을 이해한 상태에서만 AI 활용

## 설치

```bash
claude --plugin-dir /path/to/simple-engineering
```

## 3단계 프로세스

### Phase 1: Research

```bash
/simple:research [task]
```

체계적 조사 및 분석을 수행합니다.
- AI 분석 결과에 대한 **인간 체크포인트** 권장
- 가정과 사실 구분
- 산출물: `.claude/simple-engineering/research/{task-id}.md`

### Phase 2: Planning

```bash
/simple:plan [research-file]
```

"숫자로 색칠하기(Paint-by-Numbers)" 수준의 상세 명세서를 작성합니다.
- 파일 경로, 함수 시그니처, 테스트 케이스 포함
- spec-validator로 품질 검증
- 산출물: `.claude/simple-engineering/specs/{task-id}.md`

### Phase 3: Implementation

```bash
/simple:implement [spec-file]
```

명세서 기반 **단발성(One-shot)** 코드 생성을 수행합니다.
- "대화의 소용돌이(Conversation Spiral)" 방지
- 구현 후 명세서와 대조 검증

## 보조 도구

### 컨텍스트 압축

```bash
/simple:compress [file-or-directory]
```

방대한 정보를 AI가 소화 가능한 명세서로 변환합니다.

### 복잡성 분석

```bash
/simple:analyze [target]
```

Essential vs Accidental 복잡성을 식별합니다.

## 체크포인트 시스템

플러그인은 **권장 모드**로 동작합니다:
- 체크포인트 도달 시 검증 권장 메시지 표시
- `skip` 또는 `continue` 선택 가능
- 건너뛴 체크포인트는 상태 파일에 기록

### 체크포인트 유형

| 유형 | 발생 시점 | 필수 여부 |
|------|----------|----------|
| Assumption | Research 중 가정 도출 시 | Recommended |
| Decision | 중요 설계 결정 시 | Recommended |
| Progress | 단계 완료 시 | Optional |
| Recovery | Context 저장 시 | Automatic |

## 상태 관리

상태 파일 위치:

```
.claude/simple-engineering/
├── state.md              # 현재 프로젝트 상태
├── research/
│   └── {task-id}.md      # Research 산출물
├── specs/
│   └── {task-id}.md      # 명세서
└── checkpoints/
    └── {task-id}-{n}.md  # 체크포인트 기록
```

## 핵심 개념

### Earned Understanding (축적된 이해)

AI가 생성한 코드를 맹목적으로 수용하지 않고, 인간이 시스템을 이해한 상태에서만 AI를 활용합니다.
체크포인트는 이 이해를 검증하는 지점입니다.

### Paint-by-Numbers Specification

구현 단계에서 AI가 "추론"할 필요가 없도록, 모든 결정 사항이 명시된 상세 명세서를 작성합니다:
- 정확한 파일 경로
- 함수 시그니처
- 에러 처리 방식
- 테스트 케이스

### Context Engineering

AI의 컨텍스트 윈도우를 효율적으로 활용하기 위해:
- 불필요한 정보 제거
- 핵심 정보 압축
- 명확한 구조화

## License

MIT
