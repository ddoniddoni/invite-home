import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { activityStateLabels } from '@/features/status/presentation';
import { formatWeekdays } from '@/features/schedules/presentation';
import type { ScheduleFormValues } from '@/features/schedules/schedule.schema';
import type { RepeatingSchedulePreview, TodaySchedulePreview } from '@/features/schedules/types';
import { colors, radius, spacing } from '@/theme/tokens';
import { fontSize, fontWeight, lineHeight } from '@/theme/typography';

import { ScheduleComposer } from './schedule-composer';

export type ScheduleScreenProps = {
  repeatingSchedules: readonly RepeatingSchedulePreview[];
  todaySchedules: readonly TodaySchedulePreview[];
};

export function ScheduleScreen({ repeatingSchedules, todaySchedules }: ScheduleScreenProps) {
  const [schedules, setSchedules] = useState<readonly RepeatingSchedulePreview[]>(repeatingSchedules);
  const [isComposerVisible, setIsComposerVisible] = useState(false);
  const canCreateSchedule = schedules.length < 20;

  const toggleSchedule = (scheduleId: string) => {
    setSchedules((currentSchedules) =>
      currentSchedules.map((schedule) =>
        schedule.id === scheduleId ? { ...schedule, isEnabled: !schedule.isEnabled } : schedule,
      ),
    );
  };

  const createSchedule = async (value: ScheduleFormValues) => {
    setSchedules((currentSchedules) => {
      const priority = currentSchedules.reduce(
        (highestPriority, schedule) => Math.max(highestPriority, schedule.priority),
        0,
      ) + 1;

      return [
        ...currentSchedules,
        {
          id: `fixture-repeat-${priority}`,
          title: value.label,
          daysOfWeek: value.daysOfWeek,
          startTime: value.startTime,
          endTime: value.endTime,
          weekdayLabel: formatWeekdays(value.daysOfWeek),
          timeLabel: `${value.startTime}–${value.endTime}`,
          activityState: value.activityState,
          lightOn: value.lightOn,
          isEnabled: value.enabled,
          priority,
        },
      ];
    });
    setIsComposerVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>YOUR RHYTHM</Text>
            <Text accessibilityRole="header" style={styles.title}>스케줄</Text>
            <Text style={styles.description}>반복되는 생활 리듬이 창문의 상태를 정해요.</Text>
          </View>
          <Pressable
            accessibilityLabel="반복 스케줄 추가"
            accessibilityRole="button"
            accessibilityState={{ disabled: !canCreateSchedule }}
            disabled={!canCreateSchedule}
            onPress={() => setIsComposerVisible(true)}
            style={({ pressed }) => [
              styles.addButton,
              !canCreateSchedule ? styles.addButtonDisabled : null,
              pressed && canCreateSchedule ? styles.pressed : null,
            ]}
          >
            <Text style={[styles.addButtonText, !canCreateSchedule ? styles.addButtonTextDisabled : null]}>추가</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>반복 스케줄</Text>
          <Text style={styles.sectionDescription}>겹치는 시간대는 우선순위 규칙에 따라 표시돼요.</Text>
          {!canCreateSchedule ? <Text style={styles.limitMessage}>반복 스케줄은 최대 20개까지 만들 수 있어요.</Text> : null}
          <View style={styles.scheduleList}>
            {schedules.map((schedule) => (
              <View key={schedule.id} style={styles.scheduleCard}>
                <View style={styles.scheduleCopy}>
                  <Text style={styles.scheduleTitle}>{schedule.title}</Text>
                  <Text style={styles.scheduleDetail}>{schedule.weekdayLabel} · {schedule.timeLabel}</Text>
                  <Text style={styles.scheduleState}>
                    {activityStateLabels[schedule.activityState]} · 전등 {schedule.lightOn ? '켜짐' : '꺼짐'}
                  </Text>
                </View>
                <Switch
                  accessibilityLabel={`${schedule.title} ${schedule.isEnabled ? '끄기' : '켜기'}`}
                  accessibilityRole="switch"
                  onValueChange={() => toggleSchedule(schedule.id)}
                  thumbColor={colors.surface}
                  trackColor={{ false: colors.border, true: colors.accentPlum }}
                  value={schedule.isEnabled}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>오늘 일정</Text>
          <View style={styles.todayList}>
            {todaySchedules.map((schedule) => (
              <View key={schedule.id} style={styles.todayRow}>
                <Text style={styles.todayTime}>{schedule.timeLabel}</Text>
                <Text style={styles.todayTitle}>{schedule.title}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <Modal
        animationType="none"
        onRequestClose={() => setIsComposerVisible(false)}
        presentationStyle="pageSheet"
        visible={isComposerVisible}
      >
        {isComposerVisible ? (
          <ScheduleComposer onClose={() => setIsComposerVisible(false)} onSave={createSchedule} />
        ) : null}
      </Modal>
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
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
  },
  headerCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  eyebrow: {
    color: colors.success,
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
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.accentPlum,
    borderRadius: radius.pill,
    justifyContent: 'center',
    minHeight: 40,
    minWidth: 56,
  },
  addButtonDisabled: {
    backgroundColor: colors.border,
  },
  addButtonText: {
    color: colors.textOnDark,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.caption,
  },
  addButtonTextDisabled: {
    color: colors.textSecondary,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.title,
  },
  sectionDescription: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
  },
  limitMessage: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
  },
  scheduleList: {
    gap: spacing.sm,
  },
  scheduleCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 96,
    padding: spacing.md,
  },
  scheduleCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  scheduleTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.body,
  },
  scheduleDetail: {
    color: colors.accentPlum,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.caption,
  },
  scheduleState: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
  },
  todayList: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  todayRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  todayTime: {
    color: colors.success,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.caption,
  },
  todayTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.body,
  },
  pressed: {
    opacity: 0.74,
  },
});
