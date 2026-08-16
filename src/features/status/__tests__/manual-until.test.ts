import { resolveManualUntil } from '../manual-until';

describe('resolveManualUntil', () => {
  it('무기한은 종료 시각을 만들지 않는다', () => {
    expect(resolveManualUntil('indefinite', new Date('2025-03-03T01:00:00.000Z'), 'Asia/Seoul')).toBeNull();
  });

  it('오늘 밤과 내일 아침을 집 시간대의 절대 시각으로 계산한다', () => {
    const savedAt = new Date('2025-03-03T01:00:00.000Z');

    expect(resolveManualUntil('tonight', savedAt, 'Asia/Seoul')).toEqual(new Date('2025-03-03T14:00:00.000Z'));
    expect(resolveManualUntil('tomorrowMorning', savedAt, 'Asia/Seoul')).toEqual(new Date('2025-03-03T23:00:00.000Z'));
  });
});
