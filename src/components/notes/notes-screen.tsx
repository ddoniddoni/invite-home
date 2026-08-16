import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/ui/empty-state';
import { noteTypeLabels } from '@/features/notes/presentation';
import type { NoteDirection, NotePreview } from '@/features/notes/types';
import { colors, radius, spacing } from '@/theme/tokens';
import { fontSize, fontWeight, lineHeight } from '@/theme/typography';

export type NotesScreenProps = {
  notes: readonly NotePreview[];
};

const directions: readonly NoteDirection[] = ['received', 'sent'];

const directionLabels: Record<NoteDirection, string> = {
  received: '받은 메모',
  sent: '보낸 메모',
};

export function NotesScreen({ notes }: NotesScreenProps) {
  const [direction, setDirection] = useState<NoteDirection>('received');
  const visibleNotes = notes.filter((note) => note.direction === direction);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SMALL NOTES</Text>
          <Text accessibilityRole="header" style={styles.title}>메모</Text>
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
              <View
                accessibilityLabel={`${note.counterpartNickname}의 ${noteTypeLabels[note.type]}. ${note.isUnread ? '읽지 않음.' : '읽음.'} ${note.body}`}
                accessible
                key={note.id}
                style={[styles.noteCard, note.isUnread ? styles.unreadNoteCard : null]}
              >
                <View style={styles.noteMeta}>
                  <Text style={styles.noteSender}>
                    {direction === 'received' ? note.counterpartNickname : `나 → ${note.counterpartNickname}`}
                  </Text>
                  <Text style={styles.noteTime}>{note.createdAtLabel}</Text>
                </View>
                <Text style={styles.noteBody}>{note.body}</Text>
                <View style={styles.noteFooter}>
                  <Text style={styles.noteType}>{noteTypeLabels[note.type]}</Text>
                  <Text style={[styles.readState, note.isUnread ? styles.unreadState : null]}>
                    {note.isUnread ? '읽지 않음' : '읽음'}
                  </Text>
                </View>
              </View>
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
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  eyebrow: {
    color: colors.note,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.1,
    lineHeight: lineHeight.caption,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.display,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
  },
  segmentedControl: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    padding: spacing.xs,
  },
  segmentButton: {
    alignItems: 'center',
    borderRadius: radius.pill,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  segmentButtonSelected: {
    backgroundColor: colors.note,
  },
  segmentText: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.body,
  },
  segmentTextSelected: {
    color: colors.textOnDark,
  },
  noteList: {
    gap: spacing.md,
  },
  noteCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  unreadNoteCard: {
    borderColor: colors.note,
    borderLeftWidth: 4,
  },
  noteMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noteSender: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.body,
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
    justifyContent: 'space-between',
  },
  noteType: {
    color: colors.accentPlum,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.caption,
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
