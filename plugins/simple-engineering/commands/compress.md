---
name: simple:compress
description: 방대한 정보를 AI가 소화 가능한 형태로 압축합니다. 컨텍스트 엔지니어링의 핵심 도구입니다.
arguments:
  - name: target
    description: 압축할 파일 또는 디렉토리 경로
    required: true
  - name: focus
    description: 압축 시 집중할 측면 (예: api, types, logic)
    required: false
---

# Context Compression - Simple Engineering

당신은 **컨텍스트 압축**을 수행합니다. 방대한 코드베이스나 문서를 AI가 효과적으로 활용할 수 있는 형태로 변환합니다.

## 대상: $ARGUMENTS.target
## 초점: $ARGUMENTS.focus

## 압축 원칙

### 컨텍스트 엔지니어링
AI의 컨텍스트 윈도우는 제한적입니다. 효과적인 협업을 위해:
- **노이즈 제거**: 구현 세부사항, 주석, 불필요한 코드 제거
- **시그널 강화**: 핵심 구조, 인터페이스, 의존성 강조
- **구조 유지**: 전체적인 아키텍처 파악 가능하게 유지

### 압축 레벨

| Level | 용도 | 포함 내용 |
|-------|------|----------|
| L1: Index | 전체 구조 파악 | 파일 목록, 디렉토리 구조 |
| L2: Interface | API 이해 | 타입, 시그니처, 공개 인터페이스 |
| L3: Logic | 로직 이해 | 핵심 알고리즘, 비즈니스 로직 |
| L4: Full | 전체 이해 | 구현 세부사항 포함 |

## 수행 절차

### 1. 대상 분석

대상 파일/디렉토리를 탐색하고 구조를 파악합니다:

```
Target Analysis:
- Type: [file/directory]
- Size: [파일 수, 라인 수]
- Languages: [사용 언어]
- Structure: [구조 요약]
```

### 2. 압축 전략 결정

대상과 초점에 따라 압축 전략을 선택합니다:

```
Compression Strategy:
- Level: [L1-L4]
- Focus: [api/types/logic/all]
- Preserve: [유지할 요소]
- Remove: [제거할 요소]
```

### 3. 레벨별 압축 수행

#### L1: Index (구조 인덱스)
```
project/
├── src/
│   ├── components/    # UI 컴포넌트 (15 files)
│   ├── services/      # 비즈니스 로직 (8 files)
│   ├── utils/         # 유틸리티 (12 files)
│   └── types/         # 타입 정의 (5 files)
├── tests/             # 테스트 (20 files)
└── config/            # 설정 (3 files)
```

#### L2: Interface (인터페이스 추출)
```typescript
// services/user.ts
export interface UserService {
  findById(id: string): Promise<User | null>;
  create(data: CreateUserDto): Promise<User>;
  update(id: string, data: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<void>;
}

// services/auth.ts
export interface AuthService {
  login(credentials: Credentials): Promise<Token>;
  logout(): Promise<void>;
  refresh(token: string): Promise<Token>;
}
```

#### L3: Logic (로직 요약)
```
## UserService Logic

### findById
1. Validate ID format
2. Query database
3. Return user or null

### create
1. Validate input
2. Check email uniqueness
3. Hash password
4. Insert to database
5. Send welcome email
6. Return created user
```

#### L4: Full (전체 포함)
원본 코드를 구조화하여 포함합니다.

### 4. 의존성 맵 생성

```
Dependency Map:

UserService
├── depends on: Database, EmailService, Logger
└── used by: UserController, AuthService

AuthService
├── depends on: UserService, TokenService
└── used by: AuthController, Middleware
```

### 5. 산출물 생성

압축 결과를 저장합니다:

```markdown
# Context: [Target Name]

**Generated**: [Date]
**Level**: [L1-L4]
**Focus**: [Focus area]

## Structure
[L1 내용]

## Interfaces
[L2 내용]

## Logic Summary
[L3 내용]

## Dependencies
[의존성 맵]

## Key Insights
- [핵심 인사이트 1]
- [핵심 인사이트 2]

## Usage Notes
이 컨텍스트를 활용할 때 주의사항:
- [주의사항]
```

### 6. 출력

압축 결과를 직접 출력하거나, 파일로 저장합니다:

```
Context Compression 완료!

Original: [원본 크기]
Compressed: [압축 크기]
Ratio: [압축률]%

저장 위치: .claude/simple-engineering/context/{name}.md

이 컨텍스트를 다른 세션에서 사용하려면:
해당 파일을 컨텍스트로 제공하세요.
```

## 특수 압축 모드

### API 중심 압축 (--focus api)
- 공개 API만 추출
- 내부 구현 제거
- 사용 예시 포함

### 타입 중심 압축 (--focus types)
- 모든 타입 정의 추출
- 타입 관계도 생성
- 제네릭 사용 패턴 분석

### 로직 중심 압축 (--focus logic)
- 비즈니스 로직만 추출
- 알고리즘 설명
- 분기 조건 명시

## 사용할 Agents

- **compressor**: 실제 압축 작업 수행
- **complexity-analyst**: 복잡성 기반 압축 우선순위 결정
