import { formatWeekdays } from '../presentation';

describe('formatWeekdays', () => {
  it('매일과 월–금 패턴을 짧게 표시한다', () => {
    expect(formatWeekdays([0, 1, 2, 3, 4, 5, 6])).toBe('매일');
    expect(formatWeekdays([1, 2, 3, 4, 5])).toBe('월–금');
  });
});
