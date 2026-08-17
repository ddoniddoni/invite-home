import { fireEvent, render, screen } from '@testing-library/react-native';
import { Pressable, Text, View } from 'react-native';

import { fixtureRepeatingSchedules } from '@/fixtures/schedules.fixture';

import { LocalScheduleProvider, useLocalSchedules } from '../local-schedule-store';

function ScheduleProbe() {
  const { repeatingSchedules, updateRepeatingSchedules } = useLocalSchedules();

  return (
    <View>
      <Text>{repeatingSchedules[0]?.isEnabled ? '업무 규칙 켜짐' : '업무 규칙 꺼짐'}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => updateRepeatingSchedules((schedules) =>
          schedules.map((schedule) =>
            schedule.id === 'fixture-repeat-work' ? { ...schedule, isEnabled: false } : schedule,
          ),
        )}
      >
        <Text>업무 규칙 끄기</Text>
      </Pressable>
    </View>
  );
}

describe('LocalScheduleProvider', () => {
  it('반복 일정 변경을 앱 전체 상태로 유지한다', async () => {
    await render(
      <LocalScheduleProvider initialRepeatingSchedules={fixtureRepeatingSchedules}>
        <ScheduleProbe />
      </LocalScheduleProvider>,
    );

    expect(screen.getByText('업무 규칙 켜짐')).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: '업무 규칙 끄기' }));

    expect(screen.getByText('업무 규칙 꺼짐')).toBeTruthy();
  });
});
