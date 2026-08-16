import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/tokens';
import { fontSize, fontWeight, lineHeight } from '@/theme/typography';

type ErrorBannerProps = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorBanner({
  message = '연결이 불안정해요. 다시 시도해 주세요.',
  onRetry,
}: ErrorBannerProps) {
  return (
    <View style={styles.container}>
      <View
        accessible
        accessibilityLabel={`오류. ${message}`}
        accessibilityRole="alert"
        style={styles.copy}
      >
        <Text style={styles.label}>오류</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      {onRetry ? (
        <Pressable
          accessibilityLabel="다시 시도"
          accessibilityRole="button"
          hitSlop={spacing.sm}
          onPress={onRetry}
          style={({ pressed }) => [styles.retryButton, pressed ? styles.pressed : null]}
        >
          <Text style={styles.retryText}>다시 시도</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  label: {
    color: colors.danger,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.caption,
  },
  message: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
  },
  retryButton: {
    minWidth: 72,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.textPrimary,
    paddingHorizontal: spacing.md,
  },
  retryText: {
    color: colors.surface,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.caption,
  },
  pressed: {
    opacity: 0.75,
  },
});
