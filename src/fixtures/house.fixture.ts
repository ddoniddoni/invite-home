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
    moodLabel: '차분함',
    activityState: 'work',
    statusMessage: '퇴근 전 집중 중이에요.',
    publicTodaySchedules: [
      {
        id: 'fixture-schedule-narin',
        title: '저녁 산책',
        timeLabel: '20:30–21:10',
      },
    ],
    hasUnreadNoteForMe: false,
  },
  {
    id: 'fixture-user-minsu',
    roomSlot: 2,
    nickname: '민수',
    status: 'active',
    lightOn: false,
    moodKey: 'indigo',
    moodLabel: '느긋한 밤',
    activityState: 'sleep',
    statusMessage: '오늘은 일찍 잘게요.',
    publicTodaySchedules: [
      {
        id: 'fixture-schedule-minsu',
        title: '독서 시간',
        timeLabel: '21:00–22:00',
      },
    ],
    hasUnreadNoteForMe: true,
  },
  {
    id: 'fixture-user-yujin',
    roomSlot: 4,
    nickname: '유진',
    status: 'active',
    lightOn: true,
    moodKey: 'peach',
    moodLabel: '몰입 중',
    activityState: 'focus',
    statusMessage: '22시 전까지 답장이 느릴 수 있어요.',
    publicTodaySchedules: [
      {
        id: 'fixture-schedule-yujin',
        title: '디자인 마감',
        timeLabel: '19:00–21:30',
      },
    ],
    hasUnreadNoteForMe: false,
  },
  {
    id: 'fixture-user-sora',
    roomSlot: 5,
    nickname: '소라',
    status: 'pending',
    lightOn: true,
    moodKey: 'rose',
    moodLabel: null,
    activityState: 'away',
    statusMessage: null,
    publicTodaySchedules: [],
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
