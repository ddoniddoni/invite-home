import type { RepeatingSchedulePreview } from '../types';
import { findOverlappingRepeatingSchedules } from '../schedule-overlap';

function createSchedule(overrides: Partial<RepeatingSchedulePreview> = {}): RepeatingSchedulePreview {
  return {
    id: 'existing-work',
    title: '업무 시간',
    daysOfWeek: [1],
    startTime: '09:00',
    endTime: '18:00',
    weekdayLabel: '월',
    timeLabel: '09:00–18:00',
    activityState: 'work',
    lightOn: true,
    isEnabled: true,
    priority: 1,
    ...overrides,
  };
}

describe('findOverlappingRepeatingSchedules', () => {
  it('같은 요일의 겹치는 시간 규칙을 찾는다', () => {
    const candidate = createSchedule({ endTime: '13:00', id: 'candidate', startTime: '12:00' });
    const existing = createSchedule();

    expect(findOverlappingRepeatingSchedules(candidate, [existing])).toEqual([existing]);
  });

  it('끝과 시작이 맞닿기만 하면 겹침으로 보지 않는다', () => {
    const candidate = createSchedule({ endTime: '20:00', id: 'candidate', startTime: '18:00' });
    const existing = createSchedule();

    expect(findOverlappingRepeatingSchedules(candidate, [existing])).toEqual([]);
  });

  it('자정을 넘긴 규칙과 다음 요일 새벽 규칙의 겹침을 찾는다', () => {
    const candidate = createSchedule({ endTime: '07:00', id: 'candidate', startTime: '23:00' });
    const existing = createSchedule({ daysOfWeek: [2], endTime: '08:00', startTime: '06:00' });

    expect(findOverlappingRepeatingSchedules(candidate, [existing])).toEqual([existing]);
  });

  it('토요일에서 일요일로 이어지는 겹침과 비활성 규칙을 처리한다', () => {
    const candidate = createSchedule({ daysOfWeek: [0], endTime: '02:00', id: 'candidate', startTime: '01:00' });
    const overnight = createSchedule({ daysOfWeek: [6], endTime: '03:00', startTime: '22:00' });
    const disabled = createSchedule({ id: 'disabled', isEnabled: false });

    expect(findOverlappingRepeatingSchedules(candidate, [overnight, disabled])).toEqual([overnight]);
  });
});
