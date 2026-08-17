import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { EmptyState } from '@/components/ui/empty-state';
import type { RepeatingScheduleUpdater } from '@/features/schedules/local-schedule-store';
import { activityStateLabels } from '@/features/status/presentation';
import { formatWeekdays, todayScheduleVisibilityLabels } from '@/features/schedules/presentation';
import type { ScheduleFormValues } from '@/features/schedules/schedule.schema';
import type { TodayScheduleFormValues } from '@/features/schedules/today-schedule.schema';
import type { RepeatingSchedulePreview, TodaySchedulePreview } from '@/features/schedules/types';
import { colors, radius, spacing } from '@/theme/tokens';
import { fontSize, fontWeight, lineHeight } from '@/theme/typography';

import { ScheduleComposer } from './schedule-composer';
import { TodayScheduleComposer } from './today-schedule-composer';

type Composer =
  | { type: 'repeat-create' }
  | { scheduleId: string; type: 'repeat-edit' }
  | { type: 'today-create' }
  | { scheduleId: string; type: 'today-edit' }
  | null;

type DeletionTarget =
  | { schedule: RepeatingSchedulePreview; type: 'repeat' }
  | { schedule: TodaySchedulePreview; type: 'today' }
  | null;

function CalendarIcon({ color }: { color: string }) {
  return (
    <Svg accessible={false} height={20} viewBox="0 0 24 24" width={20}>
      <Rect fill="none" height="15" rx="2" stroke={color} strokeWidth="1.7" width="15" x="4.5" y="5.5" />
      <Path d="M8 3.5v4M16 3.5v4M4.5 10h15" fill="none" stroke={color} strokeLinecap="round" strokeWidth="1.7" />
    </Svg>
  );
}

function toScheduleFormValues(schedule: RepeatingSchedulePreview): ScheduleFormValues {
  return {
    label: schedule.title,
    daysOfWeek: [...schedule.daysOfWeek],
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    activityState: schedule.activityState,
    lightOn: schedule.lightOn,
    enabled: schedule.isEnabled,
  };
}

function toTodayScheduleFormValues(schedule: TodaySchedulePreview): TodayScheduleFormValues {
  return {
    title: schedule.title,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    visibility: schedule.visibility,
  };
}

export type ScheduleScreenProps = {
  onRepeatingSchedulesChange?: (updater: RepeatingScheduleUpdater) => void;
  repeatingSchedules: readonly RepeatingSchedulePreview[];
  todaySchedules: readonly TodaySchedulePreview[];
};

