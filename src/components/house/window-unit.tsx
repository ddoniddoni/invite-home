import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

import type { ActivityState, MoodKey } from '@/features/houses/types';
import { activityStateLabels, moodKeyLabels } from '@/features/status/presentation';
import { colors, moodColors, spacing } from '@/theme/tokens';
import { fontSize, fontWeight, lineHeight } from '@/theme/typography';

export type WindowUnitProps = {
  slot: number;
  nickname: string;
  isMine: boolean;
  isPending: boolean;
  lightOn: boolean;
  moodKey: MoodKey | null;
  activityState: ActivityState;
  hasUnreadNoteForMe: boolean;
  onPress?: () => void;
  readOnly?: boolean;
  style?: StyleProp<ViewStyle>;
};

type EmptyWindowUnitProps = {
  slot: number;
  isOwner: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

function ActivityGlyph({ activityState, color }: { activityState: ActivityState; color: string }) {
  switch (activityState) {
    case 'available':
      return (
        <>
          <Circle cx="50" cy="47" fill="none" r="15" stroke={color} strokeWidth="5" />
          <Path d="M28 74c6-11 15-16 22-16s16 5 22 16" fill="none" stroke={color} strokeWidth="5" />
        </>
      );
    case 'work':
      return (
        <>
          <Rect fill="none" height="18" rx="2" stroke={color} strokeWidth="5" width="44" x="28" y="37" />
          <Line stroke={color} strokeWidth="5" x1="36" x2="36" y1="56" y2="73" />
          <Line stroke={color} strokeWidth="5" x1="64" x2="64" y1="56" y2="73" />
        </>
      );
    case 'focus':
      return (
        <>
          <Circle cx="50" cy="51" fill="none" r="18" stroke={color} strokeWidth="5" />
          <Circle cx="50" cy="51" fill={color} r="5" />
          <Line stroke={color} strokeWidth="5" x1="50" x2="50" y1="20" y2="29" />
          <Line stroke={color} strokeWidth="5" x1="50" x2="50" y1="73" y2="82" />
        </>
      );
    case 'rest':
      return <Path d="M63 25A26 26 0 1 0 76 65 24 24 0 0 1 63 25Z" fill="none" stroke={color} strokeWidth="5" />;
    case 'sleep':
      return (
        <>
          <Path d="M29 38h20L30 64h21" fill="none" stroke={color} strokeWidth="5" />
          <Path d="M55 52h15L56 71h16" fill="none" stroke={color} strokeWidth="5" />
        </>
      );
    case 'away':
      return (
        <>
          <Path d="M28 71V31h31v40" fill="none" stroke={color} strokeWidth="5" />
          <Circle cx="51" cy="52" fill={color} r="4" />
          <Path d="M67 38h8v33h-8" fill="none" stroke={color} strokeWidth="5" />
        </>
      );
    case 'dnd':
      return (
        <>
          <Circle cx="50" cy="51" fill="none" r="25" stroke={color} strokeWidth="5" />
          <Line stroke={color} strokeWidth="5" x1="33" x2="67" y1="51" y2="51" />
        </>
      );
  }
}

function WindowGraphic({
  activityState,
  hasUnreadNoteForMe,
  isMine,
  isPending,
  lightOn,
  moodKey,
}: Omit<WindowUnitProps, 'slot' | 'nickname' | 'onPress' | 'readOnly' | 'style'>) {
  const fill = lightOn ? (moodKey ? moodColors[moodKey] : colors.windowOn) : colors.windowOff;
  const glyphColor = lightOn ? colors.textPrimary : colors.textOnDark;

  return (
    <Svg accessible={false} height="100%" viewBox="0 0 100 120" width="100%">
      <Rect fill={colors.windowFrame} height="103" rx="8" width="88" x="6" y="6" />
      <Rect fill={fill} height="87" rx="4" width="72" x="14" y="14" />
      <Line opacity={0.42} stroke={colors.windowFrame} strokeWidth="3" x1="50" x2="50" y1="15" y2="100" />
      <Line opacity={0.42} stroke={colors.windowFrame} strokeWidth="3" x1="15" x2="85" y1="60" y2="60" />
      <ActivityGlyph activityState={activityState} color={glyphColor} />
      {isPending ? (
        <Rect
          fill="none"
          height="78"
          rx="4"
          stroke={colors.windowPending}
          strokeDasharray="6 4"
          strokeWidth="4"
          width="63"
          x="19"
          y="19"
        />
      ) : null}
      {isMine ? <Circle cx="21" cy="21" fill={colors.accentPlum} r="8" /> : null}
      {hasUnreadNoteForMe ? (
        <>
          <Circle cx="81" cy="21" fill={colors.note} r="8" />
          <Path d="M77 18h8v6h-8zM77 18l4 3 4-3" fill="none" stroke={colors.surface} strokeWidth="1.5" />
        </>
      ) : null}
    </Svg>
  );
}

function getWindowAccessibilityLabel({
  nickname,
  isMine,
  isPending,
  lightOn,
  moodKey,
  activityState,
  hasUnreadNoteForMe,
}: Omit<WindowUnitProps, 'slot' | 'onPress' | 'readOnly' | 'style'>): string {
  const details = [
    `${nickname}의 방`,
    isMine ? '내 방' : null,
    isPending ? '입주 대기' : null,
    activityStateLabels[activityState],
    `전등 ${lightOn ? '켜짐' : '꺼짐'}`,
    moodKey ? moodKeyLabels[moodKey] : null,
    hasUnreadNoteForMe ? '읽지 않은 메모 있음' : null,
  ].filter((detail): detail is string => detail !== null);

  return details.join(', ');
}

export function WindowUnit({
  activityState,
  hasUnreadNoteForMe,
  isMine,
  isPending,
  lightOn,
  moodKey,
  nickname,
  onPress,
  readOnly = false,
  style,
}: WindowUnitProps) {
  const accessibilityLabel = getWindowAccessibilityLabel({
    activityState,
    hasUnreadNoteForMe,
    isMine,
    isPending,
    lightOn,
    moodKey,
    nickname,
  });

  const content = (
    <>
      <View style={[styles.graphic, styles.graphicLayer]}>
        <WindowGraphic
          activityState={activityState}
          hasUnreadNoteForMe={hasUnreadNoteForMe}
          isMine={isMine}
          isPending={isPending}
          lightOn={lightOn}
          moodKey={moodKey}
        />
      </View>
      <Text numberOfLines={1} style={styles.nickname}>{nickname}</Text>
      <Text numberOfLines={1} style={styles.status}>
        {isPending ? '입주 대기' : activityStateLabels[activityState]}
      </Text>
    </>
  );

  if (readOnly || !onPress) {
    return (
      <View accessible accessibilityLabel={accessibilityLabel} style={[styles.container, style]}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityHint={isMine ? '내 방 상태를 확인합니다.' : '입주민 상태를 확인합니다.'}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={spacing.xs}
      onPress={onPress}
      style={({ pressed }) => [styles.container, style, pressed ? styles.pressed : null]}
    >
      {content}
    </Pressable>
  );
}

export function EmptyWindowUnit({ isOwner, onPress, slot, style }: EmptyWindowUnitProps) {
  const label = isOwner ? `빈 ${slot}번 방, 친구 초대하기` : `빈 ${slot}번 방`;

  const graphic = (
    <View style={[styles.graphic, styles.graphicLayer]}>
      <Svg accessible={false} height="100%" viewBox="0 0 100 120" width="100%">
        <Rect fill={colors.windowFrame} height="103" rx="8" width="88" x="6" y="6" />
        <Rect
          fill={colors.windowOff}
          height="87"
          rx="4"
          stroke={colors.windowPending}
          strokeDasharray="5 4"
          strokeWidth="2"
          width="72"
          x="14"
          y="14"
        />
        <Line stroke={colors.windowPending} strokeWidth="3" x1="38" x2="62" y1="57" y2="57" />
        <Line stroke={colors.windowPending} strokeWidth="3" x1="50" x2="50" y1="45" y2="69" />
      </Svg>
    </View>
  );

  if (!isOwner) {
    return (
      <View accessible accessibilityLabel={label} style={[styles.container, style]}>
        {graphic}
        <Text numberOfLines={1} style={styles.emptyLabel}>빈 방</Text>
      </View>
    );
  }

  return (
    <Pressable
      accessibilityHint="초대할 친구를 선택합니다."
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={spacing.xs}
      onPress={onPress}
      style={({ pressed }) => [styles.container, style, pressed ? styles.pressed : null]}
    >
      {graphic}
      <Text numberOfLines={1} style={styles.emptyLabel}>친구 초대</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  graphic: {
    aspectRatio: 100 / 120,
    width: '100%',
  },
  graphicLayer: {
    pointerEvents: 'none',
  },
  nickname: {
    color: colors.textOnDark,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.caption,
    marginTop: -3,
    textAlign: 'center',
    width: '126%',
  },
  status: {
    color: colors.textOnDark,
    fontSize: fontSize.micro,
    lineHeight: lineHeight.micro,
    opacity: 0.88,
    textAlign: 'center',
    width: '136%',
  },
  emptyLabel: {
    color: colors.textOnDark,
    fontSize: fontSize.micro,
    lineHeight: lineHeight.micro,
    marginTop: -3,
    textAlign: 'center',
    width: '132%',
  },
  pressed: {
    opacity: 0.72,
  },
});
