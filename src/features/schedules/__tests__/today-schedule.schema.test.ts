import { todayScheduleFormSchema } from '../today-schedule.schema';

const validSchedule = {
  title: '늦은 저녁 약속',
  startTime: '20:00',
  endTime: '21:30',
  visibility: 'house',
} as const;

describe('todayScheduleFormSchema', () => {
  it('제목, 시간, 공개 범위를 가진 오늘 일정을 허용한다', () => {
    expect(todayScheduleFormSchema.parse(validSchedule)).toEqual(validSchedule);
  });

  it('제목이 없거나 종료 시각이 시작 시각보다 빠른 일정은 거부한다', () => {
    expect(todayScheduleFormSchema.safeParse({ ...validSchedule, title: '  ' }).success).toBe(false);
    expect(todayScheduleFormSchema.safeParse({ ...validSchedule, endTime: '20:00' }).success).toBe(false);
  });
});
