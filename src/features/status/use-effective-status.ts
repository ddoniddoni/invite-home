import { useEffect, useState } from 'react';

import {
  resolveEffectiveStatus,
  type EffectiveStatus,
  type EffectiveStatusInput,
} from './effective-status';

const defaultRefreshIntervalMs = 60 * 1000;

type EffectiveStatusParameters = Omit<EffectiveStatusInput, 'now'>;

function useLocalClock(refreshIntervalMs: number): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), refreshIntervalMs);

    return () => clearInterval(intervalId);
  }, [refreshIntervalMs]);

  return now;
}

export function useEffectiveStatus(
  input: EffectiveStatusParameters,
  refreshIntervalMs = defaultRefreshIntervalMs,
): EffectiveStatus {
  const now = useLocalClock(refreshIntervalMs);

  return resolveEffectiveStatus({ ...input, now });
}
