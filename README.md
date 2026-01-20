# qp-plugin

Claude Code 플러그인 마켓플레이스 저장소입니다.

## 설치

마켓플레이스를 통해 원하는 플러그인을 설치할 수 있습니다.

```bash
# 마켓플레이스 추가
/plugin marketplace add eddy-jeon/qp-plugin

# 개별 플러그인 설치
/plugin add eddy-jeon/qp-plugin:contribution
/plugin add eddy-jeon/qp-plugin:session-learner
/plugin add eddy-jeon/qp-plugin:simple-engineering
/plugin add eddy-jeon/qp-plugin:workday-prep
```

## 플러그인 목록

| 플러그인 | 설명 |
|----------|------|
| [contribution](./plugins/contribution) | Conventional Commit 형식의 한글 커밋과 PR 생성 지원 |
| [session-learner](./plugins/session-learner) | Claude Code 세션에서 학습 내용을 자동으로 추출하여 Git 레포지토리에 저장 |
| [simple-engineering](./plugins/simple-engineering) | AI 협업 시 Simple Engineering 원칙을 적용하는 3단계 워크플로우 (Research → Plan → Implement) |
| [workday-prep](./plugins/workday-prep) | 하루 업무 시작 전 여러 플랫폼(Slack, Google, Jira, GitHub)의 알림 확인 |

## 구조

```
qp-plugin/
├── .claude-plugin/
│   └── marketplace.json
├── plugins/
│   ├── contribution/
│   ├── session-learner/
│   ├── simple-engineering/
│   └── workday-prep/
└── README.md
```

## 라이선스

MIT
