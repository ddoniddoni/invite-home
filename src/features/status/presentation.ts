import type { ActivityState, MoodKey } from '@/features/houses/types';

import type { ManualUntil } from './status.schema';

export const activityStateLabels: Record<ActivityState, string> = {
  available: '대화 가능',
  work: '업무 중',
  focus: '집중 중',
  rest: '쉬는 중',
  sleep: '취침 중',
  away: '자리 비움',
  dnd: '혼자 있고 싶음',
};

export const moodKeyLabels: Record<MoodKey, string> = {
  amber: '호박빛',
  peach: '복숭아빛',
  rose: '장밋빛',
  mint: '민트빛',
  sky: '하늘빛',
  indigo: '남빛',
  violet: '보랏빛',
  gray: '회색빛',
};

export const manualUntilLabels: Record<ManualUntil, string> = {
  indefinite: '계속 유지',
  tonight: '오늘 23:00까지',
  tomorrowMorning: '내일 08:00까지',
};
