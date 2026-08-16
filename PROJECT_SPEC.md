# 우리집 거주할 사람? — React Native MVP 개발 명세서

- 문서 버전: 0.1
- 기준일: 2026-08-16
- 제품 상태: 아이디어 검증용 MVP
- 대상 플랫폼: iOS / Android
- 패키지 매니저: npm
- 작업명: 우리집 거주할 사람?
- 코드명 및 프로젝트 slug: `our-home`
- 기술 기준: Expo SDK 57, Expo Router, React Native, TypeScript strict, Supabase

> 이 문서는 Codex가 제품 의도, 구현 범위, 데이터 구조, 화면 흐름과 완료 조건을 잃지 않도록 하는 기준 문서다. Codex는 작업 전에 루트의 `AGENTS.md`와 이 문서를 읽고, 한 번에 하나의 단계만 구현한다.

---

## 1. 제품 한 줄 정의

친구들이 하나의 가상 집에 입주하고, 각자의 창문 불빛·색·생활 상태·짧은 메모를 통해 말을 많이 하지 않아도 서로의 하루를 느끼는 소셜 앱.

### 제품의 핵심 차별점

이 앱은 아바타를 움직이며 노는 메타버스가 아니다. 핵심은 다음과 같다.

- 사람을 온라인/오프라인 점으로 보여주지 않고 **창문과 방으로 표현한다.**
- 사용자가 앱을 계속 조작하지 않아도 **예약한 생활 리듬에 따라 전등과 상태가 자동으로 변한다.**
- 채팅 대신 **짧은 메모와 하루 인사**를 남긴다.
- 정확한 위치나 세부 일정을 강요하지 않고, **함께 있는 느낌만 가볍게 공유한다.**

### 제품 원칙

1. 앱을 열었을 때 가장 먼저 보여야 하는 것은 메뉴가 아니라 집이다.
2. 상태는 설명문보다 빛과 창문으로 먼저 전달한다.
3. 채팅 앱이 되지 않는다.
4. 사용자를 감시하는 느낌을 만들지 않는다.
5. 최소한의 조작으로 상태를 바꾸고 메모를 남길 수 있어야 한다.
6. 색만으로 의미를 전달하지 않고 접근성용 텍스트와 아이콘을 함께 제공한다.

---

## 2. 목표와 비목표

### MVP 목표

- 회원가입 후 집을 만들거나 초대 코드로 입주할 수 있다.
- 집주인이 아파트, 빌라, 단독주택 중 하나를 선택할 수 있다.
- 한 집에 최대 8명까지 입주할 수 있다.
- 각 입주민에게 고유한 방 슬롯과 창문이 배정된다.
- 사용자가 자신의 전등, 활동 상태, 감정 색과 짧은 상태 메시지를 변경할 수 있다.
- 취침·업무·집중 등 반복 스케줄에 따라 전등과 상태가 자동으로 계산된다.
- 친구 방에 120자 이하 메모를 남길 수 있다.
- 같은 집 사용자의 변경 사항이 앱을 다시 시작하지 않아도 반영된다.
- 기본 입주는 초대 수락 후 24시간 뒤 가능하다.
- 실제 결제 없이도 핵심 재미를 검증할 수 있다.

### MVP에서 하지 않는 것

- 실시간 채팅
- 음성 및 영상 통화
- 아바타 이동 및 미니게임
- GPS 기반 위치 공유
- 연락처 전체 업로드
- 공개 피드와 팔로우 시스템
- 여러 집 동시 거주
- 실제 인앱 결제
- 정교한 가구 배치와 3D 렌더링
- 관리자용 웹 대시보드
- 외부 캘린더 동기화
- 사진 및 동영상 메모

### MVP 이후 후보

- 검증된 인앱 결제를 통한 즉시 입주권
- 집 테마 및 계절 스킨 판매
- 커스텀 창문과 방 꾸미기
- Apple·Google·Kakao 로그인
- 캘린더 연동
- 홈 화면 위젯
- 사진 메모
- 여러 집 보유 또는 방문
- 반려동물, 날씨, 시간대별 건물 연출

---

## 3. 핵심 용어

| 용어 | 의미 |
|---|---|
| 집 | 친구 그룹 하나를 나타내는 최상위 공간 |
| 집주인 | 집을 만든 사용자. 초대 생성과 집 설정 권한을 가진다. |
| 입주민 | 집에 속한 사용자 |
| 방 슬롯 | 건물 외관에서 입주민에게 배정된 고정 위치 |
| 창문 | 입주민의 상태, 전등, 감정 색, 메모 유무를 표현하는 UI |
| 수동 상태 | 사용자가 지금 직접 지정한 상태 |
| 자동 상태 | 반복 스케줄에 따라 계산되는 상태 |
| 메모 | 특정 입주민에게 보내는 120자 이하 비공개 메시지 |
| 하루 인사 | 메모와 동일한 전달 구조를 쓰되 별도 유형으로 표시하는 짧은 인사 |
| 입주 대기 | 초대 수락 후 실제 집 화면에 들어가기 전 24시간 상태 |

---

## 4. 핵심 사용자 흐름

### 4.1 첫 사용자 — 집 만들기

1. 이메일과 비밀번호로 가입한다.
2. 닉네임을 입력한다.
3. `새 집 만들기`를 선택한다.
4. 아파트, 빌라, 단독주택 중 하나를 선택한다.
5. 집 이름과 수용 인원을 정한다.
6. 집이 생성되고 본인이 집주인 및 1번 방 입주민이 된다.
7. 초대 코드와 공유 링크를 확인한다.
8. 집 메인 화면으로 이동한다.

### 4.2 친구 — 초대받아 입주하기

1. 가입 또는 로그인한다.
2. 초대 링크를 열거나 초대 코드를 입력한다.
3. 집 이름, 집주인, 남은 방 수를 확인한다.
4. `입주 신청`을 누른다.
5. 빈 방 슬롯이 서버에서 원자적으로 배정된다.
6. `입주까지 23:59:59` 카운트다운을 본다.
7. 24시간이 지나면 집 화면에 진입할 수 있다.
8. 본인이 앱을 열면 서버 RPC가 대기 상태를 활성 상태로 정리한다.

### 4.3 내 상태 바꾸기

1. 내 창문 또는 `내 방` 탭을 누른다.
2. 수동 또는 자동 모드를 선택한다.
3. 활동 상태, 전등, 감정 색, 짧은 문구를 지정한다.
4. 저장 직후 같은 집 사용자 화면에 반영된다.
5. 임시 수동 상태에는 종료 시간을 선택할 수 있다.
6. 종료 시간이 지나면 자동 스케줄이 다시 적용된다.

### 4.4 자동 스케줄 만들기

1. `스케줄` 탭에서 새 반복 스케줄을 만든다.
2. 요일, 시작 시간, 종료 시간, 활동 상태, 전등 상태를 선택한다.
3. 예: 월~금 09:00~18:00 `업무 중`, 전등 켜짐.
4. 예: 매일 01:00~08:00 `취침 중`, 전등 꺼짐.
5. 현재 시각과 집 시간대를 기준으로 앱이 유효 상태를 계산한다.
6. 같은 집 사용자는 계산된 상태를 본다.

### 4.5 메모 남기기

