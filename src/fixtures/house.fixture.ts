import type { HouseType, HouseWindowMember, TimeOfDay } from '@/features/houses/types';
import type { StatusFormValues } from '@/features/status/status.schema';

export const fixtureCurrentUserId = 'fixture-user-narin';

export const fixtureHouse = {
  name: '한강이 보이는 우리집',
  houseType: 'apartment' as HouseType,
  capacity: 8,
  timeOfDay: 'evening' as TimeOfDay,
  isOwner: true,
};

export const fixtureMembers: readonly HouseWindowMember[] = [
  {
    id: fixtureCurrentUserId,
    roomSlot: 1,
    nickname: '나린',
    status: 'active',
    lightOn: true,
    moodKey: 'mint',
    activityState: 'work',
    hasUnreadNoteForMe: false,
  },
  {
    id: 'fixture-user-minsu',
    roomSlot: 2,
    nickname: '민수',
    status: 'active',
    lightOn: false,
    moodKey: 'indigo',
    activityState: 'sleep',
    hasUnreadNoteForMe: true,
  },
  {
    id: 'fixture-user-yujin',
    roomSlot: 4,
    nickname: '유진',
    status: 'active',
    lightOn: true,
    moodKey: 'peach',
    activityState: 'focus',
    hasUnreadNoteForMe: false,
  },
  {
    id: 'fixture-user-sora',
    roomSlot: 5,
    nickname: '소라',
    status: 'pending',
    lightOn: true,
    moodKey: 'rose',
    activityState: 'away',
    hasUnreadNoteForMe: false,
  },
];

export const fixtureCurrentStatus: StatusFormValues = {
  mode: 'manual',
  activityState: 'work',
  lightOn: true,
  moodKey: 'mint',
  moodLabel: '차분함',
  statusMessage: '퇴근 전 집중 중이에요.',
  manualUntil: 'tonight',
};
