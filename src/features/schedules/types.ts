import type { ActivityState } from '@/features/houses/types';

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type RepeatingSchedulePreview = {
  id: string;
  title: string;
  daysOfWeek: readonly Weekday[];
  startTime: string;
  endTime: string;
  weekdayLabel: string;
  timeLabel: string;
  activityState: ActivityState;
  lightOn: boolean;
  isEnabled: boolean;
  priority: number;
};

export type TodayScheduleVisibility = 'house' | 'private';

export type TodaySchedulePreview = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  timeLabel: string;
  visibility: TodayScheduleVisibility;
};
