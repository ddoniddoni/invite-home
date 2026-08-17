import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { resolveManualUntil } from './manual-until';
import type { StatusFormValues } from './status.schema';

export type LocalStatusState = {
  manualUntil: Date | null;
  values: StatusFormValues;
};

type LocalStatusStoreValue = {
  currentStatus: LocalStatusState;
  saveStatus: (nextStatus: StatusFormValues) => void;
};

type LocalStatusProviderProps = PropsWithChildren<{
  houseTimeZone: string;
  initialStatus: StatusFormValues;
}>;

const LocalStatusContext = createContext<LocalStatusStoreValue | null>(null);

function toLocalStatusState(status: StatusFormValues, houseTimeZone: string): LocalStatusState {
  return {
    values: status,
    manualUntil: resolveManualUntil(status.manualUntil, new Date(), houseTimeZone),
  };
}

export function LocalStatusProvider({ children, houseTimeZone, initialStatus }: LocalStatusProviderProps) {
  const [currentStatus, setCurrentStatus] = useState<LocalStatusState>(() =>
    toLocalStatusState(initialStatus, houseTimeZone),
  );
  const saveStatus = useCallback(
    (nextStatus: StatusFormValues) => {
      setCurrentStatus(toLocalStatusState(nextStatus, houseTimeZone));
    },
    [houseTimeZone],
  );
  const value = useMemo(
    () => ({ currentStatus, saveStatus }),
    [currentStatus, saveStatus],
  );

  return <LocalStatusContext.Provider value={value}>{children}</LocalStatusContext.Provider>;
}

export function useLocalStatus() {
  const value = useContext(LocalStatusContext);

  if (!value) {
    throw new Error('LocalStatusProvider 안에서 useLocalStatus를 사용해야 합니다.');
  }

  return value;
}
