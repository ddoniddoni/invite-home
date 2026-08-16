import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { fixtureCurrentUserId, fixtureMembers } from '@/fixtures/house.fixture';

import { NoteComposer } from '../note-composer';

const minsu = fixtureMembers.find((member) => member.id === 'fixture-user-minsu');
const currentMember = fixtureMembers.find((member) => member.id === fixtureCurrentUserId);

if (!minsu || !currentMember) {
  throw new Error('메모 작성 테스트용 fixture가 없습니다.');
}

describe('NoteComposer', () => {
  it('공백만 있는 메모의 전송을 거부한다', async () => {
    const onSend = jest.fn().mockResolvedValue(undefined);
    await render(
      <NoteComposer
        currentUserId={fixtureCurrentUserId}
        onClose={jest.fn()}
        onSend={onSend}
        recipient={minsu}
      />,
    );

    await fireEvent.changeText(screen.getByLabelText('메모 내용'), '   ');
    await fireEvent.press(screen.getByRole('button', { name: '민수에게 메모 보내기' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('메모 내용을 입력해 주세요.');
    });
    expect(onSend).not.toHaveBeenCalled();
  });

  it('앞뒤 공백을 제거한 메모와 유형을 전송한다', async () => {
    const onSend = jest.fn().mockResolvedValue(undefined);
    await render(
      <NoteComposer
        currentUserId={fixtureCurrentUserId}
        onClose={jest.fn()}
        onSend={onSend}
        recipient={minsu}
      />,
    );

    await fireEvent.press(screen.getByRole('tab', { name: '하루 인사로 작성' }));
    await fireEvent.changeText(screen.getByLabelText('메모 내용'), '  잘 자요  ');
    await fireEvent.press(screen.getByRole('button', { name: '민수에게 하루 인사 보내기' }));

    await waitFor(() => {
      expect(onSend).toHaveBeenCalledWith({ body: '잘 자요', type: 'greeting' });
    });
  });

  it('본인에게 보내는 동작을 비활성화한다', async () => {
    await render(
      <NoteComposer
        currentUserId={fixtureCurrentUserId}
        onClose={jest.fn()}
        onSend={jest.fn().mockResolvedValue(undefined)}
        recipient={currentMember}
      />,
    );

    const sendButton = screen.getByRole('button', { name: '나린에게 메모 보내기' });

    expect(sendButton.props.accessibilityState).toEqual({ disabled: true });
    expect(screen.getByText('메모는 함께 사는 다른 입주민에게만 보낼 수 있어요.')).toBeTruthy();
  });
});
