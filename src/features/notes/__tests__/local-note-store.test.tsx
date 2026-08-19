import { fireEvent, render, screen } from '@testing-library/react-native';
import { Pressable, Text, View } from 'react-native';

import { fixtureNotes } from '@/fixtures/notes.fixture';

import { LocalNoteProvider, useLocalNotes } from '../local-note-store';

function NoteProbe() {
  const { markNoteRead, notes, sendNote } = useLocalNotes();
  const sentNotes = notes.filter((note) => note.direction === 'sent');
  const unreadReceivedNotes = notes.filter((note) => note.direction === 'received' && note.isUnread);

  return (
    <View>
      <Text>보낸 메모 {sentNotes.length}개</Text>
      <Text>읽지 않은 받은 메모 {unreadReceivedNotes.length}개</Text>
      <Text>{sentNotes[0]?.body}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => sendNote({
          recipientNickname: '민수',
          value: { body: '오늘도 고생했어.', type: 'greeting' },
        })}
      >
        <Text>메모 보내기</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => markNoteRead('fixture-note-minsu-1')}>
        <Text>민수 메모 읽기</Text>
      </Pressable>
    </View>
  );
}

describe('LocalNoteProvider', () => {
  it('보낸 메모를 공용 목록의 맨 앞에 추가한다', async () => {
    await render(
      <LocalNoteProvider initialNotes={fixtureNotes}>
        <NoteProbe />
      </LocalNoteProvider>,
    );

    expect(screen.getByText('보낸 메모 1개')).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: '메모 보내기' }));

    expect(screen.getByText('보낸 메모 2개')).toBeTruthy();
    expect(screen.getByText('오늘도 고생했어.')).toBeTruthy();
  });

  it('받은 읽지 않은 메모만 읽음으로 바꾸고 반복 호출해도 유지한다', async () => {
    await render(
      <LocalNoteProvider initialNotes={fixtureNotes}>
        <NoteProbe />
      </LocalNoteProvider>,
    );

    expect(screen.getByText('읽지 않은 받은 메모 1개')).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: '민수 메모 읽기' }));
    await fireEvent.press(screen.getByRole('button', { name: '민수 메모 읽기' }));

    expect(screen.getByText('읽지 않은 받은 메모 0개')).toBeTruthy();
  });
});
