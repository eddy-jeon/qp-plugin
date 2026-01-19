---
name: setup
description: 학습 내용을 저장할 레포지토리 경로를 설정합니다
---

# Session Learner 설정

학습 내용을 저장할 레포지토리 경로를 설정합니다.

## 작업 순서

1. **사용자에게 레포지토리 경로 입력 요청**
   - AskUserQuestion 도구를 사용하여 레포지토리 경로를 입력받으세요
   - 질문: "학습 내용을 저장할 Git 레포지토리의 절대 경로를 입력해주세요"

2. **경로 유효성 검증**
   - 해당 경로가 존재하는 디렉토리인지 확인
   - 해당 경로가 git 레포지토리인지 확인 (`git -C <path> rev-parse --git-dir`)
   - 검증 실패 시 에러 메시지와 함께 다시 입력 요청

3. **설정 파일 생성**
   - `~/.claude/session-learner.local.md` 파일 생성
   - 파일 형식:
   ```yaml
   ---
   repository_path: <사용자가 입력한 경로>
   ---

   # Session Learner 설정

   이 파일은 session-learner 플러그인의 설정을 저장합니다.
   ```

4. **완료 메시지 출력**
   - 설정이 완료되었음을 알리고
   - `/session-learner:save-session` 커맨드로 수동 저장 가능
   - 세션 종료 시 자동 저장됨을 안내
