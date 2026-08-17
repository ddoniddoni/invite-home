import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { activityStateLabels } from '@/features/status/presentation';
import { findOverlappingRepeatingSchedules } from '@/features/schedules/schedule-overlap';
import { weekdayLabels, weekdayOrder } from '@/features/schedules/presentation';
import {
  scheduleFormSchema,
  type ScheduleFormValues,
} from '@/features/schedules/schedule.schema';
import type { RepeatingSchedulePreview } from '@/features/schedules/types';
import { activityStateValues } from '@/features/status/status.schema';
import { colors, radius, spacing } from '@/theme/tokens';
import { fontSize, fontWeight, lineHeight } from '@/theme/typography';

export type ScheduleComposerProps = {
  initialValue?: ScheduleFormValues;
  onClose: () => void;
  onSave: (value: ScheduleFormValues) => Promise<void>;
  overlapSchedules?: readonly RepeatingSchedulePreview[];
};

const initialSchedule: ScheduleFormValues = {
  label: '',
  daysOfWeek: [1, 2, 3, 4, 5],
  startTime: '09:00',
  endTime: '18:00',
  activityState: 'work',
  lightOn: true,
  enabled: true,
};

function FieldError({ message }: { message?: string }) {
  return message ? <Text accessibilityRole="alert" style={styles.fieldError}>{message}</Text> : null;
}

