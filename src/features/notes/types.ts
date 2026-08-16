import type { NoteType } from './note.schema';

export type NoteDirection = 'received' | 'sent';

export type NotePreview = {
  id: string;
  direction: NoteDirection;
  type: NoteType;
  body: string;
  counterpartNickname: string;
  createdAtLabel: string;
  isUnread: boolean;
};
