import Svg, { Path, Rect } from 'react-native-svg';

import type { HouseType } from '@/features/houses/types';
import { colors } from '@/theme/tokens';

type HouseBuildingProps = {
  houseType: HouseType;
};

function ApartmentFacade() {
  return (
    <>
      <Rect fill={colors.buildingShadow} height="323" opacity={0.34} rx="10" width="274" x="30" y="68" />
      <Rect fill={colors.buildingApartment} height="323" rx="9" width="274" x="22" y="60" />
      <Rect fill={colors.surfaceMuted} height="21" rx="5" width="250" x="34" y="43" />
      <Rect fill={colors.surface} height="13" opacity={0.48} width="5" x="31" y="74" />
      <Path d="M22 382h274" opacity={0.36} stroke={colors.buildingShadow} strokeWidth="3" />
      <Rect fill={colors.windowOff} height="44" rx="4" width="40" x="140" y="338" />
    </>
  );
}

function VillaFacade() {
  return (
    <>
      <Path d="M30 181 160 48l130 133Z" fill={colors.buildingShadow} opacity={0.34} />
      <Path d="M24 171 160 35l136 136Z" fill={colors.primary} />
      <Rect fill={colors.buildingVilla} height="222" rx="9" width="266" x="27" y="164" />
      <Path d="M27 164h266" opacity={0.34} stroke={colors.buildingShadow} strokeWidth="4" />
      <Rect fill={colors.windowOff} height="53" rx="4" width="44" x="138" y="333" />
      <Path d="M45 196h230" opacity={0.28} stroke={colors.surface} strokeWidth="3" />
    </>
  );
}

function DetachedFacade() {
  return (
    <>
      <Rect fill={colors.buildingShadow} height="206" opacity={0.34} rx="10" width="232" x="47" y="180" />
      <Path d="M34 189 160 62l126 127Z" fill={colors.primary} />
      <Path d="M44 180 160 65l116 115Z" fill={colors.buildingDetached} />
      <Rect fill={colors.buildingDetached} height="202" rx="8" width="232" x="44" y="174" />
      <Rect fill={colors.buildingShadow} height="61" rx="3" width="20" x="224" y="88" />
      <Rect fill={colors.windowOff} height="61" rx="4" width="46" x="137" y="315" />
      <Path d="M44 174h232" opacity={0.34} stroke={colors.buildingShadow} strokeWidth="4" />
    </>
  );
}

export function HouseBuilding({ houseType }: HouseBuildingProps) {
  return (
    <Svg accessible={false} height="100%" viewBox="0 0 320 420" width="100%">
      <Rect fill={colors.backgroundDay} height="420" width="320" />
      {houseType === 'apartment' ? <ApartmentFacade /> : null}
      {houseType === 'villa' ? <VillaFacade /> : null}
      {houseType === 'detached' ? <DetachedFacade /> : null}
    </Svg>
  );
}
