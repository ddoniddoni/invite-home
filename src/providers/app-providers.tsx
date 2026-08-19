import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';

import { LocalNoteProvider } from '@/features/notes/local-note-store';
import { LocalScheduleProvider } from '@/features/schedules/local-schedule-store';
import { LocalStatusProvider } from '@/features/status/local-status-store';
import { fixtureCurrentStatus, fixtureHouse } from '@/fixtures/house.fixture';
import { fixtureNotes } from '@/fixtures/notes.fixture';
import { fixtureRepeatingSchedules } from '@/fixtures/schedules.fixture';
import { appQueryClient } from '@/lib/query-client';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={appQueryClient}>
      <LocalStatusProvider houseTimeZone={fixtureHouse.timeZone} initialStatus={fixtureCurrentStatus}>
        <LocalScheduleProvider initialRepeatingSchedules={fixtureRepeatingSchedules}>
          <LocalNoteProvider initialNotes={fixtureNotes}>
            {children}
          </LocalNoteProvider>
        </LocalScheduleProvider>
      </LocalStatusProvider>
    </QueryClientProvider>
  );
}
