import { parsePublicEnv } from '../env';

describe('parsePublicEnv', () => {
  it('검증된 공개 환경 변수만 반환한다', () => {
    const env = parsePublicEnv({
      EXPO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'public-key',
      EXPO_PUBLIC_APP_SCHEME: 'ourhome',
    });

    expect(env).toEqual({
      EXPO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'public-key',
      EXPO_PUBLIC_APP_SCHEME: 'ourhome',
    });
  });

  it('누락된 값의 이름을 포함한 안전한 오류를 반환한다', () => {
    expect(() =>
      parsePublicEnv({
        EXPO_PUBLIC_SUPABASE_URL: '',
        EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: '',
        EXPO_PUBLIC_APP_SCHEME: '1-invalid',
      }),
    ).toThrow(
      '공개 환경 변수 설정을 확인해 주세요: EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY, EXPO_PUBLIC_APP_SCHEME',
    );
  });
});