export function ScheduleComposer({ initialValue, onClose, onSave, overlapSchedules }: ScheduleComposerProps) {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<ScheduleFormValues>({
    defaultValues: initialValue ?? initialSchedule,
    resolver: zodResolver(scheduleFormSchema),
  });
  const isEditing = initialValue !== undefined;
  const [daysOfWeek, startTime, endTime, lightOn, enabled] = useWatch({
    control,
    defaultValue: initialSchedule,
    name: ['daysOfWeek', 'startTime', 'endTime', 'lightOn', 'enabled'] as const,
  });
  const submitSchedule = (value: ScheduleFormValues) => onSave(value);
  const overlaps = findOverlappingRepeatingSchedules(
    { daysOfWeek, endTime, isEnabled: enabled, startTime },
    overlapSchedules ?? [],
  );
  const overlapTitle = overlaps.length === 0
    ? '겹쳐도 저장할 수 있어요'
    : overlaps.length === 1
      ? `${overlaps[0].title}과 시간이 겹쳐요`
      : `${overlaps[0].title} 외 ${overlaps.length - 1}개와 시간이 겹쳐요`;
  const priorityDescription = isEditing
    ? '겹치는 시간대에는 더 높은 우선순위가 적용돼요. 수정해도 기존 우선순위는 유지돼요.'
    : '겹치는 시간대에는 더 높은 우선순위가 적용돼요. 새 규칙에는 가장 높은 우선순위가 자동으로 매겨져요.';

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardAvoidingView}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>{isEditing ? 'REFINE RHYTHM' : 'NEW RHYTHM'}</Text>
            <Text accessibilityRole="header" style={styles.title}>{isEditing ? '반복 스케줄 수정' : '반복 스케줄'}</Text>
          </View>
          <Pressable
            accessibilityLabel="스케줄 작성 닫기"
            accessibilityRole="button"
            accessibilityState={{ disabled: isSubmitting }}
            disabled={isSubmitting}
            hitSlop={spacing.sm}
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, pressed && !isSubmitting ? styles.pressed : null]}
          >
            <Text style={[styles.closeButtonText, isSubmitting ? styles.closeButtonTextDisabled : null]}>닫기</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>이름</Text>
            <Controller
              control={control}
              name="label"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  accessibilityLabel="스케줄 이름"
                  editable={!isSubmitting}
                  maxLength={20}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="예: 업무 시간"
                  placeholderTextColor={colors.textSecondary}
                  style={styles.textInput}
                  value={value}
                />
              )}
            />
            <FieldError message={errors.label?.message} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>반복 요일</Text>
            <Controller
              control={control}
              name="daysOfWeek"
              render={({ field: { onChange, value } }) => (
                <View accessibilityLabel="반복 요일 선택" style={styles.weekdayGrid}>
                  {weekdayOrder.map((weekday) => {
                    const isSelected = value.includes(weekday);

                    return (
                      <Pressable
                        accessibilityLabel={`${weekdayLabels[weekday]}요일`}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: isSelected }}
                        key={weekday}
                        onPress={() =>
                          onChange(
                            isSelected
                              ? value.filter((selectedWeekday) => selectedWeekday !== weekday)
                              : [...value, weekday],
                          )
                        }
                        style={({ pressed }) => [
                          styles.weekdayButton,
                          isSelected ? styles.weekdayButtonSelected : null,
                          pressed ? styles.pressed : null,
                        ]}
                      >
                        <Text style={[styles.weekdayText, isSelected ? styles.weekdayTextSelected : null]}>
                          {weekdayLabels[weekday]}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            />
            <FieldError message={errors.daysOfWeek?.message} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>시간</Text>
            <View style={styles.timeRow}>
              <Controller
                control={control}
                name="startTime"
                render={({ field: { onBlur, onChange, value } }) => (
                  <TextInput
                    accessibilityLabel="시작 시각"
                    editable={!isSubmitting}
                    inputMode="numeric"
                    maxLength={5}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="09:00"
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.textInput, styles.timeInput]}
                    value={value}
                  />
                )}
              />
              <Text style={styles.timeSeparator}>–</Text>
              <Controller
                control={control}
                name="endTime"
                render={({ field: { onBlur, onChange, value } }) => (
                  <TextInput
                    accessibilityLabel="종료 시각"
                    editable={!isSubmitting}
                    inputMode="numeric"
                    maxLength={5}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="18:00"
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.textInput, styles.timeInput]}
                    value={value}
                  />
                )}
              />
            </View>
            <Text style={styles.helperText}>종료 시각이 더 이르면 자정 넘어까지 이어져요.</Text>
            <FieldError message={errors.startTime?.message || errors.endTime?.message} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>활동 상태</Text>
            <Controller
              control={control}
              name="activityState"
              render={({ field: { onChange, value } }) => (
                <View accessibilityLabel="활동 상태 선택" accessibilityRole="radiogroup" style={styles.activityGrid}>
                  {activityStateValues.map((state) => {
                    const isSelected = value === state;

                    return (
                      <Pressable
                        accessibilityLabel={activityStateLabels[state]}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: isSelected }}
                        key={state}
                        onPress={() => onChange(state)}
                        style={({ pressed }) => [
                          styles.activityButton,
                          isSelected ? styles.activityButtonSelected : null,
                          pressed ? styles.pressed : null,
                        ]}
                      >
                        <Text style={[styles.activityText, isSelected ? styles.activityTextSelected : null]}>
                          {activityStateLabels[state]}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>창문 표시</Text>
            <Controller
              control={control}
              name="lightOn"
              render={({ field: { onChange } }) => (
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>전등 {lightOn ? '켜짐' : '꺼짐'}</Text>
                  <Switch
                    accessibilityLabel="스케줄 전등 켜기 또는 끄기"
                    accessibilityRole="switch"
                    onValueChange={onChange}
                    thumbColor={colors.surface}
                    trackColor={{ false: colors.border, true: colors.accentPlum }}
                    value={lightOn}
                  />
                </View>
              )}
            />
            <Controller
              control={control}
              name="enabled"
              render={({ field: { onChange } }) => (
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>바로 활성화</Text>
                  <Switch
                    accessibilityLabel="스케줄 활성화 또는 비활성화"
                    accessibilityRole="switch"
                    onValueChange={onChange}
                    thumbColor={colors.surface}
                    trackColor={{ false: colors.border, true: colors.accentPlum }}
                    value={enabled}
                  />
                </View>
              )}
            />
          </View>

          <View accessibilityLabel="우선순위 안내" style={styles.priorityNotice}>
            <Text accessibilityRole={overlaps.length > 0 ? 'alert' : undefined} style={styles.priorityTitle}>{overlapTitle}</Text>
            <Text style={styles.priorityDescription}>{priorityDescription}</Text>
            {overlaps.length > 0 ? <Text style={styles.overlapDetail}>저장해도 기존 규칙은 그대로 유지돼요.</Text> : null}
          </View>

          <Pressable
            accessibilityLabel={isEditing ? '반복 스케줄 수정 저장' : '반복 스케줄 저장'}
            accessibilityRole="button"
            accessibilityState={{ disabled: isSubmitting }}
            disabled={isSubmitting}
            onPress={handleSubmit(submitSchedule)}
            style={({ pressed }) => [styles.saveButton, pressed && !isSubmitting ? styles.pressed : null]}
          >
            <Text style={styles.saveButtonText}>
              {isSubmitting ? '저장 중…' : isEditing ? '반복 스케줄 수정 저장' : '반복 스케줄 저장'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.backgroundDay, flex: 1 },
  keyboardAvoidingView: { flex: 1 },
  header: {
    alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row',
    justifyContent: 'space-between', minHeight: 70, paddingHorizontal: spacing.lg,
  },
  eyebrow: { color: colors.success, fontSize: fontSize.caption, fontWeight: fontWeight.bold, letterSpacing: 1.1, lineHeight: lineHeight.caption },
  title: { color: colors.textPrimary, fontSize: fontSize.title, fontWeight: fontWeight.bold, lineHeight: lineHeight.title },
  closeButton: { alignItems: 'center', justifyContent: 'center', minHeight: 44, minWidth: 44 },
  closeButtonText: { color: colors.accentPlum, fontSize: fontSize.body, fontWeight: fontWeight.bold, lineHeight: lineHeight.body },
  closeButtonTextDisabled: { color: colors.textSecondary },
  content: { gap: spacing.lg, padding: spacing.lg, paddingBottom: spacing.xxl },
  section: { gap: spacing.sm },
  sectionTitle: { color: colors.textPrimary, fontSize: fontSize.body, fontWeight: fontWeight.bold, lineHeight: lineHeight.body },
  textInput: {
    backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1,
    color: colors.textPrimary, fontSize: fontSize.body, lineHeight: lineHeight.body, minHeight: 48, paddingHorizontal: spacing.md,
  },
  weekdayGrid: { flexDirection: 'row', gap: spacing.xs },
  weekdayButton: {
    alignItems: 'center', borderColor: colors.border, borderRadius: radius.pill, borderWidth: 1,
    flex: 1, justifyContent: 'center', minHeight: 44,
  },
  weekdayButtonSelected: { backgroundColor: colors.accentPlum, borderColor: colors.accentPlum },
  weekdayText: { color: colors.textSecondary, fontSize: fontSize.caption, fontWeight: fontWeight.bold, lineHeight: lineHeight.caption },
  weekdayTextSelected: { color: colors.textOnDark },
  timeRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  timeInput: { flex: 1, textAlign: 'center' },
  timeSeparator: { color: colors.textSecondary, fontSize: fontSize.title, lineHeight: lineHeight.title },
  helperText: { color: colors.textSecondary, fontSize: fontSize.caption, lineHeight: lineHeight.caption },
  activityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  activityButton: {
    alignItems: 'center', borderColor: colors.border, borderRadius: radius.pill, borderWidth: 1,
    minHeight: 40, paddingHorizontal: spacing.md, justifyContent: 'center',
  },
  activityButtonSelected: { backgroundColor: colors.accentPlum, borderColor: colors.accentPlum },
  activityText: { color: colors.textSecondary, fontSize: fontSize.caption, fontWeight: fontWeight.bold, lineHeight: lineHeight.caption },
  activityTextSelected: { color: colors.textOnDark },
  switchRow: {
    alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md,
    borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 60, paddingHorizontal: spacing.md,
  },
  switchLabel: { color: colors.textPrimary, fontSize: fontSize.body, fontWeight: fontWeight.medium, lineHeight: lineHeight.body },
  priorityNotice: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, gap: spacing.xs, padding: spacing.md },
  priorityTitle: { color: colors.accentPlum, fontSize: fontSize.body, fontWeight: fontWeight.bold, lineHeight: lineHeight.body },
  priorityDescription: { color: colors.textSecondary, fontSize: fontSize.caption, lineHeight: lineHeight.caption },
  overlapDetail: { color: colors.textSecondary, fontSize: fontSize.caption, lineHeight: lineHeight.caption },
  fieldError: { color: colors.danger, fontSize: fontSize.caption, fontWeight: fontWeight.medium, lineHeight: lineHeight.caption },
  saveButton: { alignItems: 'center', backgroundColor: colors.success, borderRadius: radius.md, justifyContent: 'center', minHeight: 52, paddingHorizontal: spacing.lg },
  saveButtonText: { color: colors.textOnDark, fontSize: fontSize.body, fontWeight: fontWeight.bold, lineHeight: lineHeight.body },
  pressed: { opacity: 0.74 },
});
