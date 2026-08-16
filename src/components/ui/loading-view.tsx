import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/theme/tokens';
import { fontSize, lineHeight } from '@/theme/typography';

type LoadingViewProps = {
  message?: string;
};

export function LoadingView({ message = '불러오는 중이에요.' }: LoadingViewProps) {
  return (
    <View
      accessible
      accessibilityLabel={message}
      accessibilityRole="progressbar"
      style={styles.container}
    >
      <ActivityIndicator color={colors.textSecondary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  message: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    textAlign: 'center',
  },
});
