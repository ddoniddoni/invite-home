import type { MemberStatus, ScheduleEvent, StatusSchedule } from '../effective-status';
import { isScheduleActiveAt, resolveEffectiveStatus } from '../effective-status';

const houseTimeZone = 'Asia/Seoul';
const at = (value: string) => new Date(value);

const memberStatus: MemberStatus = {
  membershipStatus: 'active',
  mode: 'auto',
  activityState: 'available',
  lightOn: true,
  moodKey: 'mint',
  moodLabel: '차분함',
  statusMessage: '답장이 조금 늦을 수 있어요.',
  manualUntil: null,
};

function createSchedule(overrides: Partial<StatusSchedule> = {}): StatusSchedule {
  return {
    id: 'schedule-work',
    daysOfWeek: [1],
    startTime: '09:00',
    endTime: '18:00',
    activityState: 'work',
    lightOn: true,
    priority: 1,
    enabled: true,
    updatedAt: at('2025-03-01T00:00:00.000Z'),
    ...overrides,
  };
}

function createEvent(overrides: Partial<ScheduleEvent> = {}): ScheduleEvent {
  return {
    id: 'event-focus',
    startsAt: at('2025-03-03T00:30:00.000Z'),
    endsAt: at('2025-03-03T02:30:00.000Z'),
    affectsStatus: true,
    activityState: 'focus',
    lightOn: true,
    updatedAt: at('2025-03-02T00:00:00.000Z'),
    ...overrides,
  };
}

function resolve(overrides: Partial<Parameters<typeof resolveEffectiveStatus>[0]> = {}) {
  return resolveEffectiveStatus({
    now: at('2025-03-03T01:00:00.000Z'),
    houseTimeZone,
    memberStatus,
    schedules: [],
    events: [],
    ...overrides,
  });
}

describe('isScheduleActiveAt', () => {
  it('같은 날 스케줄 안과 밖을 집 시간대로 판정한다', () => {
    const schedule = createSchedule();

    expect(isScheduleActiveAt(schedule, at('2025-03-03T01:00:00.000Z'), houseTimeZone)).toBe(true);
    expect(isScheduleActiveAt(schedule, at('2025-03-03T10:00:00.000Z'), houseTimeZone)).toBe(false);
  });

  it('자정을 넘기는 스케줄을 시작 요일과 다음 새벽에 이어서 판정한다', () => {
    const schedule = createSchedule({ daysOfWeek: [1], startTime: '23:00', endTime: '07:00' });

    expect(isScheduleActiveAt(schedule, at('2025-03-03T14:00:00.000Z'), houseTimeZone)).toBe(true);
    expect(isScheduleActiveAt(schedule, at('2025-03-03T17:00:00.000Z'), houseTimeZone)).toBe(true);
  });

  it('선택하지 않은 요일의 새벽에는 자정 넘김 스케줄을 적용하지 않는다', () => {
    const schedule = createSchedule({ daysOfWeek: [1], startTime: '23:00', endTime: '07:00' });

    expect(isScheduleActiveAt(schedule, at('2025-03-04T17:00:00.000Z'), houseTimeZone)).toBe(false);
  });
});

describe('resolveEffectiveStatus', () => {
  it('빈 자동 상태에서는 기본 표시와 별도 감정·메시지를 반환한다', () => {
    expect(resolve()).toEqual({
      source: 'default',
      activityState: 'away',
      lightOn: false,
      moodKey: 'mint',
      moodLabel: '차분함',
      statusMessage: '답장이 조금 늦을 수 있어요.',
      validUntil: null,
    });
  });

  it('같은 시간대에서는 priority가 높고, 같으면 더 최근에 수정된 스케줄을 선택한다', () => {
    const lowerPriority = createSchedule({ id: 'lower', activityState: 'work', priority: 1 });
    const higherPriority = createSchedule({ id: 'higher', activityState: 'rest', lightOn: false, priority: 2 });
    const newerTie = createSchedule({
      id: 'newer-tie',
      activityState: 'focus',
      priority: 2,
      updatedAt: at('2025-03-02T00:00:00.000Z'),
    });

    expect(resolve({ schedules: [lowerPriority, higherPriority, newerTie] })).toMatchObject({
      source: 'schedule',
      activityState: 'focus',
      lightOn: true,
    });
  });

  it('수동 상태는 종료 시각 전까지 스케줄보다 우선하고, 만료되면 자동으로 돌아간다', () => {
    const schedule = createSchedule();
    const manualUntil = at('2025-03-03T02:00:00.000Z');

    expect(resolve({ memberStatus: { ...memberStatus, mode: 'manual', activityState: 'dnd', manualUntil }, schedules: [schedule] })).toMatchObject({
      source: 'manual',
      activityState: 'dnd',
      validUntil: manualUntil,
    });
    expect(resolve({ memberStatus: { ...memberStatus, mode: 'manual', manualUntil: at('2025-03-03T00:00:00.000Z') }, schedules: [schedule] })).toMatchObject({
      source: 'schedule',
      activityState: 'work',
    });
  });

  it('종료 시각이 없는 수동 상태는 계속 유지한다', () => {
    expect(resolve({ memberStatus: { ...memberStatus, mode: 'manual', activityState: 'rest' } })).toMatchObject({
      source: 'manual',
      activityState: 'rest',
      validUntil: null,
    });
  });

  it('상태에 영향을 주는 현재 이벤트 중 최신 항목은 반복 스케줄보다 우선한다', () => {
    const earlierEvent = createEvent();
    const latestEvent = createEvent({
      id: 'event-rest',
      activityState: 'rest',
      lightOn: false,
      updatedAt: at('2025-03-03T00:00:00.000Z'),
    });

    expect(resolve({ schedules: [createSchedule()], events: [earlierEvent, latestEvent] })).toMatchObject({
      source: 'event',
      activityState: 'rest',
      lightOn: false,
      validUntil: at('2025-03-03T02:30:00.000Z'),
    });
  });

  it('비활성 스케줄과 활성 집이 아닌 멤버의 자동 상태는 적용하지 않는다', () => {
    expect(resolve({ schedules: [createSchedule({ enabled: false })] })).toMatchObject({ source: 'default' });
    expect(resolve({ memberStatus: { ...memberStatus, membershipStatus: 'pending' }, schedules: [createSchedule()] })).toMatchObject({ source: 'default' });
  });
});
