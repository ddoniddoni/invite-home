import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { ScheduleComposer } from '../schedule-composer';

describe('ScheduleComposer', () => {
  it('유효한 반복 스케줄을 저장 콜백으로 전달한다', async () => {
    const onSave = jest.fn().mockResolvedValue(undefined);
    await render(<ScheduleComposer onClose={jest.fn()} onSave={onSave} />);

    await fireEvent.changeText(screen.getByLabelText('스케줄 이름'), '저녁 집중');
    await fireEvent.changeText(screen.getByLabelText('시작 시각'), '20:00');
    await fireEvent.changeText(screen.getByLabelText('종료 시각'), '23:00');
    await fireEvent.press(screen.getByRole('button', { name: '반복 스케줄 저장' }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        label: '저녁 집중',
        daysOfWeek: [1, 2, 3, 4, 5],
        startTime: '20:00',
        endTime: '23:00',
        activityState: 'work',
        lightOn: true,
        enabled: true,
      });
    });
  });
});