1. 집 화면에서 친구 창문을 누른다.
2. 친구의 공개 상태와 오늘 일정 요약을 본다.
3. `메모 남기기`를 누른다.
4. 120자 이하 내용을 작성한다.
5. 전송하면 친구 창문에 작은 봉투 표시가 생긴다.
6. 수신자가 읽으면 `read_at`이 기록된다.
7. 메모는 송신자와 수신자만 읽을 수 있다.

---

## 5. 기능 요구사항

요구사항 ID는 이슈, 커밋, 테스트 이름에 그대로 사용할 수 있다.

### 5.1 인증 및 세션

#### FR-AUTH-001 이메일 회원가입
- 이메일, 비밀번호, 비밀번호 확인 필드를 제공한다.
- 이메일 형식과 비밀번호 최소 길이를 클라이언트에서 검증한다.
- Supabase Auth의 서버 오류를 사용자용 한국어 메시지로 매핑한다.
- 성공 후 프로필 생성 화면으로 이동한다.

#### FR-AUTH-002 로그인
- 이메일과 비밀번호로 로그인한다.
- 세션은 앱 재시작 후에도 유지한다.
- 초기 세션 확인 중에는 잘못된 화면이 잠깐 노출되지 않도록 전용 로딩 화면을 사용한다.

#### FR-AUTH-003 로그아웃
- 설정 화면에서 로그아웃할 수 있다.
- 로그아웃 시 Query Cache와 로컬 UI 상태를 초기화한다.

#### FR-AUTH-004 라우트 가드
라우팅 우선순위는 다음과 같다.

1. 세션 없음 → 인증 화면
2. 세션 있음, 프로필 없음 → 프로필 온보딩
3. 프로필 있음, 집 없음 → 집 선택 화면
4. 대기 중 멤버십 → 입주 대기 화면
5. 활성 멤버십 → 메인 앱

### 5.2 프로필

#### FR-PROFILE-001 프로필 생성
- 닉네임은 2~20자다.
- 앞뒤 공백을 제거한다.
- MVP에서는 닉네임 중복을 허용한다.
- 기본 아바타는 이니셜 또는 단색 원형으로 표시한다.

#### FR-PROFILE-002 프로필 수정
- 닉네임을 수정할 수 있다.
- 같은 집 사용자 화면에 실시간 또는 다음 쿼리 갱신 시 반영한다.

### 5.3 집 생성 및 관리

#### FR-HOUSE-001 집 생성
- 집 유형: `apartment`, `villa`, `detached`.
- 집 이름: 2~30자.
- 수용 인원: 2~8명.
- 생성은 `create_house_with_owner` RPC로 처리한다.
- 집과 집주인 멤버십 생성이 하나의 트랜잭션에서 완료되어야 한다.
- 집주인은 1번 방 슬롯을 받는다.

#### FR-HOUSE-002 집 유형별 기본 슬롯
- 단독주택: 기본 4개.
- 빌라: 기본 6개.
- 아파트: 기본 8개.
- 집 생성 시 사용자는 2~해당 유형 기본 최대값 사이에서 수용 인원을 선택할 수 있다.
- 슬롯 좌표는 데이터베이스가 아니라 클라이언트의 레이아웃 설정 파일에서 관리한다.

#### FR-HOUSE-003 초대 생성
- 집주인만 초대 코드를 만들 수 있다.
- 코드는 혼동 문자를 제외한 8자리 영문 대문자와 숫자로 생성한다.
- 기본 만료 기간은 7일이다.
- 기본 사용 가능 횟수는 남은 방 수다.
- 초대 링크 형식은 앱 scheme를 사용하는 `invite/[code]` 라우트로 연결한다.
- 클라이언트가 임의의 코드를 생성하지 않는다.

#### FR-HOUSE-004 초대 미리보기
- 로그인한 사용자가 코드를 제출하면 집 이름, 집 유형, 집주인 닉네임, 현재 인원, 최대 인원, 만료 여부를 확인할 수 있다.
- 전체 입주민 목록과 개인 상태는 입주 전 공개하지 않는다.

#### FR-HOUSE-005 초대 수락
- `accept_house_invite` RPC 하나로 처리한다.
- RPC는 초대 유효성, 집 정원, 기존 활성 집 여부를 검사한다.
- 빈 방 슬롯을 트랜잭션 안에서 선택해 중복 배정을 막는다.
- 성공 시 상태는 `pending`, 입주 가능 시각은 서버 현재 시각 + 24시간이다.

#### FR-HOUSE-006 입주 대기
- 서버 시각 기준 `move_in_available_at`까지 카운트다운을 표시한다.
- 앱을 재시작해도 남은 시간이 유지된다.
- 시간이 지나면 클라이언트 계산상 집 화면 진입을 허용한다.
- 사용자 진입 시 `activate_my_membership_if_due` RPC를 호출해 상태를 정리한다.

#### FR-HOUSE-007 집 나가기
- 일반 입주민은 집을 나갈 수 있다.
- 나가면 `left_at`이 기록되고 슬롯이 비워진다.
- 집주인은 입주민이 남아 있는 동안 바로 나갈 수 없다.
- 집주인 이전 및 집 삭제는 MVP 이후 기능으로 둔다.

### 5.4 집 외관 및 창문

#### FR-FACADE-001 집 메인
- 앱의 기본 화면은 집 외관이다.
- 집 이름, 현재 시각대에 맞는 배경, 건물, 창문이 한 화면에 보인다.
- 빈 슬롯은 비어 있는 창문으로 표현한다.
- 집주인에게만 빈 창문 위 초대 버튼을 제공한다.

#### FR-FACADE-002 창문 상태
각 창문은 다음 정보를 표현한다.

- 입주민 닉네임
- 전등 켜짐 또는 꺼짐
- 감정 색
- 활동 상태 아이콘
- 읽지 않은 메모 유무
- 본인 창문 여부
- 입주 대기 상태

#### FR-FACADE-003 창문 상호작용
- 본인 창문 탭 → 내 방 편집 화면.
- 다른 입주민 창문 탭 → 입주민 상세 모달.
- 빈 창문 탭 → 집주인은 초대 화면, 일반 입주민은 아무 동작 없음.
- 길게 누르기 같은 숨은 핵심 동작에 의존하지 않는다.

#### FR-FACADE-004 벡터 렌더링
- 건물과 창문은 `react-native-svg` 기반 2D 벡터로 구현한다.
- 집 유형별 공통 `viewBox`를 사용해 다양한 화면 크기에 대응한다.
- 방 슬롯 좌표는 `house-layouts.ts`의 정적 설정으로 관리한다.
- 창문 하나의 상태 변화가 전체 건물 재렌더링을 과도하게 유발하지 않도록 컴포넌트를 분리하고 memoization을 검토한다.

### 5.5 상태 및 감정 색

#### FR-STATUS-001 활동 상태
MVP에서 지원할 상태는 다음과 같다.

- `available`: 대화 가능
- `work`: 업무 중
- `focus`: 집중 중
- `rest`: 쉬는 중
- `sleep`: 취침 중
- `away`: 자리 비움
- `dnd`: 혼자 있고 싶음

#### FR-STATUS-002 전등 모드
- `manual`: 사용자가 직접 켜짐 또는 꺼짐을 지정한다.
- `auto`: 현재 활성 스케줄의 전등 값을 사용한다.
- 수동 상태는 무기한 또는 지정 시각까지 유지할 수 있다.
- 만료된 수동 상태는 화면 계산 시 자동 상태로 취급한다.

