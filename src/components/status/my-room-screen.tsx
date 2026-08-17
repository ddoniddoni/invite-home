import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { StatusFormValues } from '@/features/status/status.schema';
import { colors, spacing } from '@/theme/tokens';
import { fontSize, fontWeight, lineHeight } from '@/theme/typography';

import { StatusEditor } from './status-editor';

export type MyRoomScreenProps = {
  nickname: string;
  initialStatus: StatusFormValues;
  onClose: () => void;
  onSave: (nextStatus: StatusFormValues) => void;
};

export function MyRoomScreen({ initialStatus, nickname, onClose, onSave }: MyRoomScreenProps) {
  const [notice, setNotice] = useState<string | null>(null);

  const saveStatus = (nextStatus: StatusFormValues) => {
    onSave(nextStatus);
    setNotice('내 창문 상태를 저장했어요.');
  };

  return (
    <View style={styles.container}>
      <StatusEditor initialValue={initialStatus} nickname={nickname} onClose={onClose} onSave={saveStatus} />
      {notice ? (
        <View accessibilityLiveRegion="polite" style={styles.notice}>
          <Text style={styles.noticeText}>{notice}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundDay,
    flex: 1,
  },
  notice: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  noticeText: {
    color: colors.success,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.caption,
    textAlign: 'center',
  },
});
