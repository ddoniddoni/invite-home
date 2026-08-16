import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabBar } from '@/components/navigation/bottom-tab-bar';
import { NotesScreen } from '@/components/notes/notes-screen';
import { fixtureNotes } from '@/fixtures/notes.fixture';
import { colors } from '@/theme/tokens';

export default function NotesRoute() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <NotesScreen notes={fixtureNotes} />
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
