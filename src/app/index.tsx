import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HouseScene } from '@/components/house/house-scene';
import { NoteComposer } from '@/components/house/note-composer';
import { ResidentDetailModal } from '@/components/house/resident-detail-modal';
import { BottomTabBar } from '@/components/navigation/bottom-tab-bar';
import { StatusEditor } from '@/components/status/status-editor';
import {
  getHouseLayout,
  houseTypeLabels,
} from '@/features/houses/config/house-layouts';
import type { HouseType, HouseWindowMember } from '@/features/houses/types';
import { noteTypeLabels } from '@/features/notes/presentation';
import type { NoteFormValues } from '@/features/notes/note.schema';
import type { StatusFormValues } from '@/features/status/status.schema';
import {
  fixtureCurrentUserId,
  fixtureCurrentStatus,
  fixtureHouse,
  fixtureMembers,
} from '@/fixtures/house.fixture';
import { colors, radius, spacing } from '@/theme/tokens';
import { fontSize, fontWeight, lineHeight } from '@/theme/typography';

const houseTypes: readonly HouseType[] = ['apartment', 'villa', 'detached'];

export default function IndexRoute() {
  const [houseType, setHouseType] = useState<HouseType>(fixtureHouse.houseType);
  const [selection, setSelection] = useState('창문을 눌러 친구의 오늘을 살펴보세요.');
  const [currentStatus, setCurrentStatus] = useState<StatusFormValues>(fixtureCurrentStatus);
  const [isStatusEditorVisible, setIsStatusEditorVisible] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [noteRecipientId, setNoteRecipientId] = useState<string | null>(null);
  const capacity = getHouseLayout(houseType).slots.length;
  const currentMember = fixtureMembers.find((member) => member.id === fixtureCurrentUserId);
  const members: readonly HouseWindowMember[] = fixtureMembers.map((member) =>
    member.id === fixtureCurrentUserId
      ? {
          ...member,
          activityState: currentStatus.activityState,
          lightOn: currentStatus.lightOn,
          moodKey: currentStatus.moodKey,
        }
      : member,
  );
  const selectedMember = members.find((member) => member.id === selectedMemberId) ?? null;
  const noteRecipient = members.find((member) => member.id === noteRecipientId) ?? null;

  if (!currentMember) {
    return null;
  }

  const onPressMember = (memberId: string) => {
    setSelectedMemberId(memberId);
  };

  const onPressMyRoom = () => {
    setIsStatusEditorVisible(true);
  };

  const onPressEmptySlot = (slot: number) => {
    setSelection(`${slot}번 빈 방에 친구를 초대할 수 있어요.`);
  };

  const onSaveStatus = (nextStatus: StatusFormValues) => {
    setCurrentStatus(nextStatus);
    setSelection(`${nextStatus.statusMessage || '내 상태'}를 창문에 반영했어요.`);
    setIsStatusEditorVisible(false);
  };

  const onPressNote = (memberId: string) => {
    setSelectedMemberId(null);
    setNoteRecipientId(memberId);
  };

  const onSendNote = async (value: NoteFormValues) => {
    if (!noteRecipient) {
      return;
    }

    setSelection(`${noteRecipient.nickname}에게 ${noteTypeLabels[value.type]}를 보냈어요.`);
    setNoteRecipientId(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>LOCAL HOUSE SCENE</Text>
          <Text style={styles.title}>{fixtureHouse.name}</Text>
          <Text style={styles.description}>서로의 창문에 켜진 오늘을 한눈에 봐요.</Text>
        </View>

        <View accessibilityLabel="집 유형 선택" accessibilityRole="tablist" style={styles.typeSelector}>
          {houseTypes.map((type) => {
            const isSelected = type === houseType;

            return (
              <Pressable
                accessibilityLabel={`${houseTypeLabels[type]} 집 보기`}
                accessibilityRole="tab"
                accessibilityState={{ selected: isSelected }}
                key={type}
                onPress={() => setHouseType(type)}
                style={({ pressed }) => [
                  styles.typeButton,
                  isSelected ? styles.typeButtonSelected : null,
                  pressed ? styles.pressed : null,
                ]}
              >
                <Text style={[styles.typeButtonText, isSelected ? styles.typeButtonTextSelected : null]}>
                  {houseTypeLabels[type]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <HouseScene
          capacity={capacity}
          currentUserId={fixtureCurrentUserId}
          houseType={houseType}
          isOwner={fixtureHouse.isOwner}
          members={members}
          onPressEmptySlot={onPressEmptySlot}
          onPressMember={onPressMember}
          onPressMyRoom={onPressMyRoom}
          timeOfDay={fixtureHouse.timeOfDay}
        />

        <View accessibilityLiveRegion="polite" style={styles.selectionCard}>
          <Text style={styles.selectionLabel}>FIXTURE 미리보기</Text>
          <Text style={styles.selectionText}>{selection}</Text>
        </View>

        <Pressable
          accessibilityLabel="내 상태 바꾸기"
          accessibilityRole="button"
          onPress={() => setIsStatusEditorVisible(true)}
          style={({ pressed }) => [styles.myRoomButton, pressed ? styles.pressed : null]}
        >
          <View>
            <Text style={styles.myRoomButtonTitle}>내 상태 바꾸기</Text>
            <Text style={styles.myRoomButtonDescription}>전등과 오늘의 기분을 창문에 바로 보여요.</Text>
          </View>
          <Text style={styles.myRoomButtonArrow}>→</Text>
        </Pressable>
      </ScrollView>
      <BottomTabBar />
      <Modal
        animationType="none"
        onRequestClose={() => setIsStatusEditorVisible(false)}
        presentationStyle="pageSheet"
        visible={isStatusEditorVisible}
      >
        {isStatusEditorVisible ? (
          <SafeAreaView style={styles.editorContainer}>
            <StatusEditor
              initialValue={currentStatus}
              nickname={currentMember.nickname}
              onClose={() => setIsStatusEditorVisible(false)}
              onSave={onSaveStatus}
            />
          </SafeAreaView>
        ) : null}
      </Modal>
      <Modal
        animationType="none"
        onRequestClose={() => setSelectedMemberId(null)}
        presentationStyle="pageSheet"
        visible={selectedMember !== null}
      >
        {selectedMember ? (
          <ResidentDetailModal
            member={selectedMember}
            onClose={() => setSelectedMemberId(null)}
            onPressNote={onPressNote}
          />
        ) : null}
      </Modal>
      <Modal
        animationType="none"
        onRequestClose={() => setNoteRecipientId(null)}
        presentationStyle="pageSheet"
        visible={noteRecipient !== null}
      >
        {noteRecipient ? (
          <NoteComposer
            currentUserId={fixtureCurrentUserId}
            onClose={() => setNoteRecipientId(null)}
            onSend={onSendNote}
            recipient={noteRecipient}
          />
        ) : null}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDay,
  },
  content: {
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  scroll: {
    flex: 1,
  },
  header: {
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  eyebrow: {
    color: colors.accentPlum,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.2,
    lineHeight: lineHeight.caption,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.display,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  typeButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  typeButtonSelected: {
    backgroundColor: colors.accentPlum,
    borderColor: colors.accentPlum,
  },
  typeButtonText: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.caption,
  },
  typeButtonTextSelected: {
    color: colors.textOnDark,
  },
  selectionCard: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  selectionLabel: {
    color: colors.accentPlum,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.7,
    lineHeight: lineHeight.caption,
  },
  selectionText: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
  },
  myRoomButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 68,
    paddingHorizontal: spacing.md,
  },
  myRoomButtonTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.body,
  },
  myRoomButtonDescription: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
  },
  myRoomButtonArrow: {
    color: colors.accentPlum,
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.title,
  },
  editorContainer: {
    backgroundColor: colors.backgroundDay,
    flex: 1,
  },
  pressed: {
    opacity: 0.74,
  },
});
