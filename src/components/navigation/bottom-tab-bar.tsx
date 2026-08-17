import { Link, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors, radius, spacing } from '@/theme/tokens';
import { fontSize, fontWeight, lineHeight } from '@/theme/typography';

const tabs = [
  { href: '/', icon: 'house', label: '집' },
  { href: '/notes', icon: 'note', label: '메모' },
  { href: '/schedule', icon: 'calendar', label: '스케줄' },
  { href: '/my-room', icon: 'room', label: '내 방' },
] as const;

type TabIconName = (typeof tabs)[number]['icon'];

function TabIcon({ color, name }: { color: string; name: TabIconName }) {
  const commonProps = {
    fill: 'none',
    stroke: color,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
  };

  return (
    <Svg accessible={false} height={20} viewBox="0 0 24 24" width={20}>
      {name === 'house' ? <Path {...commonProps} d="m4 10 8-6 8 6v10H4z" /> : null}
      {name === 'house' ? <Path {...commonProps} d="M9.5 20v-5h5v5" /> : null}
      {name === 'note' ? <Path {...commonProps} d="M6 4h12v12H9l-3 3z" /> : null}
      {name === 'note' ? <Path {...commonProps} d="M9 8h6M9 11h4" /> : null}
      {name === 'calendar' ? <Rect {...commonProps} height="15" rx="2" width="15" x="4.5" y="5.5" /> : null}
      {name === 'calendar' ? <Path {...commonProps} d="M8 3.5v4M16 3.5v4M4.5 10h15" /> : null}
      {name === 'room' ? <Path {...commonProps} d="M5 20V5h14v15M5 15h14M8 12h.01" /> : null}
      {name === 'room' ? <Circle fill={color} r="1" cx="8" cy="12" /> : null}
    </Svg>
  );
}

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
              style={({ pressed }) => [
                styles.tab,
                isSelected ? styles.tabSelected : null,
                pressed ? styles.pressed : null,
              ]}
            >
              <TabIcon color={isSelected ? colors.primary : colors.textSecondary} name={tab.icon} />
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
    borderColor: colors.border,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 72,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    gap: 3,
    justifyContent: 'center',
    minHeight: 44,
  },
  tabSelected: {
    transform: [{ translateY: -2 }],
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: fontSize.micro,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.caption,
  },
  tabTextSelected: {
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
  pressed: {
    opacity: 0.74,
  },
});
