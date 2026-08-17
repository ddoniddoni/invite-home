import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { fixtureRepeatingSchedules, fixtureTodaySchedules } from '@/fixtures/schedules.fixture';
import type { TodaySchedulePreview } from '@/features/schedules/types';

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

  it('반복 스케줄을 편집해도 기존 우선순위와 활성 상태를 유지한다', async () => {
    await render(
      <ScheduleScreen
        repeatingSchedules={fixtureRepeatingSchedules}
        todaySchedules={fixtureTodaySchedules}
      />,
    );

    await fireEvent.press(screen.getByRole('button', { name: '업무 시간 편집' }));
    await fireEvent.changeText(screen.getByLabelText('스케줄 이름'), '집중 업무');
    await fireEvent.press(screen.getByRole('button', { name: '반복 스케줄 수정 저장' }));

    await waitFor(() => {
      expect(screen.getByText('집중 업무')).toBeTruthy();
      expect(screen.getByRole('switch', { name: '집중 업무 끄기' })).toBeTruthy();
    });
  });

  it('반복 스케줄 작성 시 기존 규칙과의 겹침을 안내한다', async () => {
    await render(
      <ScheduleScreen
        repeatingSchedules={fixtureRepeatingSchedules}
        todaySchedules={fixtureTodaySchedules}
      />,
    );

    await fireEvent.press(screen.getByRole('button', { name: '반복 스케줄 추가' }));

    expect(screen.getByText('업무 시간과 시간이 겹쳐요')).toBeTruthy();
  });

  it('반복 스케줄 삭제는 확인한 경우에만 목록에 반영한다', async () => {
    await render(
      <ScheduleScreen
        repeatingSchedules={fixtureRepeatingSchedules}
        todaySchedules={fixtureTodaySchedules}
      />,
    );

    await fireEvent.press(screen.getByRole('button', { name: '업무 시간 삭제' }));
    expect(screen.getByText('일정을 삭제할까요?')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: '삭제 취소' }));
    expect(screen.getByText('업무 시간')).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: '업무 시간 삭제' }));
    await fireEvent.press(screen.getByRole('button', { name: '반복 스케줄 삭제 확인' }));

    await waitFor(() => {
      expect(screen.queryByText('업무 시간')).toBeNull();
      expect(screen.getByText('취침 시간')).toBeTruthy();
    });
  });

  it('오늘 일정을 편집하면 시간과 공개 범위를 갱신한다', async () => {
    await render(
      <ScheduleScreen
        repeatingSchedules={fixtureRepeatingSchedules}
        todaySchedules={fixtureTodaySchedules}
      />,
    );

    await fireEvent.press(screen.getByRole('button', { name: '저녁 산책 편집' }));
    await fireEvent.changeText(screen.getByLabelText('오늘 일정 제목'), '친구와 저녁');
    await fireEvent.changeText(screen.getByLabelText('오늘 일정 시작 시각'), '19:30');
    await fireEvent.press(screen.getByRole('radio', { name: '나만 보기' }));
    await fireEvent.press(screen.getByRole('button', { name: '오늘 일정 수정 저장' }));

    await waitFor(() => {
      expect(screen.getByText('친구와 저녁')).toBeTruthy();
      expect(screen.getByText('19:30–21:10')).toBeTruthy();
      expect(screen.getByLabelText('나만 보기 일정')).toBeTruthy();
    });
  });

  it('오늘 일정이 100개면 추가 버튼을 비활성화한다', async () => {
    const fullTodaySchedules: readonly TodaySchedulePreview[] = Array.from({ length: 100 }, (_, index) => ({
      id: `fixture-today-${index}`,
      title: `오늘 일정 ${index + 1}`,
      startTime: '20:00',
      endTime: '21:00',
      timeLabel: '20:00–21:00',
      visibility: 'house',
    }));

    await render(
      <ScheduleScreen
        repeatingSchedules={fixtureRepeatingSchedules}
        todaySchedules={fullTodaySchedules}
      />,
    );

    expect(screen.getByRole('button', { name: '오늘 일정 추가' }).props.accessibilityState).toEqual({ disabled: true });
    expect(screen.getByText('오늘 일정은 최대 100개까지 만들 수 있어요.')).toBeTruthy();
  });

  it('오늘 일정을 삭제하면 빈 상태와 추가 버튼을 표시한다', async () => {
    await render(
      <ScheduleScreen
        repeatingSchedules={fixtureRepeatingSchedules}
        todaySchedules={fixtureTodaySchedules}
      />,
    );

    await fireEvent.press(screen.getByRole('button', { name: '저녁 산책 삭제' }));
    await fireEvent.press(screen.getByRole('button', { name: '오늘 일정 삭제 확인' }));

    await waitFor(() => {
      expect(screen.queryByText('저녁 산책')).toBeNull();
      expect(screen.getByLabelText('오늘 일정이 없어요. 일정 추가로 오늘의 약속을 남겨 보세요.')).toBeTruthy();
      expect(screen.getByRole('button', { name: '오늘 일정 추가' }).props.accessibilityState).toEqual({ disabled: false });
    });
  });
});
