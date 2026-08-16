import { fireEvent, render, screen } from '@testing-library/react-native';

import { fixtureRepeatingSchedules, fixtureTodaySchedules } from '@/fixtures/schedules.fixture';

import { ScheduleScreen } from '../schedule-screen';

describe('ScheduleScreen', () => {
  it('반복 스케줄과 오늘 일정을 표시하고 활성 상태를 바꾼다', async () => {
    await render(
      <ScheduleScreen
        repeatingSchedules={fixtureRepeatingSchedules}
        todaySchedules={fixtureTodaySchedules}
      />,
    );

    expect(screen.getByText('저녁 산책')).toBeTruthy();
    await fireEvent(screen.getByRole('switch', { name: '업무 시간 끄기' }), 'valueChange', false);

    expect(screen.getByRole('switch', { name: '업무 시간 켜기' })).toBeTruthy();
  });
});
