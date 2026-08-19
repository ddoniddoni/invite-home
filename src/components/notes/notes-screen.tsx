import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { EmptyState } from '@/components/ui/empty-state';
import { noteTypeLabels } from '@/features/notes/presentation';
import type { NoteDirection, NotePreview } from '@/features/notes/types';
import { colors, radius, spacing } from '@/theme/tokens';
import { fontSize, fontWeight, lineHeight } from '@/theme/typography';

export type NotesScreenProps = {
  onReadNote?: (noteId: string) => void;
  notes: readonly NotePreview[];
};

const directions: readonly NoteDirection[] = ['received', 'sent'];

const directionLabels: Record<NoteDirection, string> = {
  received: '받은 메모',
  sent: '보낸 메모',
};

function EnvelopeIcon({ color }: { color: string }) {
  return (
    <Svg accessible={false} height={20} viewBox="0 0 24 24" width={20}>
      <Path d="M4.5 6.5h15v11h-15z" fill="none" stroke={color} strokeLinejoin="round" strokeWidth="1.7" />
      <Path d="m5 7 7 5.6L19 7" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </Svg>
  );
}

type NoteCardProps = {
  direction: NoteDirection;
  note: NotePreview;
  onReadNote?: (noteId: string) => void;
};

function NoteCard({ direction, note, onReadNote }: NoteCardProps) {
  const typeLabel = noteTypeLabels[note.type];
  const sender = direction === 'received' ? note.counterpartNickname : `나 → ${note.counterpartNickname}`;
  const isMemo = note.type === 'memo';
  const canMarkRead = direction === 'received' && note.isUnread && onReadNote !== undefined;
  const accessibilityLabel = `${note.counterpartNickname}의 ${typeLabel}. ${note.isUnread ? '읽지 않음.' : '읽음.'} ${note.body}`;

  const content = (
    <>
      <View style={styles.noteMeta}>
        <View style={styles.senderGroup}>
          <View style={[styles.noteIcon, isMemo ? styles.noteIconMemo : styles.noteIconGreeting]}>
            <EnvelopeIcon color={isMemo ? colors.note : colors.accentPlum} />
          </View>
          <View style={styles.senderCopy}>
            <Text style={styles.noteSender}>{sender}</Text>
            <Text style={styles.noteType}>{typeLabel}</Text>
          </View>
        </View>
        <Text style={styles.noteTime}>{note.createdAtLabel}</Text>
      </View>
      <Text style={styles.noteBody}>{note.body}</Text>
      <View style={styles.noteFooter}>
        <View style={styles.noteRule} />
        <Text style={[styles.readState, note.isUnread ? styles.unreadState : null]}>
          {note.isUnread ? '읽지 않음' : '읽음'}
        </Text>
      </View>
    </>
  );

  if (canMarkRead) {
    return (
      <Pressable
        accessibilityHint="메모를 열어 읽음으로 표시합니다."
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onPress={() => onReadNote(note.id)}
        style={({ pressed }) => [styles.noteCard, styles.unreadNoteCard, pressed ? styles.pressed : null]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessible
      style={[styles.noteCard, note.isUnread ? styles.unreadNoteCard : null]}
    >
      {content}
    </View>
  );
}

export function NotesScreen({ notes, onReadNote }: NotesScreenProps) {
  const [direction, setDirection] = useState<NoteDirection>('received');
  const visibleNotes = notes.filter((note) => note.direction === direction);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <EnvelopeIcon color={colors.textPrimary} />
          </View>
          <Text accessibilityRole="header" style={styles.title}>메모</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.intro}>
          <Text style={styles.description}>길지 않아도 서로의 하루에 닿을 수 있어요.</Text>
        </View>

        <View accessibilityLabel="메모함 선택" accessibilityRole="tablist" style={styles.segmentedControl}>
          {directions.map((nextDirection) => {
            const isSelected = direction === nextDirection;
            const label = directionLabels[nextDirection];

            return (
              <Pressable
                accessibilityLabel={label}
                accessibilityRole="tab"
                accessibilityState={{ selected: isSelected }}
                key={nextDirection}
                onPress={() => setDirection(nextDirection)}
                style={({ pressed }) => [
                  styles.segmentButton,
                  isSelected ? styles.segmentButtonSelected : null,
                  pressed ? styles.pressed : null,
                ]}
              >
                <Text style={[styles.segmentText, isSelected ? styles.segmentTextSelected : null]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        {visibleNotes.length === 0 ? (
          <EmptyState
            description={direction === 'received' ? '첫 메모를 기다리고 있어요.' : '아직 보낸 메모가 없어요.'}
            title={direction === 'received' ? '받은 메모가 없어요.' : '보낸 메모가 없어요.'}
          />
        ) : (
          <View style={styles.noteList}>
            {visibleNotes.map((note) => (
              <NoteCard direction={direction} key={note.id} note={note} onReadNote={onReadNote} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundDay,
    flex: 1,
  },
  content: {
    gap: spacing.xl,
    paddingBottom: spacing.section,
    paddingHorizontal: spacing.page,
    paddingTop: spacing.sm,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 36,
  },
  headerIcon: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.body,
  },
  headerSpacer: {
    width: 32,
  },
  intro: {
    marginTop: -spacing.sm,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
  },
  segmentedControl: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    padding: spacing.xs,
  },
  segmentButton: {
    alignItems: 'center',
    borderRadius: radius.sm,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  segmentButtonSelected: {
    backgroundColor: colors.surface,
    borderColor: colors.noteBorder,
    borderWidth: 1,
  },
  segmentText: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.caption,
  },
  segmentTextSelected: {
    color: colors.textPrimary,
  },
  noteList: {
    gap: spacing.md,
  },
  noteCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.md,
    minHeight: 132,
    padding: spacing.lg,
  },
  unreadNoteCard: {
    backgroundColor: colors.noteUnreadSurface,
    borderColor: colors.noteBorder,
  },
  noteMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  senderGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 0,
  },
  noteIcon: {
    alignItems: 'center',
    borderRadius: radius.sm,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  noteIconMemo: {
    backgroundColor: colors.noteSoft,
    borderColor: colors.noteBorder,
    borderWidth: 1,
  },
  noteIconGreeting: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderWidth: 1,
  },
  senderCopy: {
    gap: 1,
    marginLeft: spacing.sm,
  },
  noteSender: {
    color: colors.textPrimary,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.caption,
  },
  noteTime: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
  },
  noteBody: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
  },
  noteFooter: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  noteRule: {
    backgroundColor: colors.border,
    flex: 1,
    height: 1,
    marginRight: spacing.sm,
  },
  noteType: {
    color: colors.accentPlum,
    fontSize: fontSize.micro,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.micro,
  },
  readState: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.caption,
  },
  unreadState: {
    color: colors.note,
    fontWeight: fontWeight.bold,
  },
  pressed: {
    opacity: 0.74,
  },
});
