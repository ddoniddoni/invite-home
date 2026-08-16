import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { HouseWindowMember } from '@/features/houses/types';
import { activityStateLabels, moodKeyLabels } from '@/features/status/presentation';
import { colors, moodColors, radius, spacing } from '@/theme/tokens';
import { fontSize, fontWeight, lineHeight } from '@/theme/typography';

export type ResidentDetailModalProps = {
  member: HouseWindowMember;
  onClose: () => void;
  onPressNote: (memberId: string) => void;
};

function getInitial(nickname: string) {
  return nickname.trim().slice(0, 1) || '?';
}

export function ResidentDetailModal({ member, onClose, onPressNote }: ResidentDetailModalProps) {
  const isActiveMember = member.status === 'active';
  const moodName = member.moodKey ? moodKeyLabels[member.moodKey] : '기분 미설정';
  const moodDescription = member.moodLabel ? `${moodName} · ${member.moodLabel}` : moodName;
  const noteDescription = isActiveMember
    ? '짧은 안부를 남겨보세요.'
    : '입주가 완료되면 메모를 남길 수 있어요.';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.headerTitle}>입주민 상세</Text>
        <Pressable
          accessibilityLabel="입주민 상세 닫기"
          accessibilityRole="button"
          hitSlop={spacing.sm}
          onPress={onClose}
          style={({ pressed }) => [styles.closeButton, pressed ? styles.pressed : null]}
        >
          <Text style={styles.closeButtonText}>닫기</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View
            accessibilityLabel={`${moodDescription} 기분색`}
            accessible
            style={[
              styles.avatar,
              { backgroundColor: member.moodKey ? moodColors[member.moodKey] : colors.border },
            ]}
          >
            <Text style={styles.avatarText}>{getInitial(member.nickname)}</Text>
          </View>
          <View style={styles.profileText}>
            <Text style={styles.nickname}>{member.nickname}</Text>
            <Text style={styles.memberState}>{isActiveMember ? '함께 사는 중' : '입주 대기 중'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>지금</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>활동 상태</Text>
            <Text style={styles.detailValue}>{activityStateLabels[member.activityState]}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>전등</Text>
            <Text style={styles.detailValue}>{member.lightOn ? '켜져 있어요' : '꺼져 있어요'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>오늘의 기분</Text>
          <View style={styles.moodRow}>
            <View
              accessibilityLabel={moodDescription}
              accessible
              style={[
                styles.moodSwatch,
                { backgroundColor: member.moodKey ? moodColors[member.moodKey] : colors.border },
              ]}
            />
            <Text style={styles.moodText}>{moodDescription}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>한 줄 상태</Text>
          <Text style={styles.statusMessage}>{member.statusMessage || '남긴 상태 메시지가 없어요.'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>공개된 오늘 일정</Text>
          {member.publicTodaySchedules.length > 0 ? (
            <View style={styles.scheduleList}>
              {member.publicTodaySchedules.map((schedule) => (
                <View key={schedule.id} style={styles.scheduleRow}>
                  <Text style={styles.scheduleTime}>{schedule.timeLabel}</Text>
                  <Text style={styles.scheduleTitle}>{schedule.title}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptySchedule}>공개한 오늘 일정이 없어요.</Text>
          )}
        </View>

        <Pressable
          accessibilityHint={noteDescription}
          accessibilityLabel={`${member.nickname}에게 메모 남기기`}
          accessibilityRole="button"
          accessibilityState={{ disabled: !isActiveMember }}
          disabled={!isActiveMember}
          onPress={() => onPressNote(member.id)}
          style={({ pressed }) => [
            styles.noteButton,
            !isActiveMember ? styles.noteButtonDisabled : null,
            pressed && isActiveMember ? styles.pressed : null,
          ]}
        >
          <Text style={[styles.noteButtonTitle, !isActiveMember ? styles.noteButtonTitleDisabled : null]}>
            메모 남기기
          </Text>
          <Text style={[styles.noteButtonDescription, !isActiveMember ? styles.noteButtonDescriptionDisabled : null]}>
            {noteDescription}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundDay,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.body,
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  closeButtonText: {
    color: colors.accentPlum,
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.body,
  },
  content: {
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  avatar: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  avatarText: {
    color: colors.textPrimary,
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.title,
  },
  profileText: {
    flex: 1,
    gap: spacing.xs,
  },
  nickname: {
    color: colors.textPrimary,
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.title,
  },
  memberState: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.caption,
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    color: colors.accentPlum,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.8,
    lineHeight: lineHeight.caption,
  },
  detailRow: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  detailTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
  },
  detailValue: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.body,
  },
  moodRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  moodSwatch: {
    borderColor: colors.windowFrame,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 20,
    width: 20,
  },
  moodText: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.body,
  },
  statusMessage: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
  },
  scheduleList: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  scheduleRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  scheduleTime: {
    color: colors.accentPlum,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.caption,
  },
  scheduleTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.body,
  },
  emptySchedule: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
  },
  noteButton: {
    backgroundColor: colors.accentPlum,
    borderRadius: radius.md,
    gap: spacing.xs,
    minHeight: 72,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  noteButtonDisabled: {
    backgroundColor: colors.border,
  },
  noteButtonTitle: {
    color: colors.textOnDark,
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.body,
  },
  noteButtonTitleDisabled: {
    color: colors.textSecondary,
  },
  noteButtonDescription: {
    color: colors.textOnDark,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
  },
  noteButtonDescriptionDisabled: {
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.74,
  },
});
