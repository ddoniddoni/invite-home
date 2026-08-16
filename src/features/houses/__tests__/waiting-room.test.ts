import { formatRemainingTime, getRemainingSeconds } from '../waiting-room';

describe('waiting room countdown', () => {
  it('입주 가능 시각이 지난 경우 남은 시간을 0초로 고정한다', () => {
    expect(getRemainingSeconds('2026-08-17T00:00:00.000Z', Date.parse('2026-08-17T00:00:01.000Z'))).toBe(0);
    expect(getRemainingSeconds('not-a-date', Date.now())).toBe(0);
  });

  it('남은 시간을 시:분:초 형식으로 표시한다', () => {
    expect(formatRemainingTime(3661)).toBe('01:01:01');
    expect(formatRemainingTime(-1)).toBe('00:00:00');
  });
});
