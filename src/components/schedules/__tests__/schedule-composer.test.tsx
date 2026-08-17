import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { ScheduleComposer } from '../schedule-composer';

const overlapSchedule = {
  id: 'existing-work',
  title: '업무 시간',
  daysOfWeek: [1, 2, 3, 4, 5] as const,
  startTime: '09:00',
  endTime: '18:00',
  weekdayLabel: '월–금',
  timeLabel: '09:00–18:00',
  activityState: 'work' as const,
  lightOn: true,
  isEnabled: true,
  priority: 1,
};

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

  it('기존 반복 스케줄 값을 채워 수정 결과로 전달한다', async () => {
    const onSave = jest.fn().mockResolvedValue(undefined);
    await render(
      <ScheduleComposer
        initialValue={{
          label: '업무 시간',
          daysOfWeek: [1, 2, 3, 4, 5],
          startTime: '09:00',
          endTime: '18:00',
          activityState: 'work',
          lightOn: true,
          enabled: true,
        }}
        onClose={jest.fn()}
        onSave={onSave}
      />,
    );

    expect(screen.getByText('반복 스케줄 수정')).toBeTruthy();
    expect(screen.getByLabelText('스케줄 이름').props.value).toBe('업무 시간');
    await fireEvent.changeText(screen.getByLabelText('스케줄 이름'), '집중 업무');
    await fireEvent.press(screen.getByRole('button', { name: '반복 스케줄 수정 저장' }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        label: '집중 업무',
        daysOfWeek: [1, 2, 3, 4, 5],
        startTime: '09:00',
        endTime: '18:00',
        activityState: 'work',
        lightOn: true,
        enabled: true,
      });
    });
  });

  it('겹치는 활성 규칙을 안내하지만 저장은 막지 않는다', async () => {
    const onSave = jest.fn().mockResolvedValue(undefined);
    await render(
      <ScheduleComposer
        onClose={jest.fn()}
        onSave={onSave}
        overlapSchedules={[overlapSchedule]}
      />,
    );

    expect(screen.getByRole('alert').props.children).toBe('업무 시간과 시간이 겹쳐요');
    await fireEvent.changeText(screen.getByLabelText('스케줄 이름'), '오전 집중');
    await fireEvent.press(screen.getByRole('button', { name: '반복 스케줄 저장' }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
    });
  });
});
