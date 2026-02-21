import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { getRecurringEvents } from '@/lib/database';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function WeekScreen() {
  const events = getRecurringEvents();

  const weeklyAnchors = events.filter((event) => event.category === 'Weekly Anchor');
  const creativeBlocks = events.filter((event) => event.category === 'Creative Block');

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Weekly Anchors</Text>
      {weeklyAnchors.map((event) => (
        <View key={event.id} style={styles.card}>
          <Text style={styles.cardTitle}>{days[event.weekday]} • {event.title}</Text>
          <Text>{event.time}</Text>
        </View>
      ))}

      <Text style={styles.title}>Creative Blocks</Text>
      {creativeBlocks.map((event) => (
        <View key={event.id} style={styles.card}>
          <Text style={styles.cardTitle}>{days[event.weekday]} • {event.title}</Text>
          <Text>{event.time}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f6f7fb' },
  content: { padding: 16, gap: 10, paddingBottom: 30 },
  title: { fontSize: 24, fontWeight: '700', marginTop: 8 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#e7e9f1' },
  cardTitle: { fontWeight: '700' },
});
