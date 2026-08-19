import { fireEvent, render, screen } from '@testing-library/react-native';

import { fixtureNotes } from '@/fixtures/notes.fixture';

import { NotesScreen } from '../notes-screen';

describe('NotesScreen', () => {
  it('받은 메모와 보낸 메모를 구분해 보여준다', async () => {
    await render(<NotesScreen notes={fixtureNotes} />);

    expect(screen.getByText('오늘도 수고했어. 푹 쉬어!')).toBeTruthy();
    expect(screen.getByText('읽지 않음')).toBeTruthy();

    await fireEvent.press(screen.getByRole('tab', { name: '보낸 메모' }));

    expect(screen.getByText('나 → 민수')).toBeTruthy();
    expect(screen.getByText('회의 끝나면 연락 줘.')).toBeTruthy();
  });

  it('읽지 않은 받은 메모를 열면 읽음 처리 콜백을 호출한다', async () => {
    const onReadNote = jest.fn();
    await render(<NotesScreen notes={fixtureNotes} onReadNote={onReadNote} />);

    await fireEvent.press(screen.getByRole('button', {
      name: '민수의 메모. 읽지 않음. 오늘도 수고했어. 푹 쉬어!',
    }));

    expect(onReadNote).toHaveBeenCalledWith('fixture-note-minsu-1');
  });
});
