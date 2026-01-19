---
name: spec-writing
description: Paint-by-Numbers 수준의 상세 명세서 작성 방법을 제공합니다. 구현 시 AI가 추론할 필요가 없도록 모든 결정 사항을 명시하는 기법입니다.
when_to_use: Planning Phase 수행 시, 명세서 작성 시, 설계 문서화 시
---

# Spec Writing Skill

## 개요

이 Skill은 **Paint-by-Numbers** 수준의 상세 명세서를 작성하는 방법을 제공합니다.
목표는 구현 단계에서 AI가 "추론"이나 "판단"을 할 필요가 없도록 모든 결정 사항을 명시하는 것입니다.

## Paint-by-Numbers 원칙

### 왜 Paint-by-Numbers인가?

```
일반적인 명세서:
"사용자 인증 기능을 구현하세요"
→ AI가 추론: 어떤 방식? 어떤 라이브러리? 에러 처리는?

Paint-by-Numbers 명세서:
"src/auth/login.ts 파일에 다음 함수를 구현:
 async function login(email: string, password: string): Promise<AuthResult>
 - bcrypt로 비밀번호 검증
 - 실패 시 AuthError('INVALID_CREDENTIALS') throw
 - 성공 시 JWT 토큰 반환 (expiresIn: '1h')"
→ AI는 지시대로만 구현
```

### 모호함 제거

다음 표현은 **금지**:

| 금지 | 대체 |
|------|------|
| "적절히 처리" | 구체적인 처리 방법 명시 |
| "필요에 따라" | 조건과 행동을 명확히 명시 |
| "등" / "기타" | 모든 항목을 나열 |
| "일반적인 방법으로" | 정확한 방법 명시 |
| "에러 처리 추가" | 어떤 에러를 어떻게 처리할지 명시 |

## 명세서 구성 요소

### 1. 파일 구조 (File Structure)

```markdown
## File Changes

### Modified Files
| Path | Purpose | Change Type |
|------|---------|-------------|
| `src/auth/login.ts` | 로그인 함수 추가 | Add function |
| `src/types/auth.ts` | 타입 추가 | Add types |

### New Files
| Path | Purpose | Template |
|------|---------|----------|
| `src/auth/logout.ts` | 로그아웃 기능 | Service file |
| `src/auth/__tests__/login.test.ts` | 로그인 테스트 | Test file |
```

### 2. 타입 정의 (Type Definitions)

```typescript
// 정확한 타입을 명시
interface LoginRequest {
  email: string;      // 이메일 형식, 필수
  password: string;   // 최소 8자, 필수
}

interface LoginResponse {
  token: string;      // JWT 토큰
  expiresAt: number;  // Unix timestamp
  user: {
    id: string;
    email: string;
    name: string;
  };
}

type AuthError =
  | { code: 'INVALID_EMAIL'; message: string }
  | { code: 'INVALID_PASSWORD'; message: string }
  | { code: 'USER_NOT_FOUND'; message: string };
```

### 3. 함수 시그니처 (Function Signatures)

```typescript
/**
 * 사용자 로그인 처리
 *
 * @param request - 로그인 요청 데이터
 * @returns 인증 결과 (토큰 포함)
 * @throws AuthError - 인증 실패 시
 *
 * Implementation Notes:
 * 1. email을 소문자로 정규화
 * 2. database에서 사용자 조회
 * 3. bcrypt.compare로 비밀번호 검증
 * 4. JWT 토큰 생성 (secret: process.env.JWT_SECRET)
 */
async function login(request: LoginRequest): Promise<LoginResponse>
```

### 4. 로직 명세 (Logic Specification)

```markdown
## Function: login

### Input Validation
1. email이 유효한 이메일 형식인지 확인
   - Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
   - 실패 시: throw AuthError('INVALID_EMAIL')

2. password가 최소 8자인지 확인
   - 실패 시: throw AuthError('INVALID_PASSWORD')

### Main Logic
1. email을 소문자로 변환: `email.toLowerCase()`

2. 사용자 조회:
   ```typescript
   const user = await db.users.findByEmail(normalizedEmail);
   if (!user) throw new AuthError('USER_NOT_FOUND');
   ```

3. 비밀번호 검증:
   ```typescript
   const valid = await bcrypt.compare(password, user.passwordHash);
   if (!valid) throw new AuthError('INVALID_PASSWORD');
   ```

4. 토큰 생성:
   ```typescript
   const token = jwt.sign(
     { userId: user.id, email: user.email },
     process.env.JWT_SECRET,
     { expiresIn: '1h' }
   );
   ```

### Return Value
```typescript
return {
  token,
  expiresAt: Date.now() + 3600000,
  user: {
    id: user.id,
    email: user.email,
    name: user.name
  }
};
```
```

