import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import {
  getHouseLayout,
  getSlotsForCapacity,
  type HouseSlotLayout,
} from '@/features/houses/config/house-layouts';
import type { HouseType, HouseWindowMember, TimeOfDay } from '@/features/houses/types';
import { colors } from '@/theme/tokens';

import { HouseBuilding } from './house-building';
import { EmptyWindowUnit, WindowUnit } from './window-unit';

export type HouseSceneProps = {
  houseType: HouseType;
  capacity: number;
  members: readonly HouseWindowMember[];
  currentUserId: string;
  isOwner: boolean;
  timeOfDay: TimeOfDay;
  onPressMember: (memberId: string) => void;
  onPressMyRoom: () => void;
  onPressEmptySlot: (slot: number) => void;
};

type SlotWindowProps = {
  slot: HouseSlotLayout;
  sceneWidth: number;
  sceneHeight: number;
  member: HouseWindowMember | undefined;
  currentUserId: string;
  isOwner: boolean;
  onPressMember: (memberId: string) => void;
  onPressMyRoom: () => void;
  onPressEmptySlot: (slot: number) => void;
};

const sceneBackgrounds: Record<TimeOfDay, string> = {
  day: colors.skyDay,
  evening: colors.skyEvening,
  night: colors.skyNight,
};

function getSlotPosition(
  slot: HouseSlotLayout,
  sceneWidth: number,
  sceneHeight: number,
): StyleProp<ViewStyle> {
  return {
    height: `${(slot.height / sceneHeight) * 100}%`,
    left: `${(slot.x / sceneWidth) * 100}%`,
    position: 'absolute',
    top: `${(slot.y / sceneHeight) * 100}%`,
    width: `${(slot.width / sceneWidth) * 100}%`,
  };
}

function SlotWindow({
  currentUserId,
  isOwner,
  member,
  onPressEmptySlot,
  onPressMember,
  onPressMyRoom,
  sceneHeight,
  sceneWidth,
  slot,
}: SlotWindowProps) {
  const onPress = () => {
    if (!member) {
      if (isOwner) {
        onPressEmptySlot(slot.slot);
      }
      return;
    }

    if (member.id === currentUserId) {
      onPressMyRoom();
      return;
    }

    onPressMember(member.id);
  };

  const position = getSlotPosition(slot, sceneWidth, sceneHeight);

  if (!member) {
    return <EmptyWindowUnit isOwner={isOwner} onPress={onPress} slot={slot.slot} style={position} />;
  }

  return (
    <WindowUnit
      activityState={member.activityState}
      hasUnreadNoteForMe={member.hasUnreadNoteForMe}
      isMine={member.id === currentUserId}
      isPending={member.status === 'pending'}
      lightOn={member.lightOn}
      moodKey={member.moodKey}
      nickname={member.nickname}
      onPress={onPress}
      slot={slot.slot}
      style={position}
    />
  );
}

export function HouseScene({
  capacity,
  currentUserId,
  houseType,
  isOwner,
  members,
  onPressEmptySlot,
  onPressMember,
  onPressMyRoom,
  timeOfDay,
}: HouseSceneProps) {
  const layout = getHouseLayout(houseType);
  const slots = getSlotsForCapacity(houseType, capacity);
  const membersBySlot = new Map(members.map((member) => [member.roomSlot, member]));

  return (
    <View style={[styles.container, { backgroundColor: sceneBackgrounds[timeOfDay] }]}>
      <View
        style={[
          styles.scene,
          { aspectRatio: layout.viewBox.width / layout.viewBox.height },
        ]}
      >
        <View style={[StyleSheet.absoluteFill, styles.buildingLayer]}>
          <HouseBuilding houseType={houseType} />
        </View>
        <View style={[StyleSheet.absoluteFill, styles.windowLayer]}>
          {slots.map((slot) => (
            <SlotWindow
              currentUserId={currentUserId}
              isOwner={isOwner}
              key={slot.slot}
              member={membersBySlot.get(slot.slot)}
              onPressEmptySlot={onPressEmptySlot}
              onPressMember={onPressMember}
              onPressMyRoom={onPressMyRoom}
              sceneHeight={layout.viewBox.height}
              sceneWidth={layout.viewBox.width}
              slot={slot}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  scene: {
    width: '100%',
  },
  buildingLayer: {
    pointerEvents: 'none',
  },
  windowLayer: {
    pointerEvents: 'box-none',
  },
});
