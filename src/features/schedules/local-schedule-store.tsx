import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import type { RepeatingSchedulePreview } from './types';

export type RepeatingScheduleUpdater = (
  schedules: readonly RepeatingSchedulePreview[],
) => readonly RepeatingSchedulePreview[];

type LocalScheduleStoreValue = {
  repeatingSchedules: readonly RepeatingSchedulePreview[];
  updateRepeatingSchedules: (updater: RepeatingScheduleUpdater) => void;
};

type LocalScheduleProviderProps = PropsWithChildren<{
  initialRepeatingSchedules: readonly RepeatingSchedulePreview[];
}>;

const LocalScheduleContext = createContext<LocalScheduleStoreValue | null>(null);

export function LocalScheduleProvider({ children, initialRepeatingSchedules }: LocalScheduleProviderProps) {
  const [repeatingSchedules, setRepeatingSchedules] = useState<readonly RepeatingSchedulePreview[]>(
    initialRepeatingSchedules,
  );
  const updateRepeatingSchedules = useCallback((updater: RepeatingScheduleUpdater) => {
    setRepeatingSchedules(updater);
  }, []);
  const value = useMemo(
    () => ({ repeatingSchedules, updateRepeatingSchedules }),
    [repeatingSchedules, updateRepeatingSchedules],
  );

  return <LocalScheduleContext.Provider value={value}>{children}</LocalScheduleContext.Provider>;
}

export function useLocalSchedules() {
  const value = useContext(LocalScheduleContext);

  if (!value) {
    throw new Error('LocalScheduleProvider 안에서 useLocalSchedules를 사용해야 합니다.');
  }

  return value;
}
