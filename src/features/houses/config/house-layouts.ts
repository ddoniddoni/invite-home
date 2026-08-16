import type { HouseType } from '../types';

export type HouseSlotLayout = {
  slot: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type HouseLayout = {
  viewBox: {
    width: number;
    height: number;
  };
  slots: readonly HouseSlotLayout[];
};

export const houseTypeLabels: Record<HouseType, string> = {
  apartment: '아파트',
  villa: '빌라',
  detached: '단독주택',
};

const viewBox = {
  width: 320,
  height: 420,
} as const;

export const houseLayouts: Record<HouseType, HouseLayout> = {
  apartment: {
    viewBox,
    slots: [
      { slot: 1, x: 42, y: 95, width: 54, height: 66 },
      { slot: 2, x: 132, y: 95, width: 54, height: 66 },
      { slot: 3, x: 222, y: 95, width: 54, height: 66 },
      { slot: 4, x: 42, y: 186, width: 54, height: 66 },
      { slot: 5, x: 132, y: 186, width: 54, height: 66 },
      { slot: 6, x: 222, y: 186, width: 54, height: 66 },
      { slot: 7, x: 87, y: 278, width: 54, height: 66 },
      { slot: 8, x: 177, y: 278, width: 54, height: 66 },
    ],
  },
  villa: {
    viewBox,
    slots: [
      { slot: 1, x: 48, y: 164, width: 54, height: 66 },
      { slot: 2, x: 133, y: 164, width: 54, height: 66 },
      { slot: 3, x: 218, y: 164, width: 54, height: 66 },
      { slot: 4, x: 48, y: 254, width: 54, height: 66 },
      { slot: 5, x: 133, y: 254, width: 54, height: 66 },
      { slot: 6, x: 218, y: 254, width: 54, height: 66 },
    ],
  },
  detached: {
    viewBox,
    slots: [
      { slot: 1, x: 65, y: 183, width: 54, height: 66 },
      { slot: 2, x: 201, y: 183, width: 54, height: 66 },
      { slot: 3, x: 65, y: 273, width: 54, height: 66 },
      { slot: 4, x: 201, y: 273, width: 54, height: 66 },
    ],
  },
};

export function getHouseLayout(houseType: HouseType): HouseLayout {
  return houseLayouts[houseType];
}

export function getSlotsForCapacity(
  houseType: HouseType,
  capacity: number,
): readonly HouseSlotLayout[] {
  const layout = getHouseLayout(houseType);

  if (!Number.isInteger(capacity) || capacity < 1 || capacity > layout.slots.length) {
    throw new RangeError(`${houseType}의 수용 인원은 1~${layout.slots.length}명이어야 해요.`);
  }

  return layout.slots.slice(0, capacity);
}
