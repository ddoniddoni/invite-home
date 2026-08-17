import { fireEvent, render, screen } from '@testing-library/react-native';
import { Pressable, Text, View } from 'react-native';

import { LocalStatusProvider, useLocalStatus } from '../local-status-store';
import type { StatusFormValues } from '../status.schema';

const initialStatus: StatusFormValues = {
  mode: 'manual',
  activityState: 'work',
  lightOn: true,
  moodKey: 'mint',
  moodLabel: '차분함',
  statusMessage: '집중 중이에요.',
  manualUntil: 'tonight',
};

const updatedStatus: StatusFormValues = {
  mode: 'manual',
  activityState: 'rest',
  lightOn: false,
  moodKey: 'peach',
  moodLabel: '느긋함',
  statusMessage: '잠시 쉬고 있어요.',
  manualUntil: 'indefinite',
};

function StatusProbe() {
  const { currentStatus, saveStatus } = useLocalStatus();

  return (
    <View>
      <Text>현재 상태: {currentStatus.values.activityState}</Text>
      <Text>{currentStatus.manualUntil === null ? '만료 없음' : '종료 시각 있음'}</Text>
      <Pressable accessibilityRole="button" onPress={() => saveStatus(updatedStatus)}>
        <Text>상태 저장</Text>
      </Pressable>
    </View>
  );
}

describe('LocalStatusProvider', () => {
  it('저장한 상태와 수동 종료 시각을 앱 전체 상태로 바꾼다', async () => {
    await render(
      <LocalStatusProvider houseTimeZone="Asia/Seoul" initialStatus={initialStatus}>
        <StatusProbe />
      </LocalStatusProvider>,
    );

    expect(screen.getByText('현재 상태: work')).toBeTruthy();
    expect(screen.getByText('종료 시각 있음')).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: '상태 저장' }));

    expect(screen.getByText('현재 상태: rest')).toBeTruthy();
    expect(screen.getByText('만료 없음')).toBeTruthy();
  });
});
