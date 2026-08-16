import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import type { StatusFormValues } from '@/features/status/status.schema';

import { StatusEditor } from '../status-editor';

const initialValue: StatusFormValues = {
  mode: 'manual',
  activityState: 'work',
  lightOn: true,
  moodKey: 'mint',
  moodLabel: '',
  statusMessage: '',
  manualUntil: 'tonight',
};

describe('StatusEditor', () => {
  it('수동 모드와 자동 모드를 명확하게 전환한다', async () => {
    await render(
      <StatusEditor
        initialValue={initialValue}
        nickname="나린"
        onClose={jest.fn()}
        onSave={jest.fn()}
      />,
    );

    expect(screen.getByRole('tab', { name: '수동' }).props.accessibilityState).toEqual({
      selected: true,
    });
    expect(screen.getByText('수동 상태 종료')).toBeTruthy();

    await fireEvent.press(screen.getByRole('tab', { name: '자동' }));

    expect(screen.getByRole('tab', { name: '자동' }).props.accessibilityState).toEqual({
      selected: true,
    });
    expect(screen.getByText('자동 모드에서는 다음 단계의 반복 스케줄 값을 사용해요.')).toBeTruthy();
  });

  it('검증된 상태 값을 저장 콜백으로 전달한다', async () => {
    const onSave = jest.fn();

    await render(
      <StatusEditor initialValue={initialValue} nickname="나린" onClose={jest.fn()} onSave={onSave} />,
    );

    await fireEvent.changeText(screen.getByLabelText('상태 메시지'), '저녁 먹고 돌아올게요');
    await fireEvent.press(screen.getByRole('button', { name: '내 상태 저장' }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1);
      expect(onSave.mock.calls[0]?.[0]).toEqual({
        ...initialValue,
        statusMessage: '저녁 먹고 돌아올게요',
      });
    });
  });
});
