import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { HouseScene } from '@/components/house/house-scene';
import { NoteComposer } from '@/components/house/note-composer';
import { ResidentDetailModal } from '@/components/house/resident-detail-modal';
import { BottomTabBar } from '@/components/navigation/bottom-tab-bar';
import { StatusEditor } from '@/components/status/status-editor';
import type { HouseWindowMember } from '@/features/houses/types';
import { useLocalNotes } from '@/features/notes/local-note-store';
import type { NoteFormValues } from '@/features/notes/note.schema';
import { noteTypeLabels } from '@/features/notes/presentation';
import { useLocalSchedules } from '@/features/schedules/local-schedule-store';
import { toStatusSchedules } from '@/features/schedules/status-schedules';
import { useLocalStatus } from '@/features/status/local-status-store';
import { activityStateLabels } from '@/features/status/presentation';
import type { StatusFormValues } from '@/features/status/status.schema';
import { useEffectiveStatus } from '@/features/status/use-effective-status';
import {
  fixtureCurrentUserId,
  fixtureHouse,
  fixtureMembers,
} from '@/fixtures/house.fixture';
import { colors, radius, spacing } from '@/theme/tokens';
import { fontSize, fontWeight, lineHeight } from '@/theme/typography';

const fixtureStatusEvents = [] as const;

function HeaderHomeIcon() {
  return (
    <Svg accessible={false} height={20} viewBox="0 0 24 24" width={20}>
      <Path d="m4 10 8-6 8 6v10H4z" fill="none" stroke={colors.textPrimary} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <Path d="M9.5 20v-5h5v5" fill="none" stroke={colors.textPrimary} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </Svg>
  );
}

function StatusMessageIcon() {
  return (
    <Svg accessible={false} height={20} viewBox="0 0 24 24" width={20}>
      <Path d="M5 5.5h14v10H10l-4 3z" fill="none" stroke={colors.note} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </Svg>
  );
}

function EditIcon() {
  return (
    <Svg accessible={false} height={18} viewBox="0 0 24 24" width={18}>
      <Path d="m5 16.5-.8 3.3 3.3-.8L18.6 7.9a2.1 2.1 0 0 0-3-3Z" fill="none" stroke={colors.textPrimary} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      <Path d="m13.8 4.7 3 3" fill="none" stroke={colors.textPrimary} strokeLinecap="round" strokeWidth="1.7" />
    </Svg>
  );
}

export default function IndexRoute() {
  const [selection, setSelection] = useState('나의 현재 상태');
  const { currentStatus, saveStatus } = useLocalStatus();
  const { repeatingSchedules } = useLocalSchedules();
  const { notes, sendNote } = useLocalNotes();
  const [isStatusEditorVisible, setIsStatusEditorVisible] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [noteRecipientId, setNoteRecipientId] = useState<string | null>(null);
  const capacity = fixtureHouse.capacity;
  const currentMember = fixtureMembers.find((member) => member.id === fixtureCurrentUserId);
  const hasUnreadReceivedNote = notes.some(
    (note) => note.direction === 'received' && note.isUnread,
  );
  const effectiveStatus = useEffectiveStatus({
    events: fixtureStatusEvents,
    houseTimeZone: fixtureHouse.timeZone,
    memberStatus: {
      membershipStatus: currentMember?.status ?? 'left',
      mode: currentStatus.values.mode,
      activityState: currentStatus.values.activityState,
      lightOn: currentStatus.values.lightOn,
      moodKey: currentStatus.values.moodKey,
      moodLabel: currentStatus.values.moodLabel || null,
      statusMessage: currentStatus.values.statusMessage || null,
      manualUntil: currentStatus.manualUntil,
    },
    schedules: toStatusSchedules(repeatingSchedules),
  });
  const members: readonly HouseWindowMember[] = fixtureMembers.map((member) =>
    member.id === fixtureCurrentUserId
      ? {
          ...member,
          activityState: effectiveStatus.activityState,
          lightOn: effectiveStatus.lightOn,
          moodKey: effectiveStatus.moodKey,
          moodLabel: effectiveStatus.moodLabel,
          statusMessage: effectiveStatus.statusMessage,
          hasUnreadNoteForMe: hasUnreadReceivedNote,
        }
      : { ...member, hasUnreadNoteForMe: false },
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
    saveStatus(nextStatus);
    setSelection(
      nextStatus.mode === 'auto'
        ? '자동 모드가 현재 반복 스케줄에 맞춰 창문을 바꿔요.'
        : `${nextStatus.statusMessage || '내 상태'}를 창문에 반영했어요.`,
    );
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

    sendNote({ recipientNickname: noteRecipient.nickname, value });
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
          <View style={styles.headerIcon}>
            <HeaderHomeIcon />
          </View>
          <Text accessibilityRole="header" style={styles.title}>집</Text>
          <View style={styles.headerSpacer} />
        </View>

        <HouseScene
          capacity={capacity}
          currentUserId={fixtureCurrentUserId}
          houseType={fixtureHouse.houseType}
          isOwner={fixtureHouse.isOwner}
          members={members}
          onPressEmptySlot={onPressEmptySlot}
          onPressMember={onPressMember}
          onPressMyRoom={onPressMyRoom}
          timeOfDay={fixtureHouse.timeOfDay}
        />

        <Pressable
          accessibilityLabel="내 상태 바꾸기. 현재 상태 요약"
          accessibilityRole="button"
          onPress={() => setIsStatusEditorVisible(true)}
          style={({ pressed }) => [styles.statusCard, pressed ? styles.pressed : null]}
        >
          <View style={styles.statusIcon}>
            <StatusMessageIcon />
          </View>
          <View style={styles.statusCopy}>
            <Text style={styles.statusTitle}>{activityStateLabels[effectiveStatus.activityState]}</Text>
            <Text accessibilityLiveRegion="polite" style={styles.statusDescription}>{selection}</Text>
          </View>
          <View style={styles.editIcon}>
            <EditIcon />
          </View>
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
              initialValue={currentStatus.values}
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
    gap: spacing.xl,
    paddingBottom: spacing.section,
    paddingHorizontal: spacing.page,
    paddingTop: spacing.sm,
  },
  scroll: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 36,
  },
  headerIcon: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  headerSpacer: {
    width: 32,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.body,
  },
  statusCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 66,
    paddingHorizontal: spacing.md,
  },
  statusIcon: {
    alignItems: 'center',
    backgroundColor: '#FCE8EB',
    borderColor: '#F4CDD4',
    borderRadius: radius.sm,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  statusCopy: {
    flex: 1,
    gap: 1,
    marginLeft: spacing.sm,
  },
  statusTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.caption,
  },
  statusDescription: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
  },
  editIcon: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  editorContainer: {
    backgroundColor: colors.backgroundDay,
    flex: 1,
  },
  pressed: {
    opacity: 0.74,
  },
});
