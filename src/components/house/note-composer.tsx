import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
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

import type { HouseWindowMember } from '@/features/houses/types';
import { noteTypeLabels } from '@/features/notes/presentation';
import {
  noteFormSchema,
  noteTypeValues,
  type NoteFormValues,
  type NoteType,
} from '@/features/notes/note.schema';
import { colors, radius, spacing } from '@/theme/tokens';
import { fontSize, fontWeight, lineHeight } from '@/theme/typography';

export type NoteComposerProps = {
  currentUserId: string;
  recipient: HouseWindowMember;
  onClose: () => void;
  onSend: (value: NoteFormValues) => Promise<void>;
};

type NoteTypeButtonProps = {
  noteType: NoteType;
  selected: boolean;
  onPress: () => void;
};

function NoteTypeButton({ noteType, onPress, selected }: NoteTypeButtonProps) {
  const label = noteTypeLabels[noteType];

  return (
    <Pressable
      accessibilityLabel={`${label}로 작성`}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.typeButton,
        selected ? styles.typeButtonSelected : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text style={[styles.typeButtonText, selected ? styles.typeButtonTextSelected : null]}>{label}</Text>
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

const noteFormInitialValues: NoteFormValues = {
  body: '',
  type: 'memo',
};

export function NoteComposer({ currentUserId, onClose, onSend, recipient }: NoteComposerProps) {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<NoteFormValues>({
    defaultValues: noteFormInitialValues,
    resolver: zodResolver(noteFormSchema),
  });
  const [noteType, body] = useWatch({
    control,
    defaultValue: noteFormInitialValues,
    name: ['type', 'body'] as const,
  });
  const canSend = recipient.status === 'active' && recipient.id !== currentUserId;
  const helperText = canSend
    ? `${recipient.nickname}님과 나만 이 메모를 볼 수 있어요.`
    : '메모는 함께 사는 다른 입주민에게만 보낼 수 있어요.';
  const submitNote = (value: NoteFormValues) => onSend(value);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>A SMALL NOTE</Text>
            <Text accessibilityRole="header" style={styles.title}>메모 남기기</Text>
          </View>
          <Pressable
            accessibilityLabel="메모 작성 닫기"
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
          <View style={styles.recipientCard}>
            <Text style={styles.recipientLabel}>받는 사람</Text>
            <Text style={styles.recipientName}>{recipient.nickname}</Text>
            <Text style={styles.recipientDescription}>{helperText}</Text>
          </View>

          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <View accessibilityLabel="메모 유형" accessibilityRole="tablist" style={styles.typeControl}>
                {noteTypeValues.map((type) => (
                  <NoteTypeButton
                    key={type}
                    noteType={type}
                    onPress={() => onChange(type)}
                    selected={value === type}
                  />
                ))}
              </View>
            )}
          />

          <View style={styles.messageSection}>
            <View style={styles.messageHeader}>
              <Text style={styles.messageLabel}>{noteTypeLabels[noteType]} 내용</Text>
              <Text accessibilityLabel={`현재 ${body.length}자, 최대 120자`} style={styles.count}>
                {body.length}/120
              </Text>
            </View>
            <Controller
              control={control}
              name="body"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  accessibilityLabel="메모 내용"
                  editable={!isSubmitting && canSend}
                  maxLength={120}
                  multiline
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="짧은 안부를 남겨 보세요."
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.messageInput, !canSend ? styles.messageInputDisabled : null]}
                  textAlignVertical="top"
                  value={value}
                />
              )}
            />
            <FieldError message={errors.body?.message} />
          </View>

          <Pressable
            accessibilityHint={helperText}
            accessibilityLabel={`${recipient.nickname}에게 ${noteTypeLabels[noteType]} 보내기`}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canSend || isSubmitting }}
            disabled={!canSend || isSubmitting}
            onPress={handleSubmit(submitNote)}
            style={({ pressed }) => [
              styles.sendButton,
              !canSend || isSubmitting ? styles.sendButtonDisabled : null,
              pressed && canSend && !isSubmitting ? styles.pressed : null,
            ]}
          >
            <Text style={[styles.sendButtonText, !canSend || isSubmitting ? styles.sendButtonTextDisabled : null]}>
              {isSubmitting ? '보내는 중…' : `${noteTypeLabels[noteType]} 보내기`}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.backgroundDay,
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 70,
    paddingHorizontal: spacing.lg,
  },
  eyebrow: {
    color: colors.accentPlum,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.1,
    lineHeight: lineHeight.caption,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.title,
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
  closeButtonTextDisabled: {
    color: colors.textSecondary,
  },
  content: {
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  recipientCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderLeftColor: colors.note,
    borderLeftWidth: 4,
    borderRadius: radius.md,
    gap: spacing.xs,
    padding: spacing.lg,
  },
  recipientLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.caption,
  },
  recipientName: {
    color: colors.textPrimary,
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.title,
  },
  recipientDescription: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
  },
  typeControl: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    padding: spacing.xs,
  },
  typeButton: {
    alignItems: 'center',
    borderRadius: radius.pill,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  typeButtonSelected: {
    backgroundColor: colors.accentPlum,
  },
  typeButtonText: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.body,
  },
  typeButtonTextSelected: {
    color: colors.textOnDark,
  },
  messageSection: {
    gap: spacing.sm,
  },
  messageHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageLabel: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.body,
  },
  count: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.caption,
  },
  messageInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    minHeight: 176,
    padding: spacing.md,
  },
  messageInputDisabled: {
    backgroundColor: colors.backgroundDay,
  },
  fieldError: {
    color: colors.danger,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.caption,
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: colors.note,
    borderRadius: radius.md,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
  sendButtonText: {
    color: colors.textOnDark,
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.body,
  },
  sendButtonTextDisabled: {
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.74,
  },
});
