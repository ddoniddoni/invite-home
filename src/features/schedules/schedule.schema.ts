import { z } from 'zod';

import { activityStateValues } from '@/features/status/status.schema';

export const weekdayValues = [0, 1, 2, 3, 4, 5, 6] as const;

const weekdaySchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
]);

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, '시각은 HH:MM 형식으로 입력해 주세요.');

export const scheduleFormSchema = z
  .object({
    label: z.string().trim().min(1, '스케줄 이름을 입력해 주세요.').max(20, '스케줄 이름은 20자 이하로 적어 주세요.'),
    daysOfWeek: z.array(weekdaySchema).min(1, '요일을 하나 이상 선택해 주세요.'),
    startTime: timeSchema,
    endTime: timeSchema,
    activityState: z.enum(activityStateValues),
    lightOn: z.boolean(),
    enabled: z.boolean(),
  })
  .refine((value) => value.startTime !== value.endTime, {
    message: '시작과 종료 시각은 다르게 입력해 주세요.',
    path: ['endTime'],
  });

export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;