#### FR-STATUS-003 감정 색
- 미리 정의된 8개 색상 토큰 중 하나를 선택한다.
- 감정 색은 선택 사항이다.
- 선택적으로 12자 이하 감정 라벨을 입력할 수 있다.
- 외관에서는 색을 우선 보여주되 상세 화면과 접근성 라벨에는 텍스트를 포함한다.
- 색만으로 `위험`, `우울`, `분노` 같은 의미를 강제하지 않는다.

#### FR-STATUS-004 상태 메시지
- 30자 이하.
- 줄바꿈을 허용하지 않는다.
- 부적절한 내용 신고 기능은 MVP 이후지만, 내용 길이 제한과 기본 필터 인터페이스는 분리해 둔다.

#### FR-STATUS-005 실시간 반영
- `member_statuses` 테이블 변경을 구독한다.
- 구독 이벤트 수신 시 전체 앱을 새로고침하지 않고 해당 house query를 갱신하거나 캐시를 부분 업데이트한다.
- 화면 언마운트와 로그아웃 시 채널을 반드시 해제한다.

### 5.6 반복 스케줄과 오늘 일정

#### FR-SCHEDULE-001 반복 스케줄
- 요일 복수 선택.
- 시작 시각, 종료 시각.
- 활동 상태.
- 전등 켜짐 여부.
- 활성화 여부.
- 우선순위.
- 최대 20개까지 생성 가능.

#### FR-SCHEDULE-002 자정 넘김
- `23:00~07:00`처럼 종료 시각이 시작 시각보다 이른 스케줄을 지원한다.
- 새벽 구간은 이전 요일의 스케줄 연장으로 판정한다.
- 이 로직은 단위 테스트로 고정한다.

#### FR-SCHEDULE-003 겹치는 스케줄
- 현재 활성 규칙이 여러 개면 `priority`가 큰 규칙을 사용한다.
- priority가 같으면 최근 수정된 규칙을 사용한다.
- UI에서 기본 priority를 자동 부여하되 고급 숫자 입력은 노출하지 않는다.

#### FR-SCHEDULE-004 집 시간대
- MVP에서는 집 하나가 하나의 IANA 시간대를 가진다.
- 기본값은 `Asia/Seoul`.
- 모든 반복 스케줄은 집 시간대로 해석한다.
- 사용자별 시간대와 해외 이동 대응은 MVP 이후다.

#### FR-SCHEDULE-005 오늘 일정
- 사용자는 제목, 시작 시각, 종료 시각, 공개 범위를 저장할 수 있다.
- 제목은 40자 이하.
- 공개 범위는 `house` 또는 `private`.
- 위치 필드는 MVP에 없다.
- 다른 입주민에게는 `house` 일정만 노출된다.
- 한 사용자당 미래 일정 100개를 넘지 않도록 UI에서 제한한다.

### 5.7 메모

#### FR-NOTE-001 메모 작성
- 같은 활성 집의 입주민에게만 보낼 수 있다.
- 본인에게 보내기는 허용하지 않는다.
- 내용은 1~120자.
- 앞뒤 공백 제거 후 빈 문자열은 거부한다.
- 유형은 `memo` 또는 `greeting`.

#### FR-NOTE-002 메모 읽기
- 송신자와 수신자만 내용을 읽을 수 있다.
- 수신자가 열면 `mark_note_read` RPC로 `read_at`을 기록한다.
- 송신자는 읽음 여부를 확인할 수 있다.
- 다른 집 입주민과 집주인은 열람할 수 없다.

#### FR-NOTE-003 창문 봉투
- 읽지 않은 메모가 하나 이상이면 수신자 본인의 창문에 봉투를 표시한다.
- 다른 사람의 미확인 메모 유무는 공개하지 않는다.
- 즉, `내 창문에 온 봉투`만 본인 화면에서 보이고, 제3자에게는 보이지 않는다.

### 5.8 알림

푸시 알림은 MVP의 stretch goal이다. 핵심 기능이 끝난 뒤 구현한다.

#### FR-NOTIFICATION-001 알림 대상
- 새 메모 도착
- 입주 대기 종료
- 초대 수락
- 집주인에게 정원 가득 참 안내

#### FR-NOTIFICATION-002 권한 요청
- 앱 첫 실행 즉시 요청하지 않는다.
- 사용자가 첫 메모를 보내거나 받은 뒤 맥락이 생긴 시점에 요청한다.
- 거절해도 앱 핵심 기능을 사용할 수 있어야 한다.

#### FR-NOTIFICATION-003 서버 발송
- 클라이언트가 다른 사용자에게 직접 푸시 요청을 보내지 않는다.
- 알림 레코드 생성 → 데이터베이스 webhook 또는 Edge Function → Expo Push Service 순서로 처리한다.
- 서비스 키와 Expo access token은 앱 번들에 넣지 않는다.

---

## 6. 화면 및 라우팅 구조

Expo Router의 `src/app` 파일 기반 라우팅을 사용한다.

```text
src/
  app/
    _layout.tsx
    index.tsx
    invite/
      [code].tsx
    (auth)/
      _layout.tsx
      sign-in.tsx
      sign-up.tsx
    (onboarding)/
      _layout.tsx
      profile.tsx
      house-choice.tsx
      create-house.tsx
      join-house.tsx
      waiting-room.tsx
    (tabs)/
      _layout.tsx
      index.tsx
      notes.tsx
      schedule.tsx
      my-room.tsx
    member/
      [memberId].tsx
    settings/
      index.tsx
      profile.tsx
      house.tsx
```

### 6.1 `src/app/index.tsx`
- 세션, 프로필, 멤버십을 확인하는 진입 라우트.
- 조건에 맞는 그룹으로 `Redirect`.
- 데이터 확인 전에는 Splash/Loading 화면을 유지한다.
- 화면 자체에 비즈니스 UI를 넣지 않는다.

### 6.2 인증 화면
- `sign-in.tsx`: 이메일, 비밀번호, 로그인, 회원가입 이동.
- `sign-up.tsx`: 이메일, 비밀번호, 비밀번호 확인, 약관 안내.
- 키보드가 입력 필드를 가리지 않도록 처리한다.
- 제출 중 중복 탭을 막는다.

### 6.3 온보딩
- `profile.tsx`: 닉네임 생성.
- `house-choice.tsx`: `새 집 만들기`, `초대 코드로 입주`.
- `create-house.tsx`: 유형 카드, 이름, 수용 인원.
- `join-house.tsx`: 코드 입력, 미리보기, 수락.
- `waiting-room.tsx`: 건물 실루엣, 카운트다운, 초대 취소/집 나가기.

### 6.4 탭
탭은 4개로 제한한다.

1. 집
2. 메모
3. 스케줄
4. 내 방

집 화면의 몰입을 해치지 않도록 탭 바는 높이와 대비를 낮추고 라벨을 짧게 사용한다.

### 6.5 집 화면
- 화면 상단: 집 이름, 설정 진입.
- 중앙: `HouseScene`.
- 하단: 현재 내 상태를 한 번에 바꾸는 compact control.
- 서버 오류 시 건물을 가리지 않는 작은 재시도 배너.
- 데이터가 없을 때 fixture를 보여주지 않는다.

### 6.6 입주민 상세 모달
- 닉네임
- 현재 유효 활동 상태
- 감정 색 및 라벨
- 상태 메시지
- 공개된 오늘 일정
- 메모 남기기 버튼
- 정확한 마지막 접속 시각은 표시하지 않는다.

