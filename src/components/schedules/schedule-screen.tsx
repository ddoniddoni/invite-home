import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { activityStateLabels } from '@/features/status/presentation';
import type { RepeatingSchedulePreview, TodaySchedulePreview } from '@/features/schedules/types';
import { colors, radius, spacing } from '@/theme/tokens';
import { fontSize, fontWeight, lineHeight } from '@/theme/typography';

export type ScheduleScreenProps = {
  repeatingSchedules: readonly RepeatingSchedulePreview[];
  todaySchedules: readonly TodaySchedulePreview[];
};

export function ScheduleScreen({ repeatingSchedules, todaySchedules }: ScheduleScreenProps) {
  const [schedules, setSchedules] = useState<readonly RepeatingSchedulePreview[]>(repeatingSchedules);

  const toggleSchedule = (scheduleId: string) => {
    setSchedules((currentSchedules) =>
      currentSchedules.map((schedule) =>
        schedule.id === scheduleId ? { ...schedule, isEnabled: !schedule.isEnabled } : schedule,
      ),
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>YOUR RHYTHM</Text>
          <Text accessibilityRole="header" style={styles.title}>스케줄</Text>
          <Text style={styles.description}>반복되는 생활 리듬이 창문의 상태를 정해요.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>반복 스케줄</Text>
          <Text style={styles.sectionDescription}>겹치는 시간대는 우선순위 규칙에 따라 표시돼요.</Text>
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
    gap: spacing.xs,
    paddingTop: spacing.sm,
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
});
