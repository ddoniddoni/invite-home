import { fixtureRepeatingSchedules } from '@/fixtures/schedules.fixture';

import { toStatusSchedules } from '../status-schedules';

describe('toStatusSchedules', () => {
  it('반복 일정의 상태 판정에 필요한 필드만 변환한다', () => {
    const [schedule] = toStatusSchedules(fixtureRepeatingSchedules);

    expect(schedule).toMatchObject({
      id: 'fixture-repeat-work',
      daysOfWeek: [1, 2, 3, 4, 5],
      startTime: '09:00',
      endTime: '18:00',
      activityState: 'work',
      lightOn: true,
      priority: 1,
      enabled: true,
    });
    expect(schedule?.updatedAt).toEqual(new Date(Date.UTC(2025, 0, 1)));
  });
});