### 6.7 내 방
- 수동/자동 모드 segmented control.
- 활동 상태 선택.
- 전등 토글.
- 감정 색 선택.
- 감정 라벨.
- 상태 메시지.
- 수동 상태 종료 시각.
- 저장 버튼.
- 화면 상단에 내 창문 미리보기.

### 6.8 메모
- 받은 메모 / 보낸 메모 탭.
- 최신순.
- 읽지 않음 강조.
- 빈 상태 문구.
- 삭제는 MVP에서 `나에게만 숨김` 또는 미지원 중 하나로 고정한다. 초기 구현에서는 미지원으로 둔다.

### 6.9 스케줄
- 반복 스케줄 목록.
- 오늘 일정 목록.
- 추가 버튼.
- 활성/비활성 토글.
- 겹치는 시간대가 있어도 저장은 허용하고 우선순위 규칙을 안내한다.

---

## 7. 디자인 시스템

### 7.1 시각 방향
- 따뜻한 저채도 색상.
- 밤에도 눈이 피로하지 않은 배경.
- 3D보다 단순한 2D 그림책 또는 미니어처 건물 느낌.
- 과한 게임 UI, 코인, 레벨, 랭킹을 사용하지 않는다.
- 텍스트보다 창문과 빛이 시선을 먼저 끌어야 한다.

### 7.2 기본 토큰

```ts
export const colors = {
  backgroundDay: '#F6F1E8',
  backgroundNight: '#20283A',
  surface: '#FFFDFC',
  textPrimary: '#2D2A26',
  textSecondary: '#716B63',
  border: '#DDD4C8',
  buildingApartment: '#CDB7A4',
  buildingVilla: '#D8C2AA',
  buildingDetached: '#C8B59E',
  windowOff: '#394052',
  windowOn: '#FFD77A',
  danger: '#C84D4D',
  success: '#3E8A67',
} as const;

export const moodColors = {
  amber: '#F4C766',
  peach: '#F3A982',
  rose: '#E989A5',
  mint: '#88C9AE',
  sky: '#7FB8D8',
  indigo: '#7E86C7',
  violet: '#A888C9',
  gray: '#A8A5A0',
} as const;
```

색상 값은 첫 구현 기준이다. 실제 접근성 검사 결과에 따라 텍스트 대비는 조정할 수 있다.

### 7.3 간격과 모서리

```ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
} as const;
```

### 7.4 상태 아이콘
- available: 작은 말풍선
- work: 서류 가방
- focus: 원형 집중 표시
- rest: 찻잔
- sleep: 달
- away: 발자국 또는 빈 의자
- dnd: 반쯤 닫힌 커튼

아이콘은 텍스트 라벨을 대체하지 않는다.

### 7.5 애니메이션
- 창문 전등 전환: opacity 또는 fill 200~400ms.
- 메모 봉투 등장: 작은 scale + fade.
- 야간 전환: 배경과 건물 톤의 부드러운 crossfade.
- 반복적으로 튀거나 주의를 강제하는 애니메이션 금지.
- 시스템의 reduced motion 설정을 존중한다.

---

## 8. 기술 아키텍처

### 8.1 클라이언트

- React Native + Expo
- Expo Router
- TypeScript `strict: true`
- TanStack Query: 서버 상태, 캐시, mutation
- Zustand: 일시적인 UI 상태만
- React Hook Form + Zod: 폼과 검증
- `react-native-svg`: 건물 및 창문
- Reanimated: 제한적인 상태 전환 애니메이션
- Expo Haptics: 저장, 토글 등의 가벼운 피드백
- Expo Notifications: stretch goal

### 8.2 백엔드

- Supabase Auth
- Supabase Postgres
- Row Level Security
- Supabase Realtime Postgres Changes
- Supabase Storage: MVP에서는 사용하지 않아도 됨
- Supabase Edge Functions: 푸시 알림, 향후 결제 검증
- SQL migrations는 저장소의 `supabase/migrations`에서 관리

### 8.3 상태 관리 원칙

- 서버에서 온 데이터는 Zustand에 복제하지 않는다.
- 세션은 `SessionProvider` 또는 auth hook 한 곳에서 관리한다.
- house snapshot, notes, schedules는 TanStack Query query key로 관리한다.
- modal open 여부, 선택 중인 컬러, 임시 draft처럼 서버와 무관한 값만 Zustand에 둔다.
- optimistic update는 상태 토글과 읽음 처리처럼 롤백이 단순한 경우에만 사용한다.

### 8.4 Realtime 원칙

구독 대상:

- `member_statuses`
- `notes`
- `house_members`
- 필요 시 `profiles`

구독하지 않는 대상:

- 모든 테이블 전체
- 고빈도 애니메이션 값
- 화면 좌표
- 카운트다운 초 단위 값

Realtime 이벤트는 source of truth를 대체하지 않는다. 연결 복구 후 해당 query를 재검증한다.

### 8.5 Presence 사용 여부

Supabase Presence는 선택 기능이다.

- 사용한다면 앱이 foreground이고 집 화면에 들어왔는지 정도만 공유한다.
- 마우스 위치나 초 단위 활동 같은 고빈도 상태에 사용하지 않는다.
- MVP에서는 Presence를 제품 UI에 노출하지 않아도 된다.
- 전등과 생활 상태의 source of truth는 Postgres 데이터와 스케줄 계산이다.

---

## 9. 프로젝트 생성 및 npm 명령

기준 시점의 최신 Expo 기본 템플릿을 사용한다. Expo SDK와 React Native 버전을 따로 억지로 맞추지 말고 템플릿이 생성한 조합을 유지한다.

```bash
npx create-expo-app@latest our-home --template default@sdk-57
cd our-home
npm install
```

### 9.1 핵심 의존성

Expo 또는 네이티브 호환성이 중요한 패키지는 `npm install` 대신 `npx expo install`을 사용한다. 패키지 매니저는 내부적으로 npm을 사용한다.

```bash
npx expo install @supabase/supabase-js react-native-url-polyfill expo-sqlite
npx expo install react-native-svg react-native-reanimated react-native-gesture-handler
npx expo install expo-linear-gradient expo-haptics
```

순수 JavaScript 라이브러리:

```bash
npm install @tanstack/react-query zustand zod react-hook-form @hookform/resolvers
```

Supabase CLI와 테스트 도구:

```bash
npm install --save-dev supabase
npm install --save-dev jest jest-expo @types/jest @testing-library/react-native
```

푸시 알림 구현 단계에서만 추가:

```bash
npx expo install expo-notifications expo-device expo-constants
```

### 9.2 Supabase 초기화

```bash
npx supabase init
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

원격 프로젝트에 migration 적용:

```bash
npx supabase db push
```

타입 생성:

```bash
npx supabase gen types typescript \
  --project-id YOUR_PROJECT_REF \
  --schema public \
  > src/types/database.generated.ts
```

### 9.3 package.json scripts

Codex는 다음 스크립트를 유지한다.

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint",
    "typecheck": "tsc --noEmit",
    "test": "jest --watch",
    "test:ci": "jest --runInBand",
    "check": "npm run lint && npm run typecheck && npm run test:ci"
  }
}
```

### 9.4 환경 변수

`.env.example`:

```dotenv
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
EXPO_PUBLIC_APP_SCHEME=ourhome
```

규칙:

- `.env`는 커밋하지 않는다.
- `SUPABASE_SERVICE_ROLE_KEY`는 모바일 앱 환경 변수에 절대 넣지 않는다.
- `EXPO_PUBLIC_` 값은 앱 번들에서 볼 수 있다고 가정한다.
- 비밀 값은 Supabase Edge Function secret 또는 CI secret에 둔다.

