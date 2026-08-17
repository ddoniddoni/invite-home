import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { todayScheduleVisibilityLabels } from '@/features/schedules/presentation';
import {
  todayScheduleFormSchema,
  todayScheduleVisibilityValues,
  type TodayScheduleFormValues,
} from '@/features/schedules/today-schedule.schema';
import type { TodayScheduleVisibility } from '@/features/schedules/types';
import { colors, radius, spacing } from '@/theme/tokens';
import { fontSize, fontWeight, lineHeight } from '@/theme/typography';

export type TodayScheduleComposerProps = {
  initialValue?: TodayScheduleFormValues;
  onClose: () => void;
  onSave: (value: TodayScheduleFormValues) => Promise<void>;
};

type VisibilityChoiceProps = {
  isDisabled: boolean;
  isSelected: boolean;
  onPress: () => void;
  visibility: TodayScheduleVisibility;
};

const initialSchedule: TodayScheduleFormValues = {
  title: '',
  startTime: '20:00',
  endTime: '21:00',
  visibility: 'house',
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
        accessibilityLabel="오늘 일정 작성 닫기"
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
        <Text style={styles.eyebrow}>오늘의 기록</Text>
        <Text accessibilityRole="header" style={styles.title}>{isEditing ? '오늘 일정 수정' : '오늘 일정'}</Text>
      </View>
      <View style={styles.headerBalance} />
    </View>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <Text accessibilityRole="alert" style={styles.fieldError}>{message}</Text> : null;
}

function VisibilityChoice({ isDisabled, isSelected, onPress, visibility }: VisibilityChoiceProps) {
  const label = todayScheduleVisibilityLabels[visibility];

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="radio"
      accessibilityState={{ disabled: isDisabled, selected: isSelected }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.visibilityChoice,
        isSelected ? styles.visibilityChoiceSelected : null,
        pressed && !isDisabled ? styles.pressed : null,
      ]}
    >
      <Text style={[styles.visibilityChoiceText, isSelected ? styles.visibilityChoiceTextSelected : null]}>{label}</Text>
    </Pressable>
  );
}

