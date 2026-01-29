# Monday - 미팅 인사이트 플러그인

미팅 회의록에서 업무 인사이트를 추출하는 Claude Code 플러그인입니다.

## 목적

미팅 내용을 단순히 요약하는 것이 아니라, 회의록을 통해 **회사 업무의 인사이트**를 얻는 것이 목표입니다.

## 기능

### `/monday:insight <days>`

지정된 기간(일) 동안의 Gemini 회의록을 분석하여 인사이트를 추출합니다.

```bash
/monday:insight 7    # 최근 7일간 회의록 분석
/monday:insight 14   # 최근 14일간 회의록 분석
```

## 인사이트 관점

기본적으로 두 가지 관점에서 인사이트를 추출합니다:

1. **제품 기능/개발**: 새로운 기능, 기술적 결정, 제품 방향성
2. **DX (개발자 경험)**: 개발 프로세스, 도구/인프라, 팀 협업

### 관점 커스터마이징

`config/perspectives.md` 파일을 수정하여 관점을 추가하거나 변경할 수 있습니다.

## 사전 요구사항: gdrive CLI

이 플러그인은 [gdrive CLI](https://github.com/glotlabs/gdrive)를 사용합니다.

### 설치

```bash
# macOS
brew install gdrive

# Linux - 릴리즈 페이지에서 다운로드
# https://github.com/glotlabs/gdrive/releases
```

### Google 계정 인증

```bash
gdrive account add
```

브라우저가 열리면 Google 계정으로 로그인하세요.

### 설치 확인

```bash
gdrive account list
# → 인증된 계정이 표시되면 준비 완료
```

**참고**: `/monday:insight` 실행 시 gdrive가 없거나 인증이 안 되어 있으면 자동으로 안내합니다.

## 출력 예시

```markdown
# 📊 미팅 인사이트 리포트

**기간**: 2026-01-22 ~ 2026-01-29
**분석한 회의록**: 5개

---

## 🚀 제품 기능/개발

### 주요 인사이트
1. **AI 기반 검색 기능 도입 검토**
   - 출처: Solution 팀 AI 맛집 공유 (2026/01/29)
   - 내용: RAG 기반 문서 검색 기능 PoC 진행 결정
   - 시사점: Q2 로드맵에 영향 가능성

### 액션 아이템
- [ ] RAG PoC 결과 follow-up

---

## 🛠️ DX (개발자 경험)

### 주요 인사이트
1. **PR 리뷰 프로세스 개선**
   - 출처: 개발팀 위클리 (2026/01/27)
   - 내용: Claude Code 기반 자동 리뷰 도입 논의
   - 시사점: 리뷰 병목 해소 기대
```

## 향후 계획

- [ ] `monday:diff` - 이전 인사이트와 비교하여 변화 추적
- [ ] 인사이트 저장 및 히스토리 관리
