#!/bin/bash

# Simple Engineering - State Loader
# 세션 시작 시 이전 상태를 로드합니다.

STATE_DIR=".claude/simple-engineering"
STATE_FILE="$STATE_DIR/state.md"

# 상태 디렉토리 확인
if [ ! -d "$STATE_DIR" ]; then
    echo "Simple Engineering 상태 디렉토리가 없습니다."
    echo "새 프로젝트입니다. /simple-engineering:research로 시작하세요."
    exit 0
fi

# 상태 파일 확인
if [ ! -f "$STATE_FILE" ]; then
    echo "Simple Engineering 상태 파일이 없습니다."
    echo "/simple-engineering:research로 새 작업을 시작하세요."
    exit 0
fi

# 상태 파일 출력
echo "=== Simple Engineering 상태 복구 ==="
echo ""
cat "$STATE_FILE"
echo ""
echo "=== 상태 로드 완료 ==="
echo ""
echo "이전 작업을 계속하려면 해당 단계의 명령어를 실행하세요:"
echo "- Research 계속: /simple-engineering:research [task]"
echo "- Planning 계속: /simple-engineering:plan [research-file]"
echo "- Implementation 계속: /simple-engineering:implement [spec-file]"
