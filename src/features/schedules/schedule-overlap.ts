import type { RepeatingSchedulePreview } from './types';

type RepeatingScheduleTiming = Pick<
  RepeatingSchedulePreview,
  'daysOfWeek' | 'endTime' | 'isEnabled' | 'startTime'
>;

type TimeInterval = {
  end: number;
  start: number;
};

const minutesPerDay = 24 * 60;
const minutesPerWeek = 7 * minutesPerDay;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

function toMinuteOfDay(time: string): number | null {
  if (!timePattern.test(time)) {
    return null;
  }

  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

function toIntervals(schedule: RepeatingScheduleTiming): readonly TimeInterval[] {
  const startMinute = toMinuteOfDay(schedule.startTime);
  const endMinute = toMinuteOfDay(schedule.endTime);

  if (!schedule.isEnabled || startMinute === null || endMinute === null || startMinute === endMinute) {
    return [];
  }

  return [...new Set(schedule.daysOfWeek)].map((weekday) => {
    const start = weekday * minutesPerDay + startMinute;
    const end = weekday * minutesPerDay + endMinute + (endMinute < startMinute ? minutesPerDay : 0);

    return { end, start };
  });
}

function intervalsOverlap(left: TimeInterval, right: TimeInterval): boolean {
  return [-minutesPerWeek, 0, minutesPerWeek].some((weekOffset) => {
    const shiftedRightStart = right.start + weekOffset;
    const shiftedRightEnd = right.end + weekOffset;

    return left.start < shiftedRightEnd && shiftedRightStart < left.end;
  });
}

function schedulesOverlap(left: RepeatingScheduleTiming, right: RepeatingScheduleTiming): boolean {
  const leftIntervals = toIntervals(left);
  const rightIntervals = toIntervals(right);

  return leftIntervals.some((leftInterval) =>
    rightIntervals.some((rightInterval) => intervalsOverlap(leftInterval, rightInterval)),
  );
}

export function findOverlappingRepeatingSchedules(
  candidate: RepeatingScheduleTiming,
  schedules: readonly RepeatingSchedulePreview[],
): readonly RepeatingSchedulePreview[] {
  return schedules.filter((schedule) => schedulesOverlap(candidate, schedule));
}

export type { RepeatingScheduleTiming };
