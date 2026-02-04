# Friday - PR 코드 리뷰 비서

PR의 프론트엔드 영역을 리뷰하고, 피드백을 정리하여 PR 코멘트로 게시하는 플러그인입니다.

## 사용법

### 리뷰 시작

```bash
# 기본 사용 (develop의 가이드 참조)
/friday:review-pr 123

# 다른 브랜치의 가이드 참조
/friday:review-pr 123 --guide-branch main
```

PR 브랜치를 checkout하여 변경된 FE 파일을 리뷰합니다. 리뷰 결과에 대해 피드백을 주고받을 수 있습니다.

`--guide-branch` 옵션으로 frontend-doc을 참조할 브랜치를 지정할 수 있습니다 (기본값: `develop`).

### 리뷰 게시

```
/friday:submit-review
```

리뷰 결과를 PR 코멘트로 게시하고 원래 브랜치로 복귀합니다.

## 컴포넌트

| 컴포넌트 | 설명 |
|----------|------|
| `review-pr` | PR FE 코드 리뷰 커맨드 |
| `submit-review` | 리뷰 결과 PR 코멘트 게시 커맨드 |
| `fe-review` skill | 기본 FE 리뷰 가이드 (fallback) |
| `review-formatter` agent | 리뷰 결과 마크다운 포맷터 |

## 워크플로우

1. `/friday:review-pr 123` 으로 리뷰 시작
2. PR 브랜치 checkout 및 FE 변경 파일 리뷰
3. 사용자와 피드백 주고받기
4. `/friday:submit-review` 로 PR 코멘트 게시
5. 원래 브랜치로 자동 복귀
