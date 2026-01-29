---
name: monday:insight
description: Google Drive의 Gemini 회의록에서 업무 인사이트를 추출합니다.
arguments:
  - name: days
    description: 조회할 기간 (일 수)
    required: true
---

# 미팅 회의록 인사이트 추출

지정된 기간 동안의 Gemini 회의록을 분석하여 업무 인사이트를 제공합니다.

## 워크플로우

### 0. Google Drive MCP 설정 확인

먼저 Google Drive MCP가 사용 가능한지 확인합니다.

**확인 방법**:
```bash
# MCP 설정 파일 확인
cat ~/.claude/mcp.json 2>/dev/null || cat .mcp.json 2>/dev/null
```

**Case A: MCP 설정됨 + 인증됨**
- `mcp__gdrive__search` 도구가 사용 가능하면 → 1단계로 진행

**Case B: MCP 설정 안 됨**
- 사용자에게 안내: "Google Drive MCP를 설정합니다."
- 설정 파일에 gdrive 설정 추가:

```bash
# ~/.claude/mcp.json 파일에 추가 (없으면 생성)
```

```json
{
  "mcpServers": {
    "gdrive": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-gdrive"]
    }
  }
}
```

- 안내: "설정이 추가되었습니다. Claude Code를 재시작하면 Google 로그인 창이 열립니다."
- 안내: "로그인 완료 후 `/monday:insight {days}`를 다시 실행해주세요."
- 종료

**Case C: MCP 설정됨 + 인증 안 됨**
- `mcp__gdrive__search` 실행 시 인증 오류 발생
- 안내: "Google 계정 인증이 필요합니다."
- 브라우저에서 인증 URL 오픈 안내
- 안내: "로그인 완료 후 다시 실행해주세요."
- 종료

### 1. 관점 정의 로드

`${CLAUDE_PLUGIN_ROOT}/config/perspectives.md` 파일을 읽어 인사이트 추출 관점을 파악합니다.

### 2. 회의록 검색

Google Drive MCP를 사용하여 회의록을 검색합니다.

**검색 조건**:
- 파일명에 "Gemini가 작성한 회의록" 포함
- 최근 {days}일 이내 생성/수정된 파일

**MCP 도구 사용**:
```
mcp__gdrive__search 도구를 사용하여 검색
쿼리: "Gemini가 작성한 회의록"
```

### 3. 회의록 내용 읽기

검색된 각 회의록 파일의 내용을 읽습니다.

**MCP 도구 사용**:
```
mcp__gdrive__read_file 도구를 사용하여 파일 내용 읽기
```

### 4. 인사이트 추출

각 회의록에서 `perspectives.md`에 정의된 관점별로 인사이트를 추출합니다.

**추출 규칙**:
- 각 관점의 "주요 키워드"와 "질문 프레임"을 기준으로 관련 내용 식별
- 단순 요약이 아닌 **행동 가능한 인사이트** 중심으로 정리
- 관점과 관련 없는 내용은 제외

### 5. 결과 출력

다음 형식으로 인사이트를 출력합니다:

```markdown
# 📊 미팅 인사이트 리포트

**기간**: {시작일} ~ {종료일}
**분석한 회의록**: {N}개

---

## 🚀 제품 기능/개발

### 주요 인사이트
1. **{인사이트 제목}**
   - 출처: {회의명} ({날짜})
   - 내용: {구체적 내용}
   - 시사점: {왜 중요한지, 어떤 영향이 있는지}

2. ...

### 액션 아이템
- [ ] {follow-up이 필요한 항목}

---

## 🛠️ DX (개발자 경험)

### 주요 인사이트
1. **{인사이트 제목}**
   - 출처: {회의명} ({날짜})
   - 내용: {구체적 내용}
   - 시사점: {왜 중요한지, 어떤 영향이 있는지}

2. ...

### 액션 아이템
- [ ] {follow-up이 필요한 항목}

---

## 📝 기타 주목할 만한 내용

{관점에 포함되지 않지만 중요해 보이는 내용이 있으면 여기에}
```

## 주의사항

- Google Drive MCP가 설정되어 있지 않으면 자동으로 설정을 시도합니다
- MCP 설정 후 Claude Code 재시작이 필요할 수 있습니다
- Google 계정 인증은 브라우저에서 사용자가 직접 진행해야 합니다
- 회의록이 없으면 "해당 기간에 회의록이 없습니다"를 출력합니다
- 파일 접근 권한이 없는 회의록은 건너뜁니다

## 관점 수정

인사이트 추출 관점을 변경하려면 `${CLAUDE_PLUGIN_ROOT}/config/perspectives.md` 파일을 수정하세요.
