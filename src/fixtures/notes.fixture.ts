import type { NotePreview } from '@/features/notes/types';

export const fixtureNotes: readonly NotePreview[] = [
  {
    id: 'fixture-note-minsu-1',
    direction: 'received',
    type: 'memo',
    body: '오늘도 수고했어. 푹 쉬어!',
    counterpartNickname: '민수',
    createdAtLabel: '방금 전',
    isUnread: true,
  },
  {
    id: 'fixture-note-yujin-1',
    direction: 'received',
    type: 'greeting',
    body: '내일 점심에 산책할래?',
    counterpartNickname: '유진',
    createdAtLabel: '어제',
    isUnread: false,
  },
  {
    id: 'fixture-note-narin-1',
    direction: 'sent',
    type: 'memo',
    body: '회의 끝나면 연락 줘.',
    counterpartNickname: '민수',
    createdAtLabel: '오늘 18:20',
    isUnread: false,
  },
];
