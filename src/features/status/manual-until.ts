import type { ManualUntil } from './status.schema';

type HouseDate = {
  year: number;
  month: number;
  day: number;
};

const dateFormatterByTimeZone = new Map<string, Intl.DateTimeFormat>();
const dateTimeFormatterByTimeZone = new Map<string, Intl.DateTimeFormat>();

function getFormatter(
  cache: Map<string, Intl.DateTimeFormat>,
  timeZone: string,
  options: Intl.DateTimeFormatOptions,
) {
  const formatter = cache.get(timeZone) ?? new Intl.DateTimeFormat('en-US', { ...options, timeZone });
  cache.set(timeZone, formatter);
  return formatter;
}

function getNumericPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): number {
  const value = parts.find((part) => part.type === type)?.value;
  const numberValue = Number(value);

  if (value === undefined || Number.isNaN(numberValue)) {
    throw new Error('집 시간대를 해석할 수 없습니다.');
  }

  return numberValue;
}

function getHouseDate(now: Date, timeZone: string): HouseDate {
  const formatter = getFormatter(dateFormatterByTimeZone, timeZone, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const parts = formatter.formatToParts(now);

  return {
    year: getNumericPart(parts, 'year'),
    month: getNumericPart(parts, 'month'),
    day: getNumericPart(parts, 'day'),
  };
}

function addDays(date: HouseDate, days: number): HouseDate {
  const nextDate = new Date(Date.UTC(date.year, date.month - 1, date.day + days));

  return {
    year: nextDate.getUTCFullYear(),
    month: nextDate.getUTCMonth() + 1,
    day: nextDate.getUTCDate(),
  };
}

function getTimeZoneOffset(instant: Date, timeZone: string): number {
  const formatter = getFormatter(dateTimeFormatterByTimeZone, timeZone, {
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    month: '2-digit',
    second: '2-digit',
    year: 'numeric',
  });
  const parts = formatter.formatToParts(instant);
  const houseTimeAsUtc = Date.UTC(
    getNumericPart(parts, 'year'),
    getNumericPart(parts, 'month') - 1,
    getNumericPart(parts, 'day'),
    getNumericPart(parts, 'hour'),
    getNumericPart(parts, 'minute'),
    getNumericPart(parts, 'second'),
  );

  return houseTimeAsUtc - instant.getTime();
}

function getInstantAtHouseTime(date: HouseDate, hour: number, timeZone: string): Date {
  const localTimeAsUtc = Date.UTC(date.year, date.month - 1, date.day, hour);
  let instant = localTimeAsUtc;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    instant = localTimeAsUtc - getTimeZoneOffset(new Date(instant), timeZone);
  }

  return new Date(instant);
}

export function resolveManualUntil(
  manualUntil: ManualUntil,
  savedAt: Date,
  houseTimeZone: string,
): Date | null {
  if (manualUntil === 'indefinite') {
    return null;
  }

  const houseDate = getHouseDate(savedAt, houseTimeZone);
  if (manualUntil === 'tonight') {
    return getInstantAtHouseTime(houseDate, 23, houseTimeZone);
  }

  return getInstantAtHouseTime(addDays(houseDate, 1), 8, houseTimeZone);
}
