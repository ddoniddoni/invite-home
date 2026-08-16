import type { RepeatingSchedulePreview, TodaySchedulePreview } from '@/features/schedules/types';

export const fixtureRepeatingSchedules: readonly RepeatingSchedulePreview[] = [
  {
    id: 'fixture-repeat-work',
    title: '업무 시간',
    daysOfWeek: [1, 2, 3, 4, 5],
    startTime: '09:00',
    endTime: '18:00',
    weekdayLabel: '월–금',
    timeLabel: '09:00–18:00',
    activityState: 'work',
    lightOn: true,
    isEnabled: true,
    priority: 1,
  },
  {
    id: 'fixture-repeat-sleep',
    title: '취침 시간',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    startTime: '01:00',
    endTime: '08:00',
    weekdayLabel: '매일',
    timeLabel: '01:00–08:00',
    activityState: 'sleep',
    lightOn: false,
    isEnabled: true,
    priority: 2,
  },
];

export const fixtureTodaySchedules: readonly TodaySchedulePreview[] = [
  {
    id: 'fixture-today-walk',
    title: '저녁 산책',
    timeLabel: '20:30–21:10',
  },
];
