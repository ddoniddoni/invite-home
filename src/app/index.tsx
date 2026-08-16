import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/ui/empty-state';
import { colors, spacing } from '@/theme/tokens';

export default function IndexRoute() {
  return (
    <SafeAreaView style={styles.container}>
      <EmptyState
        title="우리집을 준비하고 있어요"
        description="다음 단계에서 친구들과 함께 볼 집을 만들어요."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.backgroundDay,
  },
});
