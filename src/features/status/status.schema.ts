import { z } from 'zod';

export const activityStateValues = [
  'available',
  'work',
  'focus',
  'rest',
  'sleep',
  'away',
  'dnd',
] as const;

export const moodKeyValues = [
  'amber',
  'peach',
  'rose',
  'mint',
  'sky',
  'indigo',
  'violet',
  'gray',
] as const;

export const manualUntilValues = ['indefinite', 'tonight', 'tomorrowMorning'] as const;

export type ManualUntil = (typeof manualUntilValues)[number];

export const statusFormSchema = z.object({
  mode: z.enum(['auto', 'manual']),
  activityState: z.enum(activityStateValues),
  lightOn: z.boolean(),
  moodKey: z.enum(moodKeyValues).nullable(),
  moodLabel: z.string().trim().max(12, '감정 라벨은 12자 이하로 적어 주세요.'),
  statusMessage: z
    .string()
    .trim()
    .max(30, '상태 메시지는 30자 이하로 적어 주세요.')
    .refine((value) => !/[\r\n]/.test(value), '상태 메시지는 한 줄로 적어 주세요.'),
  manualUntil: z.enum(manualUntilValues),
});

export type StatusFormValues = z.infer<typeof statusFormSchema>;