### 5. 에러 처리 (Error Handling)

```markdown
## Error Handling Matrix

| Error Code | Condition | HTTP Status | User Message |
|------------|-----------|-------------|--------------|
| INVALID_EMAIL | 이메일 형식 불일치 | 400 | "유효한 이메일을 입력하세요" |
| INVALID_PASSWORD | 비밀번호 불일치 | 401 | "이메일 또는 비밀번호가 잘못되었습니다" |
| USER_NOT_FOUND | DB에 사용자 없음 | 401 | "이메일 또는 비밀번호가 잘못되었습니다" |
| RATE_LIMITED | 5회 이상 실패 | 429 | "잠시 후 다시 시도하세요" |

### Error Response Format
```json
{
  "error": {
    "code": "INVALID_EMAIL",
    "message": "유효한 이메일을 입력하세요"
  }
}
```
```

### 6. 테스트 케이스 (Test Cases)

```markdown
## Test Suite: login

### Happy Path
| ID | Description | Input | Expected Output |
|----|-------------|-------|-----------------|
| T1 | 정상 로그인 | valid email, valid password | token, user data |
| T2 | 대문자 이메일 | "TEST@EMAIL.COM" | 정상 처리 (소문자 변환) |

### Error Cases
| ID | Description | Input | Expected Error |
|----|-------------|-------|----------------|
| T3 | 잘못된 이메일 형식 | "not-an-email" | INVALID_EMAIL |
| T4 | 짧은 비밀번호 | password: "123" | INVALID_PASSWORD |
| T5 | 존재하지 않는 사용자 | unknown email | USER_NOT_FOUND |
| T6 | 틀린 비밀번호 | wrong password | INVALID_PASSWORD |

### Edge Cases
| ID | Description | Input | Expected Behavior |
|----|-------------|-------|-------------------|
| T7 | 빈 이메일 | email: "" | INVALID_EMAIL |
| T8 | 빈 비밀번호 | password: "" | INVALID_PASSWORD |
| T9 | SQL Injection | email: "'; DROP TABLE--" | 안전하게 처리 |
```

### 7. 구현 순서 (Implementation Order)

```markdown
## Implementation Order

1. **Types** - `src/types/auth.ts`
   - Dependencies: None
   - Creates: LoginRequest, LoginResponse, AuthError

2. **Error Classes** - `src/auth/errors.ts`
   - Dependencies: Types
   - Creates: AuthError class

3. **Login Function** - `src/auth/login.ts`
   - Dependencies: Types, Errors, Database, bcrypt, jwt
   - Creates: login function

4. **Tests** - `src/auth/__tests__/login.test.ts`
   - Dependencies: Login function
   - Creates: Test suite

5. **Integration** - `src/routes/auth.ts`
   - Dependencies: Login function
   - Updates: POST /api/auth/login route
```

## 체크포인트 통합

### 설계 결정 체크포인트

중요한 설계 결정마다 체크포인트를 생성:

```markdown
<checkpoint type="decision" id="cp-XXX">
## Design Decision: 비밀번호 해싱

**Options**:
1. bcrypt (권장)
   - Pros: 검증됨, 느린 해시로 brute-force 방지
   - Cons: CPU 부하

2. argon2
   - Pros: 최신, 메모리 하드
   - Cons: 라이브러리 추가 필요

**Selection**: bcrypt
**Reason**: 기존 코드베이스에서 사용 중, 검증된 선택

---
이 결정이 적절한지 확인해 주세요.
</checkpoint>
```

## 검증 체크리스트

명세서 완료 전 확인:

### 완전성
- [ ] 모든 파일 경로가 명시됨
- [ ] 모든 타입이 정의됨
- [ ] 모든 함수 시그니처가 명시됨
- [ ] 모든 에러 케이스가 정의됨
- [ ] 테스트 케이스가 포함됨

### 명확성
- [ ] 모호한 표현이 없음
- [ ] 모든 조건이 명시적임
- [ ] 구현 순서가 명확함

### 일관성
- [ ] 네이밍이 일관됨
- [ ] 에러 처리가 일관됨
- [ ] 타입 사용이 일관됨

### 실현 가능성
- [ ] 의존성이 사용 가능함
- [ ] 기존 코드와 호환됨
- [ ] 제약 조건이 만족됨
