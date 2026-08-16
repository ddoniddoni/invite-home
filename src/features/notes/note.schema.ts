import { z } from 'zod';

export const noteTypeValues = ['memo', 'greeting'] as const;

export type NoteType = (typeof noteTypeValues)[number];

export const noteFormSchema = z.object({
  type: z.enum(noteTypeValues),
  body: z
    .string()
    .trim()
    .min(1, '메모 내용을 입력해 주세요.')
    .max(120, '메모는 120자 이하로 적어 주세요.'),
});

export type NoteFormValues = z.infer<typeof noteFormSchema>;
