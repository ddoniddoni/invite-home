import { scheduleFormSchema } from '../schedule.schema';

const validSchedule = {
  label: '취침 시간',
  daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  startTime: '23:00',
  endTime: '07:00',
  activityState: 'sleep',
  lightOn: false,
  enabled: true,
} as const;

describe('scheduleFormSchema', () => {
  it('자정을 넘기는 반복 스케줄을 허용한다', () => {
    expect(scheduleFormSchema.parse(validSchedule)).toEqual(validSchedule);
  });

  it('요일이 없거나 시작과 종료 시각이 같은 스케줄을 거부한다', () => {
    expect(scheduleFormSchema.safeParse({ ...validSchedule, daysOfWeek: [] }).success).toBe(false);
    expect(scheduleFormSchema.safeParse({ ...validSchedule, endTime: '23:00' }).success).toBe(false);
  });
});
