import { fireEvent, render, screen } from '@testing-library/react-native';

import { EmptyWindowUnit, WindowUnit } from '../window-unit';

describe('WindowUnit', () => {
  it('색 이외의 상태 정보를 포함한 접근성 label을 제공한다', async () => {
    await render(
      <WindowUnit
        activityState="work"
        hasUnreadNoteForMe
        isMine={false}
        isPending={false}
        lightOn
        moodKey="mint"
        nickname="민수"
        onPress={jest.fn()}
        slot={2}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: '민수의 방, 업무 중, 전등 켜짐, 민트빛, 읽지 않은 메모 있음',
      }),
    ).toBeTruthy();
  });

  it('입주 대기 상태와 빈 방 초대 동작을 구분한다', async () => {
    const onInvite = jest.fn();
    const pendingView = await render(
      <WindowUnit
        activityState="away"
        hasUnreadNoteForMe={false}
        isMine={false}
        isPending
        lightOn
        moodKey="rose"
        nickname="소라"
        onPress={jest.fn()}
        slot={5}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: '소라의 방, 입주 대기, 자리 비움, 전등 켜짐, 장밋빛',
      }),
    ).toBeTruthy();

    await pendingView.unmount();
    await render(<EmptyWindowUnit isOwner onPress={onInvite} slot={6} />);
    await fireEvent.press(screen.getByRole('button', { name: '빈 6번 방, 친구 초대하기' }));

    expect(onInvite).toHaveBeenCalledTimes(1);
  });
});
