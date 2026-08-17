import type { StatusSchedule } from '@/features/status/effective-status';

import type { RepeatingSchedulePreview } from './types';

export function toStatusSchedules(
  schedules: readonly RepeatingSchedulePreview[],
): readonly StatusSchedule[] {
  return schedules.map((schedule, index) => ({
    id: schedule.id,
    daysOfWeek: schedule.daysOfWeek,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    activityState: schedule.activityState,
    lightOn: schedule.lightOn,
    priority: schedule.priority,
    enabled: schedule.isEnabled,
    updatedAt: new Date(Date.UTC(2025, 0, index + 1)),
  }));
}
