import type { RepeatingSchedulePreview, TodaySchedulePreview } from '@/features/schedules/types';

export const fixtureRepeatingSchedules: readonly RepeatingSchedulePreview[] = [
  {
    id: 'fixture-repeat-work',
    title: '업무 시간',
    weekdayLabel: '월–금',
    timeLabel: '09:00–18:00',
    activityState: 'work',
    lightOn: true,
    isEnabled: true,
  },
  {
    id: 'fixture-repeat-sleep',
    title: '취침 시간',
    weekdayLabel: '매일',
    timeLabel: '01:00–08:00',
    activityState: 'sleep',
    lightOn: false,
    isEnabled: true,
  },
];

export const fixtureTodaySchedules: readonly TodaySchedulePreview[] = [
  {
    id: 'fixture-today-walk',
    title: '저녁 산책',
    timeLabel: '20:30–21:10',
  },
];
