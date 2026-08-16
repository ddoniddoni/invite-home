import type { ActivityState } from '@/features/houses/types';

export type RepeatingSchedulePreview = {
  id: string;
  title: string;
  weekdayLabel: string;
  timeLabel: string;
  activityState: ActivityState;
  lightOn: boolean;
  isEnabled: boolean;
};

export type TodaySchedulePreview = {
  id: string;
  title: string;
  timeLabel: string;
};
