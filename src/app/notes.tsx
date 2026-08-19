import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabBar } from '@/components/navigation/bottom-tab-bar';
import { NotesScreen } from '@/components/notes/notes-screen';
import { useLocalNotes } from '@/features/notes/local-note-store';
import { colors } from '@/theme/tokens';

export default function NotesRoute() {
  const { notes } = useLocalNotes();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <NotesScreen notes={notes} />
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
