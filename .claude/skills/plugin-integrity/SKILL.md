---
name: plugin-integrity
description: 플러그인 변경 후 커밋 전 정합성 검증. 버전 동기화, README 컴포넌트 표 누락, marketplace.json 일치 여부를 확인하고 자동 수정합니다.
when_to_use: |
  - plugins/ 하위 파일을 수정한 후 커밋 전
  - "정합성 검증", "plugin-integrity", "플러그인 검증"
  - 버전 bump 누락이 의심될 때
---

# 플러그인 정합성 검증

plugins/ 하위 변경 사항의 정합성을 검증하고 불일치를 자동 수정합니다.

## 검증 절차

### Step 1: 변경된 플러그인 식별

```bash
git diff --cached --name-only | grep '^plugins/'
```

staged 파일이 없으면 unstaged 변경도 확인:

```bash
git diff --name-only | grep '^plugins/'
```

변경된 파일에서 플러그인 이름(plugins/{name}/...)을 추출한다.

### Step 2: 버전 관리 검증

변경된 각 플러그인에 대해:

1. `plugins/{name}/.claude-plugin/plugin.json`의 `version` 필드를 읽는다.
2. `.claude-plugin/marketplace.json`의 `plugins` 배열에서 해당 플러그인의 `version`을 읽는다.
3. **검증 항목**:
   - plugin.json에 version 필드가 존재하는가?
   - marketplace.json에 해당 플러그인의 version 필드가 존재하는가?
   - 두 version이 일치하는가?
   - 이전 커밋 대비 version이 bump 되었는가? (`git show HEAD:plugins/{name}/.claude-plugin/plugin.json`으로 이전 버전 확인)

4. **불일치 시 자동 수정**:
   - plugin.json에 version이 없으면 → `"version": "1.0.0"` 추가
   - marketplace.json에 version이 없으면 → plugin.json의 version으로 추가
   - 두 version이 다르면 → plugin.json 기준으로 marketplace.json을 수정
   - version bump가 안 되어 있으면 → 사용자에게 bump 여부를 질문 (patch/minor/major)

### Step 3: README 컴포넌트 표 정합성

변경된 각 플러그인에 대해:

1. `plugins/{name}/README.md`를 읽는다.
2. 실제 파일 시스템을 확인한다:
   - `plugins/{name}/commands/*.md` 파일 목록
   - `plugins/{name}/agents/*.md` 파일 목록
   - `plugins/{name}/skills/*/SKILL.md` 디렉토리 목록
3. README 내 테이블과 대조한다:
   - Commands 표에 모든 command 파일이 있는가?
   - Agents 표에 모든 agent 파일이 있는가?
   - Skills 표에 모든 skill 디렉토리가 있는가?
4. **누락 발견 시**:
   - 누락된 항목을 경고로 출력
   - 해당 .md 파일의 frontmatter에서 name, description을 읽어 표에 추가할 행을 제안
   - 사용자 승인 후 README 수정

### Step 4: marketplace.json description 정합성

변경된 각 플러그인에 대해:

1. `plugins/{name}/.claude-plugin/plugin.json`의 `description`을 읽는다.
2. `.claude-plugin/marketplace.json`에서 해당 플러그인의 `description`을 읽는다.
3. 두 description이 다르면 → plugin.json 기준으로 marketplace.json을 수정한다.

### Step 5: 결과 보고

검증 결과를 요약 테이블로 출력한다:

```
| 플러그인 | 버전 | README | marketplace | 상태 |
|----------|------|--------|-------------|------|
| friday   | ✅   | ⚠ 1건  | ✅          | 수정됨 |
```

- ✅ 정합 / ⚠ 경고(수정 제안) / ❌ 오류(수동 확인 필요)
