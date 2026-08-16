import { z } from 'zod';

export const todayScheduleVisibilityValues = ['house', 'private'] as const;

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, '시각은 HH:MM 형식으로 입력해 주세요.');

export const todayScheduleFormSchema = z
  .object({
    title: z.string().trim().min(1, '일정 제목을 입력해 주세요.').max(40, '일정 제목은 40자 이하로 적어 주세요.'),
    startTime: timeSchema,
    endTime: timeSchema,
    visibility: z.enum(todayScheduleVisibilityValues),
  })
  .refine((value) => value.startTime < value.endTime, {
    message: '종료 시각은 시작 시각보다 뒤여야 해요.',
    path: ['endTime'],
  });

export type TodayScheduleFormValues = z.infer<typeof todayScheduleFormSchema>;