---

## 10. 권장 폴더 구조

```text
our-home/
  AGENTS.md
  PROJECT_SPEC.md
  app.json
  package.json
  tsconfig.json
  .env.example
  src/
    app/
      _layout.tsx
      index.tsx
      invite/
      (auth)/
      (onboarding)/
      (tabs)/
      member/
      settings/
    components/
      ui/
        app-button.tsx
        app-text-field.tsx
        app-card.tsx
        loading-view.tsx
        empty-state.tsx
        error-banner.tsx
      house/
        house-scene.tsx
        house-building.tsx
        window-unit.tsx
        empty-window.tsx
        envelope-badge.tsx
      status/
        status-chip.tsx
        mood-picker.tsx
        light-toggle.tsx
      notes/
        note-card.tsx
        note-composer.tsx
    features/
      auth/
        api.ts
        hooks.ts
        schemas.ts
        types.ts
      profiles/
      houses/
        api.ts
        hooks.ts
        schemas.ts
        types.ts
        config/
          house-layouts.ts
      status/
        api.ts
        hooks.ts
        effective-status.ts
        effective-status.test.ts
        types.ts
      schedules/
        api.ts
        hooks.ts
        schemas.ts
        schedule-matcher.ts
        schedule-matcher.test.ts
      notes/
        api.ts
        hooks.ts
        schemas.ts
      notifications/
    lib/
      supabase.ts
      query-client.ts
      env.ts
      errors.ts
      dates.ts
      logger.ts
    providers/
      app-providers.tsx
      session-provider.tsx
    stores/
      ui-store.ts
    theme/
      tokens.ts
      typography.ts
    types/
      database.generated.ts
      domain.ts
    fixtures/
      house.fixture.ts
  supabase/
    migrations/
      0001_initial_schema.sql
      0002_rls_policies.sql
      0003_house_rpcs.sql
    functions/
      push/
        index.ts
```

### 구조 규칙

- `src/app`에는 route component만 둔다.
- 큰 비즈니스 로직을 route 파일에 작성하지 않는다.
- 기능별 API, hook, schema, type은 `src/features/<feature>`에 둔다.
- 재사용 UI만 `src/components/ui`에 둔다.
- generated DB type은 직접 편집하지 않는다.
- `fixtures`는 개발 시각 검증에만 쓰며 production path에서 자동 fallback하지 않는다.

---

## 11. 도메인 타입

```ts
export type HouseType = 'apartment' | 'villa' | 'detached';

export type MemberRole = 'owner' | 'resident';

export type MembershipStatus = 'pending' | 'active' | 'left';

export type ActivityState =
  | 'available'
  | 'work'
  | 'focus'
  | 'rest'
  | 'sleep'
  | 'away'
  | 'dnd';

export type StatusMode = 'auto' | 'manual';

export type MoodKey =
  | 'amber'
  | 'peach'
  | 'rose'
  | 'mint'
  | 'sky'
  | 'indigo'
  | 'violet'
  | 'gray';

export type NoteType = 'memo' | 'greeting';

export type EventVisibility = 'house' | 'private';
```

클라이언트에서 DB row를 그대로 UI component에 넘기지 않는다. feature mapper에서 domain model로 변환한다.

---

## 12. 데이터베이스 설계

모든 ID는 UUID, 모든 주요 시간은 `timestamptz`를 사용한다. 반복 스케줄의 시각만 `time`을 사용한다.

### 12.1 `profiles`

| 컬럼 | 타입 | 규칙 |
|---|---|---|
| id | uuid PK | `auth.users(id)` 참조 |
| nickname | varchar(20) | not null |
| avatar_url | text | nullable |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### 12.2 `houses`

| 컬럼 | 타입 | 규칙 |
|---|---|---|
| id | uuid PK | default gen_random_uuid() |
| owner_id | uuid FK | profiles.id |
| name | varchar(30) | not null |
| house_type | enum | apartment/villa/detached |
| capacity | smallint | 2~8 |
| timezone | text | default `Asia/Seoul` |
| theme_key | text | default `classic` |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### 12.3 `house_members`

| 컬럼 | 타입 | 규칙 |
|---|---|---|
| id | uuid PK | default gen_random_uuid() |
| house_id | uuid FK | houses.id |
| user_id | uuid FK | profiles.id |
| role | enum | owner/resident |
| room_slot | smallint | 1~8 |
| status | enum | pending/active/left |
| move_in_available_at | timestamptz | nullable for owner |
| joined_at | timestamptz | default now() |
| activated_at | timestamptz | nullable |
| left_at | timestamptz | nullable |

제약:

- 한 집 안에서 `(house_id, user_id)` unique.
- 한 집 안에서 활성/대기 중 `(house_id, room_slot)`이 중복되지 않도록 partial unique index.
- 사용자당 `left_at is null`인 멤버십은 하나만 허용하는 partial unique index.
- owner row의 `status`는 active.

### 12.4 `house_invites`

| 컬럼 | 타입 | 규칙 |
|---|---|---|
| id | uuid PK | |
| house_id | uuid FK | |
| code | varchar(8) | unique |
| created_by | uuid FK | |
| expires_at | timestamptz | |
| max_uses | smallint | |
| use_count | smallint | default 0 |
| is_active | boolean | default true |
| created_at | timestamptz | default now() |

### 12.5 `member_statuses`

입주민당 한 행을 유지한다.

| 컬럼 | 타입 | 규칙 |
|---|---|---|
| member_id | uuid PK/FK | house_members.id |
| house_id | uuid FK | query/filter 편의를 위한 중복 |
| mode | enum | auto/manual |
| activity_state | enum | not null |
| light_on | boolean | not null |
| mood_key | enum | nullable |
| mood_label | varchar(12) | nullable |
| status_message | varchar(30) | nullable |
| manual_until | timestamptz | nullable |
| updated_at | timestamptz | default now() |

### 12.6 `status_schedules`

| 컬럼 | 타입 | 규칙 |
|---|---|---|
| id | uuid PK | |
| member_id | uuid FK | |
| house_id | uuid FK | |
| label | varchar(20) | |
| days_of_week | smallint[] | 각 값 0~6 |
| start_time | time | |
| end_time | time | |
| activity_state | enum | |
| light_on | boolean | |
| priority | smallint | default 0 |
| enabled | boolean | default true |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### 12.7 `schedule_events`

| 컬럼 | 타입 | 규칙 |
|---|---|---|
| id | uuid PK | |
| member_id | uuid FK | |
| house_id | uuid FK | |
| title | varchar(40) | |
| starts_at | timestamptz | |
| ends_at | timestamptz | ends_at > starts_at |
| visibility | enum | house/private |
| affects_status | boolean | default false |
| activity_state | enum | nullable |
| light_on | boolean | nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### 12.8 `notes`

| 컬럼 | 타입 | 규칙 |
|---|---|---|
| id | uuid PK | |
| house_id | uuid FK | |
| sender_id | uuid FK | profiles.id |
| recipient_id | uuid FK | profiles.id |
| note_type | enum | memo/greeting |
| content | varchar(120) | not blank |
| read_at | timestamptz | nullable |
| created_at | timestamptz | default now() |

제약:

- sender_id != recipient_id.
- 송수신자가 작성 시점에 같은 활성 집에 있어야 한다. RLS와 RPC/검증 함수 모두에서 검사한다.

