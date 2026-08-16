import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HouseBuilding } from '@/components/house/house-building';
import type { HouseType } from '@/features/houses/types';
import { formatRemainingTime, getRemainingSeconds } from '@/features/houses/waiting-room';
import { colors, radius, spacing } from '@/theme/tokens';
import { fontSize, fontWeight, lineHeight } from '@/theme/typography';

export type WaitingRoomProps = {
  houseName: string;
  houseType: HouseType;
  ownerNickname: string;
  moveInAvailableAt: string;
  onEnterHouse: () => void;
  onLeaveHouse: () => void;
};

function WaitingRoomContent({
  houseName,
  houseType,
  moveInAvailableAt,
  onEnterHouse,
  onLeaveHouse,
  ownerNickname,
}: WaitingRoomProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingSeconds(moveInAvailableAt),
  );
  const hasReachedMoveIn = useRef(remainingSeconds === 0);
  const isMoveInReady = remainingSeconds === 0;

  useEffect(() => {
    if (hasReachedMoveIn.current) {
      return;
    }

    const interval = setInterval(() => {
      const nextRemainingSeconds = getRemainingSeconds(moveInAvailableAt);

      setRemainingSeconds(nextRemainingSeconds);

      if (nextRemainingSeconds === 0) {
        hasReachedMoveIn.current = true;
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [moveInAvailableAt]);

  const countdownText = formatRemainingTime(remainingSeconds);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>MOVE-IN PREPARING</Text>
          <Text accessibilityRole="header" style={styles.title}>입주를 준비하고 있어요</Text>
          <Text style={styles.description}>
            {ownerNickname}님의 {houseName}에 곧 들어갈 수 있어요.
          </Text>
        </View>

        <View accessible accessibilityLabel={`${houseName} 건물 실루엣`} style={styles.silhouetteCard}>
          <View style={styles.silhouette}>
            <HouseBuilding houseType={houseType} />
          </View>
          <View style={styles.waitingWindow}>
            <Text style={styles.waitingWindowText}>당신의 방</Text>
          </View>
        </View>

        <View
          accessibilityLabel={
            isMoveInReady
              ? '지금 입주할 수 있어요.'
              : `입주까지 ${countdownText} 남았어요.`
          }
          accessible
          style={styles.countdownCard}
        >
          <Text style={styles.countdownLabel}>{isMoveInReady ? '입주 가능' : '입주까지'}</Text>
          <Text style={styles.countdown}>{isMoveInReady ? '지금 들어갈 수 있어요' : countdownText}</Text>
          <Text style={styles.countdownDescription}>
            {isMoveInReady
              ? '문을 열고 우리집으로 들어가세요.'
              : '준비가 끝나면 문이 열려요.'}
          </Text>
        </View>

        {isMoveInReady ? (
          <Pressable
            accessibilityLabel="우리집 들어가기"
            accessibilityRole="button"
            onPress={onEnterHouse}
            style={({ pressed }) => [styles.primaryButton, pressed ? styles.pressed : null]}
          >
            <Text style={styles.primaryButtonText}>우리집 들어가기</Text>
          </Pressable>
        ) : null}

        <Pressable
          accessibilityHint="입주 신청을 취소하고 이 집에서 나갑니다."
          accessibilityLabel="입주 신청 취소"
          accessibilityRole="button"
          onPress={onLeaveHouse}
          style={({ pressed }) => [styles.leaveButton, pressed ? styles.pressed : null]}
        >
          <Text style={styles.leaveButtonText}>입주 신청 취소</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export function WaitingRoom(props: WaitingRoomProps) {
  return <WaitingRoomContent key={props.moveInAvailableAt} {...props} />;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundNight,
    flex: 1,
  },
  content: {
    flex: 1,
    gap: spacing.lg,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  copy: {
    gap: spacing.xs,
  },
  eyebrow: {
    color: colors.windowOn,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.1,
    lineHeight: lineHeight.caption,
  },
  title: {
    color: colors.textOnDark,
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.display,
  },
  description: {
    color: colors.textOnDark,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    opacity: 0.82,
  },
  silhouetteCard: {
    alignItems: 'center',
    backgroundColor: colors.skyNight,
    borderColor: colors.accentPlum,
    borderRadius: radius.lg,
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingVertical: spacing.md,
  },
  silhouette: {
    aspectRatio: 320 / 420,
    width: '64%',
  },
  waitingWindow: {
    alignItems: 'center',
    backgroundColor: colors.windowOn,
    borderColor: colors.windowFrame,
    borderRadius: radius.sm,
    borderWidth: 3,
    bottom: '29%',
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: spacing.sm,
    position: 'absolute',
  },
  waitingWindowText: {
    color: colors.textPrimary,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.caption,
  },
  countdownCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    gap: spacing.xs,
    padding: spacing.lg,
  },
  countdownLabel: {
    color: colors.accentPlum,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.8,
    lineHeight: lineHeight.caption,
  },
  countdown: {
    color: colors.textPrimary,
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.display,
  },
  countdownDescription: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.windowOn,
    borderRadius: radius.md,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  primaryButtonText: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.body,
  },
  leaveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  leaveButtonText: {
    color: colors.textOnDark,
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.body,
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.74,
  },
});
