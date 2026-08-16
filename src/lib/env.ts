import { z } from 'zod';

const publicEnvSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z
    .string()
    .trim()
    .url('EXPO_PUBLIC_SUPABASE_URL은 올바른 URL이어야 해요.'),
  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .trim()
    .min(1, 'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY가 필요해요.'),
  EXPO_PUBLIC_APP_SCHEME: z
    .string()
    .trim()
    .regex(/^[a-z][a-z0-9+.-]*$/, 'EXPO_PUBLIC_APP_SCHEME 형식을 확인해 주세요.'),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

export function parsePublicEnv(input: Record<string, string | undefined>): PublicEnv {
  const result = publicEnvSchema.safeParse(input);

  if (!result.success) {
    const invalidFields = [
      ...new Set(result.error.issues.map((issue) => issue.path.join('.'))),
    ].join(', ');

    throw new Error(`공개 환경 변수 설정을 확인해 주세요: ${invalidFields}`);
  }

  return result.data;
}

export function getPublicEnv(): PublicEnv {
  return parsePublicEnv({
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    EXPO_PUBLIC_APP_SCHEME: process.env.EXPO_PUBLIC_APP_SCHEME,
  });
}
