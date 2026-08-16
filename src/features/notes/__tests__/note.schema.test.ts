import { noteFormSchema } from '../note.schema';

describe('noteFormSchema', () => {
  it('메모 본문의 앞뒤 공백을 제거한다', () => {
    expect(noteFormSchema.parse({ body: '  잘 지내?  ', type: 'memo' })).toEqual({
      body: '잘 지내?',
      type: 'memo',
    });
  });

  it('비어 있거나 120자를 넘는 메모를 거부한다', () => {
    expect(noteFormSchema.safeParse({ body: '   ', type: 'memo' }).success).toBe(false);
    expect(noteFormSchema.safeParse({ body: '가'.repeat(121), type: 'memo' }).success).toBe(false);
  });
});
