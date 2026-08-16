import type { ActivityState, MembershipStatus, MoodKey } from '@/features/houses/types';
import type { Weekday } from '@/features/schedules/types';

export type MemberStatus = {
  membershipStatus: MembershipStatus;
  mode: 'auto' | 'manual';
  activityState: ActivityState;
  lightOn: boolean;
  moodKey: MoodKey | null;
  moodLabel: string | null;
  statusMessage: string | null;
  manualUntil: Date | null;
};

export type StatusSchedule = {
  id: string;
  daysOfWeek: readonly Weekday[];
  startTime: string;
  endTime: string;
  activityState: ActivityState;
  lightOn: boolean;
  priority: number;
  enabled: boolean;
  updatedAt: Date;
};

export type ScheduleEvent = {
  id: string;
  startsAt: Date;
  endsAt: Date;
  affectsStatus: boolean;
  activityState: ActivityState | null;
  lightOn: boolean | null;
  updatedAt: Date;
};

export type EffectiveStatusInput = {
  now: Date;
  houseTimeZone: string;
  memberStatus: MemberStatus;
  schedules: readonly StatusSchedule[];
  events: readonly ScheduleEvent[];
};

export type EffectiveStatus = {
  source: 'manual' | 'event' | 'schedule' | 'default';
  activityState: ActivityState;
  lightOn: boolean;
  moodKey: MoodKey | null;
  moodLabel: string | null;
  statusMessage: string | null;
  validUntil: Date | null;
};

type HouseClock = {
  weekday: Weekday;
  minuteOfDay: number;
};

const weekdayByName: Record<string, Weekday> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const formatterByTimeZone = new Map<string, Intl.DateTimeFormat>();

function getHouseClock(now: Date, houseTimeZone: string): HouseClock {
  const formatter = formatterByTimeZone.get(houseTimeZone) ?? new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    timeZone: houseTimeZone,
    weekday: 'short',
  });
  formatterByTimeZone.set(houseTimeZone, formatter);

  const parts = formatter.formatToParts(now);
  const weekdayName = parts.find((part) => part.type === 'weekday')?.value;
  const hour = Number(parts.find((part) => part.type === 'hour')?.value);
  const minute = Number(parts.find((part) => part.type === 'minute')?.value);

  if (weekdayName === undefined || Number.isNaN(hour) || Number.isNaN(minute)) {
    throw new Error('집 시간대를 해석할 수 없습니다.');
  }

  const weekday = weekdayByName[weekdayName];
  if (weekday === undefined) {
    throw new Error('집 요일을 해석할 수 없습니다.');
  }

  return { minuteOfDay: hour * 60 + minute, weekday };
}

function toMinuteOfDay(time: string): number | null {
  if (!timePattern.test(time)) {
    return null;
  }

  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

export function isScheduleActiveAt(
  schedule: Pick<StatusSchedule, 'daysOfWeek' | 'enabled' | 'endTime' | 'startTime'>,
  now: Date,
  houseTimeZone: string,
): boolean {
  if (!schedule.enabled) {
    return false;
  }

  const startMinute = toMinuteOfDay(schedule.startTime);
  const endMinute = toMinuteOfDay(schedule.endTime);
  if (startMinute === null || endMinute === null || startMinute === endMinute) {
    return false;
  }

  const { minuteOfDay, weekday } = getHouseClock(now, houseTimeZone);
  if (startMinute < endMinute) {
    return schedule.daysOfWeek.includes(weekday) && minuteOfDay >= startMinute && minuteOfDay < endMinute;
  }

  const previousWeekday = ((weekday + 6) % 7) as Weekday;
  return (
    (schedule.daysOfWeek.includes(weekday) && minuteOfDay >= startMinute) ||
    (schedule.daysOfWeek.includes(previousWeekday) && minuteOfDay < endMinute)
  );
}

function isEventActiveAt(event: ScheduleEvent, now: Date): boolean {
  return event.affectsStatus && event.startsAt <= now && now < event.endsAt;
}

function selectNewest<T extends { updatedAt: Date }>(items: readonly T[]): T | null {
  return items.reduce<T | null>(
    (newest, item) => !newest || item.updatedAt > newest.updatedAt ? item : newest,
    null,
  );
}

function selectHighestPriority(schedules: readonly StatusSchedule[]): StatusSchedule | null {
  return schedules.reduce<StatusSchedule | null>((winner, schedule) => {
    if (!winner) {
      return schedule;
    }

    if (schedule.priority > winner.priority) {
      return schedule;
    }

    return schedule.priority === winner.priority && schedule.updatedAt > winner.updatedAt ? schedule : winner;
  }, null);
}

function sharedFields(memberStatus: MemberStatus) {
  return {
    moodKey: memberStatus.moodKey,
    moodLabel: memberStatus.moodLabel,
    statusMessage: memberStatus.statusMessage,
  };
}

function defaultStatus(memberStatus: MemberStatus): EffectiveStatus {
  return {
    source: 'default',
    activityState: 'away',
    lightOn: false,
    ...sharedFields(memberStatus),
    validUntil: null,
  };
}

export function resolveEffectiveStatus({
  events,
  houseTimeZone,
  memberStatus,
  now,
  schedules,
}: EffectiveStatusInput): EffectiveStatus {
  if (memberStatus.membershipStatus !== 'active') {
    return defaultStatus(memberStatus);
  }

  if (memberStatus.mode === 'manual' && (memberStatus.manualUntil === null || memberStatus.manualUntil > now)) {
    return {
      source: 'manual',
      activityState: memberStatus.activityState,
      lightOn: memberStatus.lightOn,
      ...sharedFields(memberStatus),
      validUntil: memberStatus.manualUntil,
    };
  }

  const activeEvent = selectNewest(events.filter((event) => isEventActiveAt(event, now)));
  if (activeEvent) {
    return {
      source: 'event',
      activityState: activeEvent.activityState ?? 'away',
      lightOn: activeEvent.lightOn ?? false,
      ...sharedFields(memberStatus),
      validUntil: activeEvent.endsAt,
    };
  }

  const activeSchedule = selectHighestPriority(
    schedules.filter((schedule) => isScheduleActiveAt(schedule, now, houseTimeZone)),
  );
  if (activeSchedule) {
    return {
      source: 'schedule',
      activityState: activeSchedule.activityState,
      lightOn: activeSchedule.lightOn,
      ...sharedFields(memberStatus),
      validUntil: null,
    };
  }

  return defaultStatus(memberStatus);
}
