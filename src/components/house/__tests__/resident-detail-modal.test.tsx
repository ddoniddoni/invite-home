import { fireEvent, render, screen } from '@testing-library/react-native';

import { fixtureMembers } from '@/fixtures/house.fixture';

import { ResidentDetailModal } from '../resident-detail-modal';

const minsu = fixtureMembers.find((member) => member.id === 'fixture-user-minsu');
const sora = fixtureMembers.find((member) => member.id === 'fixture-user-sora');

if (!minsu || !sora) {
  throw new Error('입주민 상세 모달 테스트용 fixture가 없습니다.');
}

describe('ResidentDetailModal', () => {
  it('입주민의 공개 상태와 오늘 일정을 표시하고 정확한 마지막 접속 시각은 노출하지 않는다', async () => {
    await render(<ResidentDetailModal member={minsu} onClose={jest.fn()} onPressNote={jest.fn()} />);

    expect(screen.getByText('민수')).toBeTruthy();
    expect(screen.getByText('취침 중')).toBeTruthy();
    expect(screen.getByText('남빛 · 느긋한 밤')).toBeTruthy();
    expect(screen.getByText('오늘은 일찍 잘게요.')).toBeTruthy();
    expect(screen.getByText('독서 시간')).toBeTruthy();
    expect(screen.queryByText(/마지막 접속/)).toBeNull();
  });

  it('활성 입주민에게 메모를 남기는 동작을 전달한다', async () => {
    const onPressNote = jest.fn();
    await render(<ResidentDetailModal member={minsu} onClose={jest.fn()} onPressNote={onPressNote} />);

    await fireEvent.press(screen.getByRole('button', { name: '민수에게 메모 남기기' }));

    expect(onPressNote).toHaveBeenCalledWith(minsu.id);
  });

  it('입주 대기 중인 입주민의 메모 버튼을 비활성화한다', async () => {
    await render(<ResidentDetailModal member={sora} onClose={jest.fn()} onPressNote={jest.fn()} />);

    const noteButton = screen.getByRole('button', { name: '소라에게 메모 남기기' });

    expect(noteButton.props.accessibilityState).toEqual({ disabled: true });
    expect(screen.getByText('공개한 오늘 일정이 없어요.')).toBeTruthy();
  });
});