### 12.9 `device_push_tokens`

| 컬럼 | 타입 | 규칙 |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK | |
| expo_push_token | text | unique |
| platform | text | ios/android |
| is_active | boolean | default true |
| updated_at | timestamptz | |

### 12.10 `notifications`

| 컬럼 | 타입 | 규칙 |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK | |
| type | text | |
| title | text | |
| body | text | |
| data | jsonb | default `{}` |
| read_at | timestamptz | nullable |
| created_at | timestamptz | |

---

## 13. RLS 및 보안 정책

새 public table은 RLS를 켜기 전 클라이언트 코드에서 사용하지 않는다.

### 13.1 SQL helper 함수

Codex는 다음 helper를 migration으로 만든다.

- `is_active_house_member(p_house_id uuid)`
- `is_house_owner(p_house_id uuid)`
- `shares_active_house(p_other_user_id uuid)`
- `can_message_user(p_recipient_id uuid)`
- `current_active_membership()`

Security definer 함수는 반드시 다음을 지킨다.

- 고정 `search_path`.
- 최소 권한.
- 입력값 검증.
- 일반 사용자에게 필요한 함수만 execute 권한 부여.
- service role을 클라이언트에 노출하지 않음.

### 13.2 정책 매트릭스

| 테이블 | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| profiles | 본인 + 같은 활성 집 입주민 | auth trigger 또는 본인 | 본인 | 직접 삭제 금지 |
| houses | 활성/대기 멤버 | RPC | 집주인 | MVP 직접 삭제 금지 |
| house_members | 같은 집 멤버 | RPC only | RPC only | 직접 삭제 금지 |
| house_invites | 집주인 | 집주인/RPC | 집주인 | 집주인 |
| member_statuses | 같은 활성 집 | 멤버십 생성 RPC | 본인 행 | 직접 삭제 금지 |
| status_schedules | 같은 활성 집 | 본인 | 본인 | 본인 |
| schedule_events | 본인 전체, 같은 집의 house 공개 | 본인 | 본인 | 본인 |
| notes | sender 또는 recipient | 같은 활성 집 송신자 | 읽음 RPC | 직접 삭제 금지 |
| device_push_tokens | 본인 | 본인 | 본인 | 본인 |
| notifications | 본인 | service/서버 | 본인 read_at | 본인 |

### 13.3 절대 금지

- `service_role` 키를 React Native 코드에 넣기.
- RLS를 끄고 앱 출시하기.
- 초대 수락을 여러 클라이언트 insert로 처리하기.
- 결제 완료 여부를 클라이언트 boolean만 믿기.
- 다른 사용자의 비공개 일정을 nested select 실수로 내려주기.
- 메모를 집주인 권한만으로 열람하게 만들기.

---

## 14. 필수 RPC

### 14.1 `create_house_with_owner`

입력:

```ts
{
  name: string;
  houseType: HouseType;
  capacity: number;
  timezone: string;
}
```

동작:

1. 현재 사용자의 활성 집 여부 확인.
2. 유형별 최대 수용 인원 검증.
3. houses insert.
4. owner house_members insert, room_slot 1, active.
5. member_statuses 기본 행 insert.
6. house id 반환.

### 14.2 `create_house_invite`

입력:

```ts
{ houseId: string }
```

동작:

- 집주인 검증.
- 남은 방 수 확인.
- 8자리 코드 생성.
- 7일 만료 초대 생성.
- code와 expires_at 반환.

### 14.3 `preview_house_invite`

입력: `{ code: string }`

반환:

- 집 이름
- 집 유형
- 집주인 닉네임
- current_count
- capacity
- expires_at
- can_join
- 실패 이유의 안전한 code

개인 상태와 전체 멤버 정보는 반환하지 않는다.

### 14.4 `accept_house_invite`

동작:

1. 인증 확인.
2. 초대 row lock.
3. 만료, 활성, use_count 검사.
4. 기존 집 검사.
5. 집 정원 검사.
6. 빈 room_slot을 lock 범위 안에서 선택.
7. pending house_members insert.
8. member_statuses 기본 행 insert.
9. use_count 증가.
10. membership과 move_in_available_at 반환.

### 14.5 `activate_my_membership_if_due`

- 현재 사용자의 pending 멤버십을 찾는다.
- 서버 시각이 입주 가능 시각 이후면 active와 activated_at을 설정한다.
- 결과 멤버십을 반환한다.
- 아직 시간이 남으면 변경하지 않는다.

### 14.6 `mark_note_read`

- 현재 사용자가 recipient인지 확인.
- 이미 읽었으면 idempotent.
- `read_at = coalesce(read_at, now())`.

---

## 15. 유효 상태 계산

상태는 DB row 하나만 그대로 보여주지 않고 현재 시각에 따라 계산한다.

### 15.1 우선순위

1. 멤버십이 대기/탈퇴 상태면 해당 상태 전용 표현.
2. `member_statuses.mode === manual`이고 `manual_until`이 없거나 미래면 수동 상태.
3. 현재 활성인 `schedule_events` 중 `affects_status=true`인 최신 이벤트.
4. 현재 활성인 반복 `status_schedules` 중 가장 높은 priority.
5. 기본 상태: `away`, 전등 꺼짐.
6. mood와 status_message는 별도로 유지한다.

### 15.2 함수 계약

```ts
type EffectiveStatusInput = {
  now: Date;
  houseTimeZone: string;
  memberStatus: MemberStatus;
  schedules: StatusSchedule[];
  events: ScheduleEvent[];
};

type EffectiveStatus = {
  source: 'manual' | 'event' | 'schedule' | 'default';
  activityState: ActivityState;
  lightOn: boolean;
  moodKey: MoodKey | null;
  moodLabel: string | null;
  statusMessage: string | null;
  validUntil: Date | null;
};

export function resolveEffectiveStatus(
  input: EffectiveStatusInput,
): EffectiveStatus;
```

### 15.3 필수 테스트

- 일반 당일 스케줄 내부/외부.
- `23:00~07:00` 자정 넘김.
- 월요일 23:00 시작 규칙이 화요일 02:00에 활성.
- 선택하지 않은 요일 새벽에는 비활성.
- priority 충돌.
- 수동 상태 무기한.
- 수동 상태 만료.
- event가 반복 스케줄보다 우선.
- disabled 스케줄 무시.
- empty schedules 기본 상태.

### 15.4 시간 처리 원칙

- 서버 저장 시 `timestamptz`.
- 화면 표시와 반복 스케줄 판정은 house timezone.
- 단순 문자열 slicing으로 시간대를 처리하지 않는다.
- 테스트에서 시스템 로컬 시간대에 의존하지 않는다.
- 1초마다 서버 요청하지 않는다.
- 집 화면은 30초 또는 60초 단위 local timer로 유효 상태를 다시 계산하면 충분하다.

---

## 16. 데이터 접근 및 Query Key

권장 query key:

```ts
export const queryKeys = {
  session: ['session'] as const,
  myProfile: ['profiles', 'me'] as const,
  myMembership: ['memberships', 'me'] as const,
  house: (houseId: string) => ['houses', houseId] as const,
  houseSnapshot: (houseId: string) =>
    ['houses', houseId, 'snapshot'] as const,
  notesReceived: (houseId: string) =>
    ['notes', houseId, 'received'] as const,
  notesSent: (houseId: string) =>
    ['notes', houseId, 'sent'] as const,
  schedules: (memberId: string) =>
    ['schedules', memberId] as const,
  events: (memberId: string) =>
    ['events', memberId] as const,
};
```

