import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

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

  it('오늘 일정을 작성하면 공개 범위와 함께 목록에 바로 추가한다', async () => {
    await render(
      <ScheduleScreen
        repeatingSchedules={fixtureRepeatingSchedules}
        todaySchedules={fixtureTodaySchedules}
      />,
    );

    await fireEvent.press(screen.getByRole('button', { name: '오늘 일정 추가' }));
    await fireEvent.changeText(screen.getByLabelText('오늘 일정 제목'), '친구와 저녁');
    await fireEvent.press(screen.getByRole('radio', { name: '나만 보기' }));
    await fireEvent.press(screen.getByRole('button', { name: '오늘 일정 저장' }));

    await waitFor(() => {
      expect(screen.getByText('친구와 저녁')).toBeTruthy();
      expect(screen.getByLabelText('나만 보기 일정')).toBeTruthy();
    });
  });
});
