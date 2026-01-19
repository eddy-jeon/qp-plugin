#!/bin/bash
# GitHub 정보 수집 스크립트
# 사용법: ./github-check.sh [review-requests|my-prs|notifications|all]

set -e

# gh CLI 설치 확인
if ! command -v gh &> /dev/null; then
    echo "ERROR: gh CLI가 설치되어 있지 않습니다."
    echo "설치: brew install gh"
    exit 1
fi

# 인증 상태 확인
if ! gh auth status &> /dev/null; then
    echo "ERROR: gh CLI 인증이 필요합니다."
    echo "실행: gh auth login"
    exit 1
fi

ACTION=${1:-all}

# 리뷰 요청된 PR 조회
get_review_requests() {
    echo "=== 리뷰 요청된 PR ==="
    gh search prs --review-requested=@me --state=open --json number,title,repository,author,createdAt,url --limit 20 2>/dev/null || echo "[]"
}

# 내가 생성한 PR 조회
get_my_prs() {
    echo "=== 내 PR ==="
    gh search prs --author=@me --state=open --json number,title,repository,state,createdAt,url,reviewDecision --limit 20 2>/dev/null || echo "[]"
}

# 알림 조회 (멘션 포함)
get_notifications() {
    echo "=== GitHub 알림 ==="
    gh api notifications --jq '.[] | {id: .id, reason: .reason, title: .subject.title, type: .subject.type, url: .subject.url, updated_at: .updated_at}' 2>/dev/null || echo "[]"
}

case "$ACTION" in
    review-requests)
        get_review_requests
        ;;
    my-prs)
        get_my_prs
        ;;
    notifications)
        get_notifications
        ;;
    all)
        get_review_requests
        echo ""
        get_my_prs
        echo ""
        get_notifications
        ;;
    *)
        echo "사용법: $0 [review-requests|my-prs|notifications|all]"
        exit 1
        ;;
esac
