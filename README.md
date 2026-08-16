# 우리집 거주할 사람?

친구들의 생활 리듬을 창문과 빛으로 표현하는 Expo Router 기반 React Native 앱입니다.
현재 저장소에는 `PROJECT_SPEC.md`의 Phase 0 프로젝트 기반만 구현되어 있습니다.

## 시작하기

```bash
npm install
cp .env.example .env
npm start
```

`.env`에는 로컬 개발 값을 넣고 커밋하지 않습니다. `EXPO_PUBLIC_*` 값은 앱 번들에서
공개된다고 가정해야 합니다.

## 검사

```bash
npm run lint
npm run typecheck
npm run test:ci
npm run check
```

기능 범위와 단계별 요구사항은 `PROJECT_SPEC.md`, 작업 규칙은 `AGENTS.md`를 참고하세요.
