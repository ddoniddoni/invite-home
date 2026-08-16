import { router } from 'expo-router';

import { WaitingRoom } from '@/components/onboarding/waiting-room';
import { fixtureWaitingRoom } from '@/fixtures/house.fixture';

export default function WaitingRoomRoute() {
  return (
    <WaitingRoom
      houseName={fixtureWaitingRoom.houseName}
      houseType={fixtureWaitingRoom.houseType}
      moveInAvailableAt={fixtureWaitingRoom.moveInAvailableAt}
      onEnterHouse={() => router.replace('/')}
      onLeaveHouse={() => router.back()}
      ownerNickname={fixtureWaitingRoom.ownerNickname}
    />
  );
}
