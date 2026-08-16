import { getHouseLayout, getSlotsForCapacity } from '@/features/houses/config/house-layouts';

describe('house layouts', () => {
  it.each([
    ['apartment', 8],
    ['villa', 6],
    ['detached', 4],
  ] as const)('%s has %i fixed room slots', (houseType, expectedSlotCount) => {
    expect(getHouseLayout(houseType).slots).toHaveLength(expectedSlotCount);
    expect(getSlotsForCapacity(houseType, expectedSlotCount)).toHaveLength(expectedSlotCount);
  });

  it('rejects a capacity outside the selected house layout', () => {
    expect(() => getSlotsForCapacity('villa', 7)).toThrow(
      'villa의 수용 인원은 1~6명이어야 해요.',
    );
  });
});
