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
import Svg, { Path } from 'react-native-svg';

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

function BackIcon() {
  return (
    <Svg accessible={false} height={20} viewBox="0 0 24 24" width={20}>
      <Path d="m14.5 5.5-6 6.5 6 6.5" fill="none" stroke={colors.textPrimary} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </Svg>
  );
}

type ComposerHeaderProps = {
  isEditing: boolean;
  isSubmitting: boolean;
  onClose: () => void;
};

function ComposerHeader({ isEditing, isSubmitting, onClose }: ComposerHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityLabel="스케줄 작성 닫기"
        accessibilityRole="button"
        accessibilityState={{ disabled: isSubmitting }}
        disabled={isSubmitting}
        hitSlop={spacing.sm}
        onPress={onClose}
        style={({ pressed }) => [styles.backButton, pressed && !isSubmitting ? styles.pressed : null]}
      >
        <BackIcon />
      </Pressable>
      <View style={styles.headerTitleGroup}>
        <Text style={styles.eyebrow}>매일의 리듬</Text>
        <Text accessibilityRole="header" style={styles.title}>{isEditing ? '반복 스케줄 수정' : '반복 스케줄'}</Text>
      </View>
      <View style={styles.headerBalance} />
    </View>
  );
}

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
        <ComposerHeader isEditing={isEditing} isSubmitting={isSubmitting} onClose={onClose} />

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.intro}>
            <Text style={styles.introTitle}>생활 리듬을 기록해요</Text>
            <Text style={styles.introDescription}>선택한 시간에는 창문 상태가 자동으로 바뀌어요.</Text>
          </View>

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
            <View style={styles.timeRange}>
              <View style={styles.timeInputGroup}>
                <Text style={styles.timeInputLabel}>시작</Text>
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
                    style={styles.timeInput}
                    value={value}
                  />
                )}
              />
              </View>
              <View style={styles.timeDivider} />
              <View style={styles.timeInputGroup}>
                <Text style={styles.timeInputLabel}>종료</Text>
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
                    style={styles.timeInput}
                    value={value}
                  />
                )}
              />
              </View>
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
    minHeight: 72, paddingHorizontal: spacing.page,
  },
  backButton: { alignItems: 'center', justifyContent: 'center', minHeight: 44, minWidth: 44 },
  headerTitleGroup: { alignItems: 'center', flex: 1, gap: 1 },
  headerBalance: { minWidth: 44 },
  eyebrow: { color: colors.accentPlum, fontSize: fontSize.micro, fontWeight: fontWeight.semibold, letterSpacing: 1.4, lineHeight: lineHeight.micro },
  title: { color: colors.textPrimary, fontSize: fontSize.body, fontWeight: fontWeight.bold, lineHeight: lineHeight.body },
  content: { gap: spacing.xl, paddingHorizontal: spacing.page, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  intro: { borderLeftColor: colors.buildingApartment, borderLeftWidth: 3, gap: spacing.xs, paddingLeft: spacing.md },
  introTitle: { color: colors.textPrimary, fontSize: fontSize.title, fontWeight: fontWeight.bold, lineHeight: lineHeight.title },
  introDescription: { color: colors.textSecondary, fontSize: fontSize.caption, lineHeight: lineHeight.caption },
  section: { gap: spacing.sm },
  sectionTitle: { color: colors.textPrimary, fontSize: fontSize.body, fontWeight: fontWeight.semibold, lineHeight: lineHeight.body },
  textInput: {
    backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1,
    color: colors.textPrimary, fontSize: fontSize.body, lineHeight: lineHeight.body, minHeight: 52, paddingHorizontal: spacing.md,
  },
  weekdayGrid: { flexDirection: 'row', gap: spacing.xs },
  weekdayButton: {
    alignItems: 'center', backgroundColor: colors.surfaceMuted, borderColor: colors.border, borderRadius: radius.sm, borderWidth: 1,
    flex: 1, justifyContent: 'center', minHeight: 42,
  },
  weekdayButtonSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  weekdayText: { color: colors.textSecondary, fontSize: fontSize.caption, fontWeight: fontWeight.semibold, lineHeight: lineHeight.caption },
  weekdayTextSelected: { color: colors.textOnDark },
  timeRange: { alignItems: 'stretch', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', minHeight: 68 },
  timeInputGroup: { flex: 1, gap: 1, justifyContent: 'center', paddingHorizontal: spacing.md },
  timeInputLabel: { color: colors.textSecondary, fontSize: fontSize.micro, fontWeight: fontWeight.semibold, letterSpacing: 0.6, lineHeight: lineHeight.micro },
  timeInput: { color: colors.textPrimary, fontSize: fontSize.body, fontWeight: fontWeight.semibold, lineHeight: lineHeight.body, minHeight: 28, padding: 0 },
  timeDivider: { backgroundColor: colors.border, marginVertical: spacing.md, width: 1 },
  helperText: { color: colors.textSecondary, fontSize: fontSize.caption, lineHeight: lineHeight.caption },
  activityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  activityButton: {
    alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.sm, borderWidth: 1,
    flexGrow: 1, flexBasis: '30%', minHeight: 42, paddingHorizontal: spacing.sm, justifyContent: 'center',
  },
  activityButtonSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  activityText: { color: colors.textSecondary, fontSize: fontSize.caption, fontWeight: fontWeight.semibold, lineHeight: lineHeight.caption },
  activityTextSelected: { color: colors.textOnDark },
  switchRow: {
    alignItems: 'center', backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1,
    flexDirection: 'row', justifyContent: 'space-between', minHeight: 64, paddingHorizontal: spacing.md,
  },
  switchLabel: { color: colors.textPrimary, fontSize: fontSize.body, fontWeight: fontWeight.semibold, lineHeight: lineHeight.body },
  priorityNotice: { backgroundColor: colors.surfaceMuted, borderLeftColor: colors.accentPlum, borderLeftWidth: 3, gap: spacing.xs, padding: spacing.md },
  priorityTitle: { color: colors.textPrimary, fontSize: fontSize.body, fontWeight: fontWeight.semibold, lineHeight: lineHeight.body },
  priorityDescription: { color: colors.textSecondary, fontSize: fontSize.caption, lineHeight: lineHeight.caption },
  overlapDetail: { color: colors.textSecondary, fontSize: fontSize.caption, lineHeight: lineHeight.caption },
  fieldError: { color: colors.danger, fontSize: fontSize.caption, fontWeight: fontWeight.medium, lineHeight: lineHeight.caption },
  saveButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.md, justifyContent: 'center', minHeight: 54, paddingHorizontal: spacing.lg },
  saveButtonText: { color: colors.textOnDark, fontSize: fontSize.body, fontWeight: fontWeight.bold, lineHeight: lineHeight.body },
  pressed: { opacity: 0.74 },
});
