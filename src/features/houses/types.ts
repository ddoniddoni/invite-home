export type HouseType = 'apartment' | 'villa' | 'detached';

export type ActivityState =
  | 'available'
  | 'work'
  | 'focus'
  | 'rest'
  | 'sleep'
  | 'away'
  | 'dnd';

export type MoodKey =
  | 'amber'
  | 'peach'
  | 'rose'
  | 'mint'
  | 'sky'
  | 'indigo'
  | 'violet'
  | 'gray';

export type MembershipStatus = 'pending' | 'active';

export type HouseWindowMember = {
  id: string;
  roomSlot: number;
  nickname: string;
  status: MembershipStatus;
  lightOn: boolean;
  moodKey: MoodKey | null;
  activityState: ActivityState;
  hasUnreadNoteForMe: boolean;
};

export type TimeOfDay = 'day' | 'evening' | 'night';
