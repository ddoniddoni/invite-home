import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { TodayScheduleComposer } from '../today-schedule-composer';

describe('TodayScheduleComposer', () => {
  it('유효한 오늘 일정을 저장 콜백으로 전달한다', async () => {
    const onSave = jest.fn().mockResolvedValue(undefined);
    await render(<TodayScheduleComposer onClose={jest.fn()} onSave={onSave} />);

    await fireEvent.changeText(screen.getByLabelText('오늘 일정 제목'), '늦은 저녁 약속');
    await fireEvent.changeText(screen.getByLabelText('오늘 일정 시작 시각'), '20:30');
    await fireEvent.changeText(screen.getByLabelText('오늘 일정 종료 시각'), '22:00');
    await fireEvent.press(screen.getByRole('radio', { name: '나만 보기' }));
    await fireEvent.press(screen.getByRole('button', { name: '오늘 일정 저장' }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        title: '늦은 저녁 약속',
        startTime: '20:30',
        endTime: '22:00',
        visibility: 'private',
      });
    });
  });
});
