const secondsPerMinute = 60;
const secondsPerHour = secondsPerMinute * 60;

export function getRemainingSeconds(moveInAvailableAt: string, now = Date.now()): number {
  const moveInAt = Date.parse(moveInAvailableAt);

  if (!Number.isFinite(moveInAt)) {
    return 0;
  }

  return Math.max(0, Math.ceil((moveInAt - now) / 1000));
}

export function formatRemainingTime(remainingSeconds: number): string {
  const safeRemainingSeconds = Math.max(0, Math.floor(remainingSeconds));
  const hours = Math.floor(safeRemainingSeconds / secondsPerHour);
  const minutes = Math.floor((safeRemainingSeconds % secondsPerHour) / secondsPerMinute);
  const seconds = safeRemainingSeconds % secondsPerMinute;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}
