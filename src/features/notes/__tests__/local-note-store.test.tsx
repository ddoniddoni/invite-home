import { fireEvent, render, screen } from '@testing-library/react-native';
import { Pressable, Text, View } from 'react-native';

import { fixtureNotes } from '@/fixtures/notes.fixture';

import { LocalNoteProvider, useLocalNotes } from '../local-note-store';

function NoteProbe() {
  const { notes, sendNote } = useLocalNotes();
  const sentNotes = notes.filter((note) => note.direction === 'sent');

  return (
    <View>
      <Text>보낸 메모 {sentNotes.length}개</Text>
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
});
