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
import Svg, { Path } from 'react-native-svg';

import { WindowUnit } from '@/components/house/window-unit';
import { activityStateLabels, manualUntilLabels, moodKeyLabels } from '@/features/status/presentation';
import {
  activityStateValues,
  manualUntilValues,
  moodKeyValues,
  statusFormSchema,
  type StatusFormValues,
} from '@/features/status/status.schema';
import { colors, moodColors, radius, spacing } from '@/theme/tokens';
import { fontSize, fontWeight, lineHeight } from '@/theme/typography';

type StatusEditorProps = {
  nickname: string;
  initialValue: StatusFormValues;
  onClose: () => void;
  onSave: (value: StatusFormValues) => void;
};

type ChoiceButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  accessibilityRole?: 'button' | 'radio' | 'tab';
};

function ChoiceButton({
  accessibilityRole = 'radio',
  label,
  onPress,
  selected,
}: ChoiceButtonProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.choiceButton,
        selected ? styles.choiceButtonSelected : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text style={[styles.choiceButtonText, selected ? styles.choiceButtonTextSelected : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? (
    <Text accessibilityRole="alert" style={styles.fieldError}>
      {message}
    </Text>
  ) : null;
}

function BackIcon() {
  return (
    <Svg accessible={false} height={20} viewBox="0 0 24 24" width={20}>
      <Path d="m14.5 5-7 7 7 7" fill="none" stroke={colors.textPrimary} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </Svg>
  );
}

export function StatusEditor({ initialValue, nickname, onClose, onSave }: StatusEditorProps) {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<StatusFormValues>({
    defaultValues: initialValue,
    resolver: zodResolver(statusFormSchema),
  });

  const [mode, activityState, lightOn, moodKey, moodLabel, statusMessage] = useWatch({
    control,
    defaultValue: initialValue,
    name: ['mode', 'activityState', 'lightOn', 'moodKey', 'moodLabel', 'statusMessage'] as const,
  });
  const isManualMode = mode === 'manual';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardAvoidingView}
    >
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="상태 편집 닫기"
          accessibilityRole="button"
          hitSlop={spacing.sm}
          onPress={onClose}
          style={({ pressed }) => [styles.closeButton, pressed ? styles.pressed : null]}
        >
          <BackIcon />
        </Pressable>
        <Text accessibilityRole="header" style={styles.title}>내 방</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.previewCard}>
          <View style={styles.previewWindow}>
            <WindowUnit
              activityState={activityState}
              hasUnreadNoteForMe={false}
              isMine
              isPending={false}
              lightOn={lightOn}
              moodKey={moodKey}
              nickname={nickname}
              readOnly
              slot={1}
            />
          </View>
          <View style={styles.previewCopy}>
            <Text style={styles.previewTitle}>내 창문</Text>
            <Text style={styles.previewDescription}>
              {statusMessage || '한 줄 상태를 적어 보세요.'}
            </Text>
            {moodLabel ? <Text style={styles.moodLabel}>{moodLabel}</Text> : null}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>표시 방식</Text>
          <Controller
            control={control}
            name="mode"
            render={({ field: { onChange, value } }) => (
              <View accessibilityLabel="상태 모드" accessibilityRole="tablist" style={styles.segmentedControl}>
                <ChoiceButton
                  accessibilityRole="tab"
                  label="수동"
                  onPress={() => onChange('manual')}
                  selected={value === 'manual'}
                />
                <ChoiceButton
                  accessibilityRole="tab"
                  label="자동"
                  onPress={() => onChange('auto')}
                  selected={value === 'auto'}
                />
              </View>
            )}
          />
          {isManualMode ? null : (
            <Text style={styles.helperText}>
              자동 모드에서는 현재 반복 스케줄 값을 사용해요.
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>지금 무엇을 하고 있나요?</Text>
          <Controller
            control={control}
            name="activityState"
            render={({ field: { onChange, value } }) => (
              <View accessibilityLabel="활동 상태 선택" accessibilityRole="radiogroup" style={styles.optionGrid}>
                {activityStateValues.map((activityState) => (
                  <ChoiceButton
                    key={activityState}
                    label={activityStateLabels[activityState]}
                    onPress={() => onChange(activityState)}
                    selected={value === activityState}
                  />
                ))}
              </View>
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>전등</Text>
          <Controller
            control={control}
            name="lightOn"
            render={({ field: { onChange, value } }) => (
              <View style={styles.switchRow}>
                <View style={styles.switchCopy}>
                  <Text style={styles.switchTitle}>전등 {value ? '켜짐' : '꺼짐'}</Text>
                  <Text style={styles.helperText}>창문에 표시할 전등을 선택해요.</Text>
                </View>
                <Switch
                  accessibilityLabel="전등 켜기 또는 끄기"
                  accessibilityRole="switch"
                  onValueChange={onChange}
                  thumbColor={colors.surface}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  value={value}
                />
              </View>
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>오늘의 감정 색</Text>
          <Controller
            control={control}
            name="moodKey"
            render={({ field: { onChange, value } }) => (
              <View accessibilityLabel="감정 색 선택" accessibilityRole="radiogroup" style={styles.moodGrid}>
                <Pressable
                  accessibilityLabel="감정 색 없음"
                  accessibilityRole="radio"
                  accessibilityState={{ selected: value === null }}
                  onPress={() => onChange(null)}
                  style={({ pressed }) => [
                    styles.moodButton,
                    value === null ? styles.moodButtonSelected : null,
                    pressed ? styles.pressed : null,
                  ]}
                >
                  <View style={styles.noMoodSwatch} />
                  <Text style={styles.moodButtonText}>없음</Text>
                </Pressable>
                {moodKeyValues.map((moodKey) => (
                  <Pressable
                    accessibilityLabel={moodKeyLabels[moodKey]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: value === moodKey }}
                    key={moodKey}
                    onPress={() => onChange(moodKey)}
                    style={({ pressed }) => [
                      styles.moodButton,
                      value === moodKey ? styles.moodButtonSelected : null,
                      pressed ? styles.pressed : null,
                    ]}
                  >
                    <View style={[styles.moodSwatch, { backgroundColor: moodColors[moodKey] }]} />
                    <Text style={styles.moodButtonText}>{moodKeyLabels[moodKey]}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          />
          <Controller
            control={control}
            name="moodLabel"
            render={({ field: { onBlur, onChange, value } }) => (
              <TextInput
                accessibilityLabel="감정 라벨"
                maxLength={12}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="감정을 짧게 적어도 좋아요"
                placeholderTextColor={colors.textSecondary}
                style={styles.textInput}
                value={value}
              />
            )}
          />
          <FieldError message={errors.moodLabel?.message} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>한 줄 상태</Text>
          <Controller
            control={control}
            name="statusMessage"
            render={({ field: { onBlur, onChange, value } }) => (
              <TextInput
                accessibilityLabel="상태 메시지"
                maxLength={30}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="예: 저녁 먹고 돌아올게요"
                placeholderTextColor={colors.textSecondary}
                style={styles.textInput}
                value={value}
              />
            )}
          />
          <FieldError message={errors.statusMessage?.message} />
        </View>

        {isManualMode ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>수동 상태 종료</Text>
            <Controller
              control={control}
              name="manualUntil"
              render={({ field: { onChange, value } }) => (
                <View accessibilityLabel="수동 상태 종료 시각" accessibilityRole="radiogroup" style={styles.untilOptions}>
                  {manualUntilValues.map((manualUntil) => (
                    <ChoiceButton
                      key={manualUntil}
                      label={manualUntilLabels[manualUntil]}
                      onPress={() => onChange(manualUntil)}
                      selected={value === manualUntil}
                    />
                  ))}
                </View>
              )}
            />
          </View>
        ) : null}

        <Pressable
          accessibilityLabel="내 상태 저장"
          accessibilityRole="button"
          disabled={isSubmitting}
          onPress={handleSubmit(onSave)}
          style={({ pressed }) => [
            styles.saveButton,
            pressed || isSubmitting ? styles.pressed : null,
          ]}
        >
          <Text style={styles.saveButtonText}>{isSubmitting ? '저장 중' : '상태 저장'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    backgroundColor: colors.backgroundDay,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: spacing.page,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.body,
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: radius.sm,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  headerSpacer: {
    minWidth: 44,
  },
  content: {
    gap: spacing.xl,
    paddingBottom: spacing.section,
    paddingHorizontal: spacing.page,
    paddingTop: spacing.sm,
  },
  previewCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.lg,
    minHeight: 144,
    padding: spacing.lg,
  },
  previewWindow: {
    height: 96,
    width: 80,
  },
  previewCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  previewTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.body,
  },
  previewDescription: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
  },
  moodLabel: {
    color: colors.accentPlum,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.caption,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
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
  choiceButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  choiceButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  choiceButtonText: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.caption,
    textAlign: 'center',
  },
  choiceButtonTextSelected: {
    color: colors.textOnDark,
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  switchRow: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  switchCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  switchTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.body,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  moodButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: 40,
    paddingHorizontal: spacing.sm,
  },
  moodButtonSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  moodSwatch: {
    borderColor: colors.textPrimary,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 14,
    width: 14,
  },
  noMoodSwatch: {
    backgroundColor: colors.surface,
    borderColor: colors.textSecondary,
    borderRadius: radius.pill,
    borderStyle: 'dashed',
    borderWidth: 1,
    height: 14,
    width: 14,
  },
  moodButtonText: {
    color: colors.textPrimary,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  fieldError: {
    color: colors.danger,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
  },
  untilOptions: {
    gap: spacing.sm,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  saveButtonText: {
    color: colors.textOnDark,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.body,
  },
  pressed: {
    opacity: 0.74,
  },
});
