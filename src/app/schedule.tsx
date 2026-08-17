import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabBar } from '@/components/navigation/bottom-tab-bar';
import { ScheduleScreen } from '@/components/schedules/schedule-screen';
import { useLocalSchedules } from '@/features/schedules/local-schedule-store';
import { fixtureTodaySchedules } from '@/fixtures/schedules.fixture';
import { colors } from '@/theme/tokens';

export default function ScheduleRoute() {
  const { repeatingSchedules, updateRepeatingSchedules } = useLocalSchedules();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ScheduleScreen
          onRepeatingSchedulesChange={updateRepeatingSchedules}
          repeatingSchedules={repeatingSchedules}
          todaySchedules={fixtureTodaySchedules}
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
