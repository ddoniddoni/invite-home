import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabBar } from '@/components/navigation/bottom-tab-bar';
import { MyRoomScreen } from '@/components/status/my-room-screen';
import { fixtureCurrentStatus, fixtureMembers, fixtureCurrentUserId } from '@/fixtures/house.fixture';
import { colors } from '@/theme/tokens';

const currentMember = fixtureMembers.find((member) => member.id === fixtureCurrentUserId);

export default function MyRoomRoute() {
  if (!currentMember) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <MyRoomScreen
          initialStatus={fixtureCurrentStatus}
          nickname={currentMember.nickname}
          onClose={() => router.navigate('/')}
        />
      </View>
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundDay,
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
