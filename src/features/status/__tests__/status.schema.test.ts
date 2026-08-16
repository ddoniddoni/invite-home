import { statusFormSchema } from '../status.schema';

const validStatus = {
  mode: 'manual' as const,
  activityState: 'work' as const,
  lightOn: true,
  moodKey: 'mint' as const,
  moodLabel: '차분함',
  statusMessage: '회의 끝나고 돌아올게요',
  manualUntil: 'tonight' as const,
};

describe('statusFormSchema', () => {
  it('유효한 로컬 상태 편집 값을 허용한다', () => {
    expect(statusFormSchema.parse(validStatus)).toEqual(validStatus);
  });

  it('상태 메시지의 줄바꿈과 길이 초과를 거부한다', () => {
    expect(
      statusFormSchema.safeParse({ ...validStatus, statusMessage: '한 줄\n두 줄' }).success,
    ).toBe(false);
    expect(
      statusFormSchema.safeParse({ ...validStatus, statusMessage: '가'.repeat(31) }).success,
    ).toBe(false);
  });
});
