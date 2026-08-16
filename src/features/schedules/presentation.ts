import type { Weekday } from './types';

export const weekdayLabels: Record<Weekday, string> = {
  0: '일',
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
};

const weekdaysInOrder: readonly Weekday[] = [0, 1, 2, 3, 4, 5, 6];
const workdays: readonly Weekday[] = [1, 2, 3, 4, 5];

function includesEveryDay(days: readonly Weekday[], expectedDays: readonly Weekday[]) {
  return days.length === expectedDays.length && expectedDays.every((day) => days.includes(day));
}

export function formatWeekdays(days: readonly Weekday[]): string {
  const uniqueDays = [...new Set(days)].sort((left, right) => left - right) as Weekday[];

  if (includesEveryDay(uniqueDays, weekdaysInOrder)) {
    return '매일';
  }

  if (includesEveryDay(uniqueDays, workdays)) {
    return '월–금';
  }

  return uniqueDays.map((day) => weekdayLabels[day]).join(' · ');
}

export const weekdayOrder = weekdaysInOrder;