export function TodayScheduleComposer({ initialValue, onClose, onSave }: TodayScheduleComposerProps) {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<TodayScheduleFormValues>({
    defaultValues: initialValue ?? initialSchedule,
    resolver: zodResolver(todayScheduleFormSchema),
  });
  const isEditing = initialValue !== undefined;
  const submitSchedule = (value: TodayScheduleFormValues) => onSave(value);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardAvoidingView}>
        <ComposerHeader isEditing={isEditing} isSubmitting={isSubmitting} onClose={onClose} />

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.intro}>
            <Text style={styles.introTitle}>오늘의 약속을 남겨요</Text>
            <Text style={styles.introDescription}>자세한 장소 대신, 함께 사는 친구에게 필요한 만큼만 전해요.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>일정 이름</Text>
            <Controller
              control={control}
              name="title"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  accessibilityLabel="오늘 일정 제목"
                  editable={!isSubmitting}
                  maxLength={40}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="예: 늦은 저녁 약속"
                  placeholderTextColor={colors.textSecondary}
                  style={styles.textInput}
                  value={value}
                />
              )}
            />
            <FieldError message={errors.title?.message} />
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
                    accessibilityLabel="오늘 일정 시작 시각"
                    editable={!isSubmitting}
                    inputMode="numeric"
                    maxLength={5}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="20:00"
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
                    accessibilityLabel="오늘 일정 종료 시각"
                    editable={!isSubmitting}
                    inputMode="numeric"
                    maxLength={5}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="21:00"
                    placeholderTextColor={colors.textSecondary}
                    style={styles.timeInput}
                    value={value}
                  />
                )}
              />
              </View>
            </View>
            <FieldError message={errors.startTime?.message || errors.endTime?.message} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>공개 범위</Text>
            <Controller
              control={control}
              name="visibility"
              render={({ field: { onChange, value } }) => (
                <View accessibilityLabel="오늘 일정 공개 범위" accessibilityRole="radiogroup" style={styles.visibilityOptions}>
                  {todayScheduleVisibilityValues.map((visibility) => (
                    <VisibilityChoice
                      isDisabled={isSubmitting}
                      isSelected={value === visibility}
                      key={visibility}
                      onPress={() => onChange(visibility)}
                      visibility={visibility}
                    />
                  ))}
                </View>
              )}
            />
            <Text style={styles.helperText}>공개한 일정만 다른 입주민의 상세 화면에 보여요.</Text>
          </View>

          <Pressable
            accessibilityLabel={isEditing ? '오늘 일정 수정 저장' : '오늘 일정 저장'}
            accessibilityRole="button"
            accessibilityState={{ disabled: isSubmitting }}
            disabled={isSubmitting}
            onPress={handleSubmit(submitSchedule)}
            style={({ pressed }) => [styles.saveButton, pressed && !isSubmitting ? styles.pressed : null]}
          >
            <Text style={styles.saveButtonText}>
              {isSubmitting ? '저장 중…' : isEditing ? '오늘 일정 수정 저장' : '오늘 일정 저장'}
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
  intro: { borderLeftColor: colors.note, borderLeftWidth: 3, gap: spacing.xs, paddingLeft: spacing.md },
  introTitle: { color: colors.textPrimary, fontSize: fontSize.title, fontWeight: fontWeight.bold, lineHeight: lineHeight.title },
  introDescription: { color: colors.textSecondary, fontSize: fontSize.caption, lineHeight: lineHeight.caption },
  section: { gap: spacing.sm },
  sectionTitle: { color: colors.textPrimary, fontSize: fontSize.body, fontWeight: fontWeight.semibold, lineHeight: lineHeight.body },
  textInput: {
    backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1,
    color: colors.textPrimary, fontSize: fontSize.body, lineHeight: lineHeight.body, minHeight: 52, paddingHorizontal: spacing.md,
  },
  timeRange: { alignItems: 'stretch', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', minHeight: 68 },
  timeInputGroup: { flex: 1, gap: 1, justifyContent: 'center', paddingHorizontal: spacing.md },
  timeInputLabel: { color: colors.textSecondary, fontSize: fontSize.micro, fontWeight: fontWeight.semibold, letterSpacing: 0.6, lineHeight: lineHeight.micro },
  timeInput: { color: colors.textPrimary, fontSize: fontSize.body, fontWeight: fontWeight.semibold, lineHeight: lineHeight.body, minHeight: 28, padding: 0 },
  timeDivider: { backgroundColor: colors.border, marginVertical: spacing.md, width: 1 },
  visibilityOptions: { flexDirection: 'row', gap: spacing.sm },
  visibilityChoice: {
    alignItems: 'center', backgroundColor: colors.surfaceMuted, borderColor: colors.border, borderRadius: radius.sm, borderWidth: 1,
    flex: 1, justifyContent: 'center', minHeight: 48, paddingHorizontal: spacing.sm,
  },
  visibilityChoiceSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  visibilityChoiceText: { color: colors.textSecondary, fontSize: fontSize.caption, fontWeight: fontWeight.semibold, lineHeight: lineHeight.caption },
  visibilityChoiceTextSelected: { color: colors.textOnDark },
  helperText: { color: colors.textSecondary, fontSize: fontSize.caption, lineHeight: lineHeight.caption },
  fieldError: { color: colors.danger, fontSize: fontSize.caption, fontWeight: fontWeight.medium, lineHeight: lineHeight.caption },
  saveButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.md, justifyContent: 'center', minHeight: 54, paddingHorizontal: spacing.lg },
  saveButtonText: { color: colors.textOnDark, fontSize: fontSize.body, fontWeight: fontWeight.bold, lineHeight: lineHeight.body },
  pressed: { opacity: 0.74 },
});