### House snapshot

집 화면은 가능하면 다음을 한 번에 가져온다.

- house
- active 및 due pending members
- profile nickname
- member_status
- status_schedules
- 공개된 당일 schedule_events
- 현재 사용자에게 온 unread note count

개인 메모 내용은 snapshot에 포함하지 않는다.

---

## 17. Supabase 클라이언트 초기화

`src/lib/supabase.ts`는 다음 원칙을 따른다.

- `react-native-url-polyfill/auto` import.
- `expo-sqlite/localStorage/install`을 사용한 세션 저장.
- `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- `autoRefreshToken: true`.
- `persistSession: true`.
- `detectSessionInUrl: false`.
- 환경 변수가 없으면 개발 단계에서 명확한 에러를 발생시킨다.

환경 변수 검증은 `src/lib/env.ts`에서 Zod로 수행한다.

---

## 18. 컴포넌트 계약

### 18.1 `HouseScene`

```ts
type HouseSceneProps = {
  houseType: HouseType;
  capacity: number;
  members: HouseWindowMember[];
  currentUserId: string;
  isOwner: boolean;
  timeOfDay: 'day' | 'evening' | 'night';
  onPressMember: (memberId: string) => void;
  onPressMyRoom: () => void;
  onPressEmptySlot: (slot: number) => void;
};
```

책임:

- 건물 배경과 slot 배치.
- 상태별 WindowUnit 렌더링.
- 데이터 요청과 mutation은 하지 않는다.

### 18.2 `WindowUnit`

```ts
type WindowUnitProps = {
  slot: number;
  nickname: string;
  isMine: boolean;
  isPending: boolean;
  lightOn: boolean;
  moodKey: MoodKey | null;
  activityState: ActivityState;
  hasUnreadNoteForMe: boolean;
  onPress: () => void;
};
```

### 18.3 `StatusEditor`

- form state는 React Hook Form.
- validation은 Zod.
- mutation 성공 후 house snapshot 갱신.
- 저장 실패 시 기존 서버 상태를 잃지 않는다.

### 18.4 `NoteComposer`

- recipient 정보 표시.
- 글자 수 `현재/120`.
- 공백만 있는 제출 금지.
- 제출 중 닫기 방지 또는 명확한 경고.
- 성공 후 modal close와 notes query 갱신.

---

## 19. 오류, 로딩, 빈 상태

### 로딩
- 초기 세션: 전체 화면 로딩.
- 집 snapshot: 건물 skeleton 또는 단순 실루엣.
- mutation: 해당 버튼 로딩.
- 전체 화면 blocking spinner 남용 금지.

### 오류
- 네트워크 오류: `연결이 불안정해요. 다시 시도해 주세요.`
- 인증 오류: 내부 Supabase 문구를 그대로 노출하지 않는다.
- 초대 만료: `이 초대는 만료되었어요. 집주인에게 새 초대를 받아 주세요.`
- 정원 초과: `빈 방이 없어요.`
- 중복 집: `이미 거주 중인 집이 있어요.`
- 권한 오류: 일반 에러와 구분해 로그에 남긴다.

### 빈 상태
- 받은 메모 없음: `아직 도착한 메모가 없어요.`
- 일정 없음: `오늘은 공유된 일정이 없어요.`
- 빈 방: 집주인에게 `친구 초대하기`, 일반 입주민에게 조용한 빈 창문.

---

## 20. 접근성, 개인정보, 안전

### 접근성
- 모든 Pressable은 최소 터치 영역을 확보한다.
- WindowUnit에 접근성 label과 role을 제공한다.
- 예: `민수의 방, 업무 중, 전등 켜짐`.
- 색만으로 상태를 구분하지 않는다.
- Dynamic Type 증가 시 중요한 텍스트가 잘리지 않게 한다.
- reduced motion을 존중한다.
- 명암 대비를 실제 기기에서 검사한다.

### 개인정보
- 위치 데이터를 수집하지 않는다.
- 오늘 일정 기본 공개 범위는 private.
- 메모는 sender/recipient 외 접근 불가.
- 정확한 마지막 접속 시각을 공개하지 않는다.
- 탈퇴 또는 집 나가기 후 다른 멤버가 이전 상태를 계속 볼 수 없게 한다.
- 로그에 메모 본문, 비밀번호, 토큰을 남기지 않는다.

### 신고/차단
MVP에서는 공개 커뮤니티가 없으므로 후순위다. 다만 제품 확장 전에 다음이 필요하다.

- 메모 차단
- 사용자 신고
- 집 강퇴
- 악성 초대 방지
- 초대 코드 rate limit

---

## 21. 테스트 전략

### 21.1 단위 테스트
필수:

- `resolveEffectiveStatus`
- 자정 넘김 schedule matcher
- Zod schema
- house layout slot 수 검증
- error mapper
- invite code normalize
- note length and trim

### 21.2 컴포넌트 테스트
필수:

- WindowUnit 상태별 접근성 label.
- NoteComposer 빈 값 거부.
- StatusEditor manual/auto 전환.
- WaitingRoom countdown가 음수가 되지 않음.
- 인증 폼 제출 중 중복 탭 방지.

### 21.3 통합 테스트
가능하면 Supabase local 또는 test project에서 다음을 검증한다.

- 집 생성 시 owner와 status row가 함께 생성.
- 두 사용자가 같은 마지막 slot을 동시에 수락할 때 하나만 성공.
- 다른 집 사용자가 status select 불가.
- 집주인도 타인 메모 본문 select 불가.
- private event가 housemate에게 보이지 않음.
- due membership activation idempotent.

### 21.4 수동 QA
- 작은 Android 화면.
- iPhone 계열.
- 키보드 노출.
- 앱 background → foreground.
- 네트워크 끊김과 재연결.
- 날짜 변경 직전/직후.
- 23:00~07:00 스케줄.
- 초대 링크 cold start.
- 로그아웃 후 다른 계정 로그인.
- 다크한 야간 배경에서 텍스트 대비.

---

## 22. 구현 단계

Codex는 아래 순서를 건너뛰지 않는다.

### Phase 0 — 프로젝트 기반
완료 항목:

- Expo SDK 57 default template 생성.
- npm lockfile.
- TypeScript strict.
- alias `@/* -> ./src/*`.
- 폴더 구조.
- theme token.
- QueryClient 및 Provider.
- `.env.example`.
- lint/typecheck/test scripts.
- 기본 테스트 1개.
- `npm run check` 통과.

완료 기준:

- iOS/Android 또는 Expo Go에서 기본 화면 실행.
- console error 없음.
- yarn.lock, pnpm-lock.yaml 없음.

### Phase 1 — 로컬 fixture 기반 UI
완료 항목:

- 세 가지 HouseScene.
- WindowUnit.
- 집 메인 화면.
- 내 방 상태 편집 UI.
- 입주민 상세 modal.
- 메모 작성 modal.
- waiting room.
- fixture 데이터로 상태 변화 확인.

제한:

- Supabase 연결 전.
- 실제 auth 없음.
- production 코드에서 fixture 자동 fallback 금지.

완료 기준:

- 4명 fixture로 주요 화면을 이동 가능.
- 집 유형을 바꾸면 slot layout 변경.
- light/mood/status 조합이 시각적으로 구분.
- 접근성 label 존재.

### Phase 2 — Supabase 및 인증
완료 항목:

- Supabase client.
- migrations 0001~0003.
- RLS.
- email signup/signin.
- profile create/update.
- route guard.
- generated DB types.

완료 기준:

- 새 계정 가입 후 프로필 생성.
- 앱 재시작 후 세션 유지.
- RLS 통합 테스트 핵심 항목 통과.

### Phase 3 — 집과 초대
완료 항목:

- create house RPC.
- invite create/preview/accept RPC.
- deep link route.
- waiting room.
- due activation.
- leave house.

완료 기준:

- 계정 A가 집 생성.
- 계정 B가 코드 수락.
- B는 대기 화면.
- due 시 집 화면.
- room slot 중복 없음.

### Phase 4 — 상태와 Realtime
완료 항목:

- member status query/mutation.
- effective status resolver.
- schedule matcher unit test.
- status realtime subscription.
- optimistic update 또는 빠른 refetch.

완료 기준:

- 기기 A에서 상태 변경 시 기기 B에 반영.
- manual_until 만료 후 자동 상태 표시.
- 구독 누수 없음.

### Phase 5 — 스케줄
완료 항목:

- 반복 스케줄 CRUD.
- 오늘 일정 CRUD.
- 공개 범위.
- 겹침 우선순위.
- 집 시간대 처리.

완료 기준:

- 업무/취침 예제가 정상 동작.
- private 일정은 타인에게 보이지 않음.
- 자정 넘김 테스트 통과.

### Phase 6 — 메모
완료 항목:

- 메모 작성/목록/읽음.
- RLS.
- 내 창문 unread 봉투.
- realtime notes.

완료 기준:

- sender/recipient만 본문 조회.
- 읽음 처리 idempotent.
- 제3자는 unread 유무도 볼 수 없음.

### Phase 7 — 알림 및 마감
완료 항목:

- 알림 permission UX.
- push token 저장.
- Edge Function.
- note push.
- 오류 상태와 analytics interface.
- 접근성, 성능, QA.
- EAS development build.

완료 기준:

- 실제 기기에서 push 확인.
- `npm run check` 통과.
- 주요 흐름 수동 QA 기록.
- README 실행 방법 최신화.

---

## 23. Definition of Done

기능 하나가 완료되었다고 말하려면 모두 충족해야 한다.

- 요구사항 ID와 연결되어 있다.
- 정상 흐름뿐 아니라 loading/error/empty 상태가 있다.
- TypeScript error가 없다.
- `any`를 새로 도입하지 않았다.
- 권한이 필요한 데이터는 RLS 또는 RPC로 보호된다.
- 필요한 단위 또는 컴포넌트 테스트가 있다.
- Realtime subscription cleanup이 있다.
- 접근성 label이 있다.
- 한국어 UI 문구가 어색하지 않다.
- `npm run check`가 통과한다.
- 변경된 동작을 문서에 반영했다.
- 범위를 벗어난 리팩터링을 섞지 않았다.

---

## 24. Codex 작업 운영 규칙

1. 작업 시작 시 `AGENTS.md`와 이 문서에서 현재 Phase를 읽는다.
2. 구현 전 관련 파일을 먼저 조사한다.
3. 한 요청에서 하나의 Phase 전체보다 작은 단위로 작업한다.
4. 변경 전에 짧은 계획과 영향 파일을 제시한다.
5. 패키지를 추가하기 전 기존 의존성으로 해결 가능한지 확인한다.
6. Expo/native 패키지는 `npx expo install`.
7. 순수 JS 패키지는 `npm install`.
8. yarn과 pnpm을 사용하지 않는다.
9. migration은 적용된 파일을 수정하지 않고 새 파일을 추가한다.
10. UI 먼저, 데이터 연결 다음 순서를 지킨다.
11. 임시 mock은 `fixtures` 아래에만 둔다.
12. 테스트를 실행하고 실패 원인을 숨기지 않는다.
13. 작업 종료 시 변경 파일, 실행한 명령, 테스트 결과, 남은 위험을 요약한다.
14. 사용자가 요구하지 않은 결제·채팅·3D·GPS를 추가하지 않는다.

---

## 25. 첫 번째 Codex 프롬프트

아래 프롬프트를 저장소 루트에서 Codex에 입력한다.

```text
루트의 AGENTS.md와 PROJECT_SPEC.md를 전부 읽어라.

이번 작업에서는 PROJECT_SPEC.md의 Phase 0만 구현하라. Phase 1 이후 기능은 만들지 마라.

조건:
- React Native는 Expo SDK 57 기본 템플릿과 Expo Router를 사용한다.
- 패키지 매니저는 npm만 사용한다.
- TypeScript strict를 유지한다.
- src/app에는 route component만 둔다.
- @/* alias를 ./src/*에 연결한다.
- TanStack Query Provider, theme tokens, 환경 변수 검증 뼈대, 권장 폴더 구조를 만든다.
- .env.example을 만들고 실제 비밀 값은 넣지 않는다.
- package.json에 lint, typecheck, test:ci, check 스크립트를 추가한다.
- 최소 1개의 의미 있는 테스트를 만든다.
- 기존 Expo 템플릿과 충돌하는 불필요한 코드는 제거한다.
- yarn 또는 pnpm 파일을 만들지 않는다.
- 완료 전에 npm run check를 실행한다.

먼저 현재 저장소를 조사하고, 수정할 파일과 구현 순서를 짧게 제시한 뒤 작업하라.
완료 후에는 변경 파일, 실행한 명령, 테스트 결과, 다음 Phase에서 해야 할 일만 요약하라.
```

### Phase 1용 후속 프롬프트

```text
AGENTS.md와 PROJECT_SPEC.md를 다시 읽어라.
이번 작업은 Phase 1 중 HouseScene, house-layouts, WindowUnit, fixture 데이터까지만 구현하라.
아직 Supabase, 인증, 네트워크 코드는 추가하지 마라.
apartment 8칸, villa 6칸, detached 4칸을 react-native-svg로 표현하고,
lightOn, moodKey, activityState, pending, empty 상태를 모두 시각화하라.
접근성 label과 기본 컴포넌트 테스트를 포함하고 npm run check를 통과시켜라.
```

---

## 26. 출시 전 의사결정이 필요한 항목

구현 중 임의로 확정하지 말고 제품 결정으로 남긴다.

- 최종 앱 이름과 bundle identifier
- 집 유형별 정확한 최대 인원
- 입주 24시간 대기의 실제 유지 여부
- 즉시 입주권 가격과 결제 제공 시점
- 감정 색의 이름 및 공개 방식
- 집 나가기 후 메모 보존 정책
- 집주인 이전 기능
- 초대 코드 공유 문구
- 신고 및 차단 정책
- 개인정보처리방침과 이용약관
- 푸시 알림 기본 설정
- 국내 우선 출시인지 글로벌 동시 출시인지

---

## 27. 현재 권장 제품 판단

MVP에서 가장 먼저 검증할 것은 `사람들이 가상 집을 꾸미고 싶은가`가 아니다. 다음 세 가지다.

1. 친구의 창문 상태를 보기 위해 앱을 다시 여는가.
2. 채팅 대신 짧은 메모를 남기는가.
3. 스케줄 기반 자동 전등이 실제로 함께 사는 느낌을 만드는가.

따라서 첫 빌드는 꾸미기 기능보다 집 외관, 전등 변화, 메모 전달, 자동 스케줄의 완성도를 우선한다.
