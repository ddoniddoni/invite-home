import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import type { HouseType } from '@/features/houses/types';
import { colors } from '@/theme/tokens';

type HouseBuildingProps = {
  houseType: HouseType;
};

function ApartmentFacade() {
  return (
    <>
      <Rect fill={colors.buildingShadow} height="307" opacity={0.35} rx="12" width="270" x="30" y="85" />
      <Rect fill={colors.buildingApartment} height="307" rx="12" width="270" x="24" y="77" />
      <Rect fill={colors.windowFrame} height="22" rx="7" width="286" x="17" y="63" />
      <Rect fill={colors.surface} height="17" opacity={0.55} width="6" x="30" y="92" />
      <Path d="M24 358h270" opacity={0.35} stroke={colors.buildingShadow} strokeWidth="4" />
      <Rect fill={colors.windowFrame} height="54" rx="7" width="45" x="137" y="330" />
    </>
  );
}

function VillaFacade() {
  return (
    <>
      <Path d="M20 189 160 55l140 134Z" fill={colors.buildingShadow} opacity={0.4} />
      <Path d="M16 179 160 39l144 140Z" fill={colors.accentPlum} />
      <Rect fill={colors.buildingVilla} height="219" rx="10" width="270" x="25" y="170" />
      <Path d="M25 170h270" opacity={0.35} stroke={colors.buildingShadow} strokeWidth="5" />
      <Rect fill={colors.windowFrame} height="59" rx="8" width="48" x="136" y="330" />
      <Path d="M43 202h234" opacity={0.18} stroke={colors.surface} strokeWidth="4" />
    </>
  );
}

function DetachedFacade() {
  return (
    <>
      <Rect fill={colors.buildingShadow} height="208" opacity={0.35} rx="12" width="230" x="49" y="179" />
      <Path d="M35 190 160 67l125 123Z" fill={colors.accentPlum} />
      <Path d="M45 181 160 68l115 113Z" fill={colors.buildingDetached} />
      <Rect fill={colors.buildingDetached} height="204" rx="9" width="230" x="45" y="177" />
      <Rect fill={colors.buildingShadow} height="65" rx="3" width="22" x="224" y="88" />
      <Rect fill={colors.windowFrame} height="65" rx="8" width="52" x="134" y="316" />
      <Path d="M45 177h230" opacity={0.35} stroke={colors.buildingShadow} strokeWidth="5" />
    </>
  );
}

export function HouseBuilding({ houseType }: HouseBuildingProps) {
  return (
    <Svg accessibilityElementsHidden height="100%" viewBox="0 0 320 420" width="100%">
      <Defs>
        <LinearGradient id="ground" x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0" stopColor={colors.buildingShadow} stopOpacity="0.04" />
          <Stop offset="1" stopColor={colors.buildingShadow} stopOpacity="0.24" />
        </LinearGradient>
      </Defs>
      <Circle cx="267" cy="58" fill={colors.moon} opacity={0.9} r="19" />
      <Rect fill="url(#ground)" height="62" width="320" y="358" />
      {houseType === 'apartment' ? <ApartmentFacade /> : null}
      {houseType === 'villa' ? <VillaFacade /> : null}
      {houseType === 'detached' ? <DetachedFacade /> : null}
    </Svg>
  );
}
