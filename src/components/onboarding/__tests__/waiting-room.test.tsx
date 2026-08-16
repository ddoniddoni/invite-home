import { fireEvent, render, screen } from '@testing-library/react-native';

import { WaitingRoom } from '../waiting-room';

describe('WaitingRoom', () => {
  it('대기 중인 사용자가 입주 신청을 취소할 수 있다', async () => {
    const onLeaveHouse = jest.fn();
    await render(
      <WaitingRoom
        houseName="한강이 보이는 우리집"
        houseType="apartment"
        moveInAvailableAt={new Date(Date.now() + 60 * 60 * 1000).toISOString()}
        onEnterHouse={jest.fn()}
        onLeaveHouse={onLeaveHouse}
        ownerNickname="나린"
      />,
    );

    expect(screen.getByLabelText(/입주까지 \d{2}:\d{2}:\d{2} 남았어요/)).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: '입주 신청 취소' }));

    expect(onLeaveHouse).toHaveBeenCalledTimes(1);
  });

  it('입주 가능 시각이 지나면 입주 버튼을 표시한다', async () => {
    const onEnterHouse = jest.fn();
    await render(
      <WaitingRoom
        houseName="한강이 보이는 우리집"
        houseType="apartment"
        moveInAvailableAt={new Date(Date.now() - 1000).toISOString()}
        onEnterHouse={onEnterHouse}
        onLeaveHouse={jest.fn()}
        ownerNickname="나린"
      />,
    );

    await fireEvent.press(screen.getByRole('button', { name: '우리집 들어가기' }));

    expect(onEnterHouse).toHaveBeenCalledTimes(1);
  });
});
