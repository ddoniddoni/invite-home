import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import type { NoteFormValues } from './note.schema';
import type { NotePreview } from './types';

export type LocalSentNoteInput = {
  recipientNickname: string;
  value: NoteFormValues;
};

type LocalNoteStoreValue = {
  markNoteRead: (noteId: string) => void;
  notes: readonly NotePreview[];
  sendNote: (input: LocalSentNoteInput) => void;
};

type LocalNoteProviderProps = PropsWithChildren<{
  initialNotes: readonly NotePreview[];
}>;

const LocalNoteContext = createContext<LocalNoteStoreValue | null>(null);

export function LocalNoteProvider({ children, initialNotes }: LocalNoteProviderProps) {
  const [notes, setNotes] = useState<readonly NotePreview[]>(initialNotes);
  const markNoteRead = useCallback((noteId: string) => {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === noteId && note.direction === 'received' && note.isUnread
          ? { ...note, isUnread: false }
          : note,
      ),
    );
  }, []);
  const sendNote = useCallback((input: LocalSentNoteInput) => {
    setNotes((currentNotes) => [
      {
        id: `fixture-local-note-${currentNotes.length + 1}`,
        direction: 'sent',
        type: input.value.type,
        body: input.value.body,
        counterpartNickname: input.recipientNickname,
        createdAtLabel: '방금 전',
        isUnread: true,
      },
      ...currentNotes,
    ]);
  }, []);
  const value = useMemo(
    () => ({ markNoteRead, notes, sendNote }),
    [markNoteRead, notes, sendNote],
  );

  return <LocalNoteContext.Provider value={value}>{children}</LocalNoteContext.Provider>;
}

export function useLocalNotes() {
  const value = useContext(LocalNoteContext);

  if (!value) {
    throw new Error('LocalNoteProvider 안에서 useLocalNotes를 사용해야 합니다.');
  }

  return value;
}