export function ScheduleScreen({ onRepeatingSchedulesChange, repeatingSchedules, todaySchedules }: ScheduleScreenProps) {
  const [localSchedules, setLocalSchedules] = useState<readonly RepeatingSchedulePreview[]>(repeatingSchedules);
  const [todayItems, setTodayItems] = useState<readonly TodaySchedulePreview[]>(todaySchedules);
  const [composer, setComposer] = useState<Composer>(null);
  const [deletionTarget, setDeletionTarget] = useState<DeletionTarget>(null);
  const schedules = onRepeatingSchedulesChange ? repeatingSchedules : localSchedules;
  const canCreateSchedule = schedules.length < 20;
  const canCreateTodaySchedule = todayItems.length < 100;
  const editingSchedule = composer?.type === 'repeat-edit'
    ? schedules.find((schedule) => schedule.id === composer.scheduleId) ?? null
    : null;
  const editingTodaySchedule = composer?.type === 'today-edit'
    ? todayItems.find((schedule) => schedule.id === composer.scheduleId) ?? null
    : null;

  const updateSchedules = (updater: RepeatingScheduleUpdater) => {
    if (onRepeatingSchedulesChange) {
      onRepeatingSchedulesChange(updater);
      return;
    }

    setLocalSchedules(updater);
  };

  const toggleSchedule = (scheduleId: string) => {
    updateSchedules((currentSchedules) =>
      currentSchedules.map((schedule) =>
        schedule.id === scheduleId ? { ...schedule, isEnabled: !schedule.isEnabled } : schedule,
      ),
    );
  };

  const createSchedule = async (value: ScheduleFormValues) => {
    updateSchedules((currentSchedules) => {
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
    setComposer(null);
  };

  const createTodaySchedule = async (value: TodayScheduleFormValues) => {
    setTodayItems((currentSchedules) => [
      ...currentSchedules,
      {
        id: `fixture-today-${currentSchedules.length + 1}`,
        title: value.title,
        startTime: value.startTime,
        endTime: value.endTime,
        timeLabel: `${value.startTime}–${value.endTime}`,
        visibility: value.visibility,
      },
    ]);
    setComposer(null);
  };

  const updateSchedule = async (scheduleId: string, value: ScheduleFormValues) => {
    updateSchedules((currentSchedules) =>
      currentSchedules.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              title: value.label,
              daysOfWeek: value.daysOfWeek,
              startTime: value.startTime,
              endTime: value.endTime,
              weekdayLabel: formatWeekdays(value.daysOfWeek),
              timeLabel: `${value.startTime}–${value.endTime}`,
              activityState: value.activityState,
              lightOn: value.lightOn,
              isEnabled: value.enabled,
            }
          : schedule,
      ),
    );
    setComposer(null);
  };

  const updateTodaySchedule = async (scheduleId: string, value: TodayScheduleFormValues) => {
    setTodayItems((currentSchedules) =>
      currentSchedules.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              title: value.title,
              startTime: value.startTime,
              endTime: value.endTime,
              timeLabel: `${value.startTime}–${value.endTime}`,
              visibility: value.visibility,
            }
          : schedule,
      ),
    );
    setComposer(null);
  };

  const confirmDeletion = () => {
    if (!deletionTarget) {
      return;
    }

    if (deletionTarget.type === 'repeat') {
      updateSchedules((currentSchedules) =>
        currentSchedules.filter((schedule) => schedule.id !== deletionTarget.schedule.id),
      );
    } else {
      setTodayItems((currentSchedules) =>
        currentSchedules.filter((schedule) => schedule.id !== deletionTarget.schedule.id),
      );
    }

    setDeletionTarget(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <CalendarIcon color={colors.textPrimary} />
          </View>
          <Text accessibilityRole="header" style={styles.title}>스케줄</Text>
          <Pressable
            accessibilityLabel="반복 스케줄 추가"
            accessibilityRole="button"
            accessibilityState={{ disabled: !canCreateSchedule }}
            disabled={!canCreateSchedule}
            onPress={() => setComposer({ type: 'repeat-create' })}
            style={({ pressed }) => [
              styles.addButton,
              !canCreateSchedule ? styles.addButtonDisabled : null,
              pressed && canCreateSchedule ? styles.pressed : null,
            ]}
          >
            <Text style={[styles.addButtonText, !canCreateSchedule ? styles.addButtonTextDisabled : null]}>+</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View>
              <Text style={styles.sectionTitle}>오늘의 일정</Text>
              <Text style={styles.sectionDescription}>약속은 필요한 만큼만, 가볍게 남겨요.</Text>
            </View>
            <Pressable
              accessibilityLabel="오늘 일정 추가"
              accessibilityRole="button"
              accessibilityState={{ disabled: !canCreateTodaySchedule }}
              disabled={!canCreateTodaySchedule}
              onPress={() => setComposer({ type: 'today-create' })}
              style={({ pressed }) => [
                styles.todayAddButton,
                !canCreateTodaySchedule ? styles.todayAddButtonDisabled : null,
                pressed && canCreateTodaySchedule ? styles.pressed : null,
              ]}
            >
              <Text style={[styles.todayAddButtonText, !canCreateTodaySchedule ? styles.todayAddButtonTextDisabled : null]}>
                + 일정
              </Text>
            </Pressable>
          </View>
          {!canCreateTodaySchedule ? <Text style={styles.limitMessage}>오늘 일정은 최대 100개까지 만들 수 있어요.</Text> : null}
          {todayItems.length === 0 ? (
            <EmptyState
              description="일정 추가로 오늘의 약속을 남겨 보세요."
              title="오늘 일정이 없어요"
            />
          ) : (
            <View style={styles.todayList}>
              {todayItems.map((schedule) => (
                <View key={schedule.id} style={styles.todayRow}>
                  <View style={styles.todayCopy}>
                    <Text style={styles.todayTime}>{schedule.timeLabel}</Text>
                    <Text style={styles.todayTitle}>{schedule.title}</Text>
                  </View>
                  <View style={styles.todayActions}>
                    <Text accessibilityLabel={`${todayScheduleVisibilityLabels[schedule.visibility]} 일정`} style={styles.visibilityLabel}>
                      {schedule.visibility === 'house' ? '우리 집' : '나만'}
                    </Text>
                    <View style={styles.inlineActions}>
                      <Pressable
                        accessibilityLabel={`${schedule.title} 편집`}
                        accessibilityRole="button"
                        onPress={() => setComposer({ scheduleId: schedule.id, type: 'today-edit' })}
                        style={({ pressed }) => [styles.todayEditButton, pressed ? styles.pressed : null]}
                      >
                        <Text style={styles.todayEditButtonText}>편집</Text>
                      </Pressable>
                      <Pressable
                        accessibilityLabel={`${schedule.title} 삭제`}
                        accessibilityRole="button"
                        onPress={() => setDeletionTarget({ schedule, type: 'today' })}
                        style={({ pressed }) => [styles.deleteButton, pressed ? styles.pressed : null]}
                      >
                        <Text style={styles.deleteButtonText}>삭제</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View>
              <Text style={styles.sectionTitle}>반복 규칙</Text>
              <Text style={styles.sectionDescription}>이 시간대가 창문의 상태를 자동으로 바꿔요.</Text>
            </View>
          </View>
          {!canCreateSchedule ? <Text style={styles.limitMessage}>반복 스케줄은 최대 20개까지 만들 수 있어요.</Text> : null}
          {schedules.length === 0 ? (
            <EmptyState
              description="오른쪽 위 추가 버튼으로 생활 리듬을 만들어 보세요."
              title="반복 규칙이 없어요"
            />
          ) : (
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
                  <View style={styles.scheduleActions}>
                    <Pressable
                      accessibilityLabel={`${schedule.title} 편집`}
                      accessibilityRole="button"
                      onPress={() => setComposer({ scheduleId: schedule.id, type: 'repeat-edit' })}
                      style={({ pressed }) => [styles.editButton, pressed ? styles.pressed : null]}
                    >
                      <Text style={styles.editButtonText}>편집</Text>
                    </Pressable>
                    <Switch
                      accessibilityLabel={`${schedule.title} ${schedule.isEnabled ? '끄기' : '켜기'}`}
                      accessibilityRole="switch"
                      onValueChange={() => toggleSchedule(schedule.id)}
                      thumbColor={colors.surface}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      value={schedule.isEnabled}
                    />
                    <Pressable
                      accessibilityLabel={`${schedule.title} 삭제`}
                      accessibilityRole="button"
                      onPress={() => setDeletionTarget({ schedule, type: 'repeat' })}
                      style={({ pressed }) => [styles.deleteButton, pressed ? styles.pressed : null]}
                    >
                      <Text style={styles.deleteButtonText}>삭제</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <Modal
        animationType="none"
        onRequestClose={() => setComposer(null)}
        presentationStyle="pageSheet"
        visible={composer !== null}
      >
        {composer?.type === 'repeat-create' ? (
          <ScheduleComposer
            onClose={() => setComposer(null)}
            onSave={createSchedule}
            overlapSchedules={schedules}
          />
        ) : null}
        {editingSchedule ? (
          <ScheduleComposer
            initialValue={toScheduleFormValues(editingSchedule)}
            onClose={() => setComposer(null)}
            onSave={(value) => updateSchedule(editingSchedule.id, value)}
            overlapSchedules={schedules.filter((schedule) => schedule.id !== editingSchedule.id)}
          />
        ) : null}
        {composer?.type === 'today-create' ? <TodayScheduleComposer onClose={() => setComposer(null)} onSave={createTodaySchedule} /> : null}
        {editingTodaySchedule ? (
          <TodayScheduleComposer
            initialValue={toTodayScheduleFormValues(editingTodaySchedule)}
            onClose={() => setComposer(null)}
            onSave={(value) => updateTodaySchedule(editingTodaySchedule.id, value)}
          />
        ) : null}
      </Modal>
      <Modal
        animationType="fade"
        onRequestClose={() => setDeletionTarget(null)}
        transparent
        visible={deletionTarget !== null}
      >
        {deletionTarget ? (
          <View style={styles.confirmationRoot}>
            <View style={[StyleSheet.absoluteFill, styles.confirmationBackdrop, styles.nonInteractive]} />
            <View style={styles.confirmationCard}>
              <Text accessibilityRole="header" style={styles.confirmationTitle}>일정을 삭제할까요?</Text>
              <Text accessibilityRole="alert" style={styles.confirmationDescription}>
                {deletionTarget.schedule.title}을(를) 삭제하면 되돌릴 수 없어요.
              </Text>
              <View style={styles.confirmationActions}>
                <Pressable
                  accessibilityLabel="삭제 취소"
                  accessibilityRole="button"
                  onPress={() => setDeletionTarget(null)}
                  style={({ pressed }) => [styles.cancelDeleteButton, pressed ? styles.pressed : null]}
                >
                  <Text style={styles.cancelDeleteButtonText}>취소</Text>
                </Pressable>
                <Pressable
                  accessibilityLabel={`${deletionTarget.type === 'repeat' ? '반복 스케줄' : '오늘 일정'} 삭제 확인`}
                  accessibilityRole="button"
                  onPress={confirmDeletion}
                  style={({ pressed }) => [styles.confirmDeleteButton, pressed ? styles.pressed : null]}
                >
                  <Text style={styles.confirmDeleteButtonText}>삭제</Text>
                </Pressable>
              </View>
            </View>
          </View>
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
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    justifyContent: 'center',
    minHeight: 32,
    minWidth: 32,
  },
  addButtonDisabled: {
    backgroundColor: colors.border,
  },
  addButtonText: {
    color: colors.textOnDark,
    fontSize: fontSize.title,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.title,
  },
  addButtonTextDisabled: {
    color: colors.textSecondary,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.body,
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
    gap: spacing.sm,
    minHeight: 104,
    padding: spacing.lg,
  },
  scheduleCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  scheduleActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  editButton: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderRadius: radius.sm,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  editButtonText: {
    color: colors.primary,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.caption,
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 40,
  },
  deleteButtonText: {
    color: colors.danger,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.caption,
  },
  scheduleTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.body,
  },
  scheduleDetail: {
    color: colors.primary,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.caption,
  },
  scheduleState: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
  },
  todayList: {
    gap: spacing.sm,
  },
  todayRow: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 96,
    padding: spacing.lg,
  },
  todayCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  todayActions: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  inlineActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  todayTime: {
    color: colors.primary,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.caption,
  },
  todayTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.body,
  },
  todayAddButton: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderRadius: radius.sm,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: spacing.md,
  },
  todayAddButtonDisabled: {
    borderColor: colors.border,
  },
  todayAddButtonText: {
    color: colors.primary,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.caption,
  },
  todayAddButtonTextDisabled: {
    color: colors.textSecondary,
  },
  todayEditButton: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderRadius: radius.sm,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  todayEditButtonText: {
    color: colors.primary,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.caption,
  },
  visibilityLabel: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    color: colors.primary,
    fontSize: fontSize.micro,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.micro,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  confirmationRoot: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  confirmationBackdrop: {
    backgroundColor: colors.backgroundNight,
    opacity: 0.58,
  },
  nonInteractive: {
    pointerEvents: 'none',
  },
  confirmationCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  confirmationTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.title,
  },
  confirmationDescription: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
  },
  confirmationActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  cancelDeleteButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelDeleteButtonText: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.body,
  },
  confirmDeleteButton: {
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: radius.md,
    flex: 1,
    justifyContent: 'center',
    minHeight: 48,
  },
  confirmDeleteButtonText: {
    color: colors.textOnDark,
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.body,
  },
  pressed: {
    opacity: 0.74,
  },
});
