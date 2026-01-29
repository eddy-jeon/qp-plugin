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

### 0. gdrive CLI 설정 확인

먼저 gdrive CLI가 설치되고 인증되었는지 확인합니다.

**확인 방법**:
```bash
# gdrive 설치 확인
which gdrive

# 계정 인증 확인
gdrive account list
```

**Case A: gdrive 설치됨 + 인증됨**
- `gdrive account list`에서 계정이 보이면 → 1단계로 진행

**Case B: gdrive 미설치**
- 안내: "gdrive CLI를 설치해야 합니다."
- 설치 방법 안내:

```bash
# macOS
brew install glotlabs/tap/gdrive

# Linux (다운로드)
# https://github.com/glotlabs/gdrive/releases 에서 다운로드
```

- 안내: "설치 완료 후 `/monday:insight {days}`를 다시 실행해주세요."
- 종료

**Case C: gdrive 설치됨 + 인증 안 됨**
- `gdrive account list` 결과가 비어있으면
- 안내: "Google 계정 인증이 필요합니다."

```bash
gdrive account add
```

- 안내: "브라우저에서 Google 로그인 후 다시 실행해주세요."
- 종료

### 1. 관점 정의 로드

`${CLAUDE_PLUGIN_ROOT}/config/perspectives.md` 파일을 읽어 인사이트 추출 관점을 파악합니다.

### 2. 회의록 검색

gdrive CLI를 사용하여 회의록을 검색합니다.

**검색 명령어**:
```bash
# "Gemini가 작성한 회의록" 이름 패턴으로 검색
gdrive files list --query "name contains 'Gemini가 작성한 회의록'"
```

**날짜 필터링**:
- 검색 결과에서 최근 {days}일 이내 파일만 선택
- 파일명에 포함된 날짜 정보를 파싱하거나 modifiedTime 기준으로 필터링

### 3. 회의록 내용 읽기

검색된 각 회의록 파일의 내용을 읽습니다.

**임시 디렉토리 생성**:
```bash
TEMP_DIR=$(mktemp -d)
```

**파일 export (Google Docs → txt)**:
```bash
# 각 파일에 대해
gdrive files export {fileId} --destination "$TEMP_DIR/"
```

**파일 내용 읽기**:
```bash
cat "$TEMP_DIR/{filename}"
```

### 4. 인사이트 추출

각 회의록에서 `perspectives.md`에 정의된 관점별로 인사이트를 추출합니다.

**추출 규칙**:
- 각 관점의 "주요 키워드"와 "질문 프레임"을 기준으로 관련 내용 식별
- 단순 요약이 아닌 **행동 가능한 인사이트** 중심으로 정리
- 관점과 관련 없는 내용은 제외

### 5. 임시 파일 정리

```bash
rm -rf "$TEMP_DIR"
```

### 6. 결과 출력

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

- gdrive CLI가 설치되어 있지 않으면 설치 방법을 안내합니다
- Google 계정 인증은 `gdrive account add` 명령어로 진행합니다
- 회의록이 없으면 "해당 기간에 회의록이 없습니다"를 출력합니다
- 파일 접근 권한이 없는 회의록은 건너뜁니다
- 임시 파일은 작업 완료 후 자동으로 삭제됩니다

## 관점 수정

인사이트 추출 관점을 변경하려면 `${CLAUDE_PLUGIN_ROOT}/config/perspectives.md` 파일을 수정하세요.
