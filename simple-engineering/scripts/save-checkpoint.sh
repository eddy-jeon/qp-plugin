#!/bin/bash

# Simple Engineering - Checkpoint Saver
# 컨텍스트 압축/저장 전 체크포인트를 생성합니다.

STATE_DIR=".claude/simple-engineering"
CHECKPOINT_DIR="$STATE_DIR/checkpoints"
EVENT_TYPE="${1:-manual}"

# 타임스탬프 생성
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# 디렉토리 생성
mkdir -p "$CHECKPOINT_DIR"

# 체크포인트 파일 생성
CHECKPOINT_FILE="$CHECKPOINT_DIR/checkpoint-$TIMESTAMP.md"

cat > "$CHECKPOINT_FILE" << EOF
# Checkpoint: $TIMESTAMP

**Event**: $EVENT_TYPE
**Created**: $(date)

## Context Summary

이 체크포인트는 $EVENT_TYPE 이벤트로 인해 자동 생성되었습니다.

### Active Work
[현재 진행 중인 작업 요약]

### Pending Items
[보류 중인 항목]

### Notes
[다음 세션을 위한 메모]

---
*자동 생성된 체크포인트입니다. 필요 시 내용을 업데이트하세요.*
EOF

echo "체크포인트 저장됨: $CHECKPOINT_FILE"

# 상태 파일 업데이트
STATE_FILE="$STATE_DIR/state.md"

if [ -f "$STATE_FILE" ]; then
    # 마지막 체크포인트 정보 추가
    echo "" >> "$STATE_FILE"
    echo "## Last Checkpoint" >> "$STATE_FILE"
    echo "- File: $CHECKPOINT_FILE" >> "$STATE_FILE"
    echo "- Time: $(date)" >> "$STATE_FILE"
    echo "- Event: $EVENT_TYPE" >> "$STATE_FILE"
fi
