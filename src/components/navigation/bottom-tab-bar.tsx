import { Link, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/theme/tokens';
import { fontSize, fontWeight, lineHeight } from '@/theme/typography';

const tabs = [
  { href: '/', label: '집' },
  { href: '/notes', label: '메모' },
  { href: '/schedule', label: '스케줄' },
  { href: '/my-room', label: '내 방' },
] as const;

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <View accessibilityLabel="주요 메뉴" accessibilityRole="tablist" style={styles.container}>
      {tabs.map((tab) => {
        const isSelected = pathname === tab.href;

        return (
          <Link asChild href={tab.href} key={tab.href}>
            <Pressable
              accessibilityLabel={`${tab.label} 탭`}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              style={({ pressed }) => [styles.tab, pressed ? styles.pressed : null]}
            >
              <Text style={[styles.tabText, isSelected ? styles.tabTextSelected : null]}>{tab.label}</Text>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    minHeight: 60,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.caption,
  },
  tabTextSelected: {
    color: colors.accentPlum,
    fontWeight: fontWeight.bold,
  },
  pressed: {
    opacity: 0.74,
  },
});
