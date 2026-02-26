---
name: friday:review
description: PR의 FE 영역을 리뷰합니다. /friday:review-pr 커맨드를 호출합니다.
when_to_use: |
  - "PR 리뷰해줘", "PR 123 리뷰해줘"
  - "friday review로 리뷰해줘"
  - "FE 코드 리뷰해줘"
  - PR 번호나 URL이 포함된 리뷰 요청
---

# PR FE 코드 리뷰

이 스킬은 `/friday:review-pr` 커맨드를 호출하여 PR 리뷰를 수행합니다.

## 사용법

1. 사용자로부터 **PR 번호 또는 URL**을 확인합니다
2. `Skill` 도구를 사용하여 `friday:review-pr` 커맨드를 호출합니다

```
Skill: friday:review-pr
Args: {PR 번호} [--guide-branch {브랜치}]
```

## 예시

| 사용자 요청                                       | 호출                                       |
| ------------------------------------------------- | ------------------------------------------ |
| "PR 123 리뷰해줘"                                 | `friday:review-pr 123`                     |
| "이 PR 리뷰해줘: https://github.com/.../pull/456" | `friday:review-pr 456`                     |
| "main 브랜치 가이드로 PR 789 리뷰해줘"            | `friday:review-pr 789 --guide-branch main` |

## 주의

- PR 번호가 명시되지 않으면 사용자에게 물어보세요
- guide-branch가 명시되지 않으면 기본값 `develop` 사용
