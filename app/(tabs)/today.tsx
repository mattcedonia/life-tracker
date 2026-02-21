import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  addJournalEntry,
  calculateStreak,
  getHabits,
  getHabitCompletionsForDate,
  getIsoDate,
  getRecurringEvents,
  logHabit,
  removeHabitLog,
  getSetting,
} from '@/lib/database';

const weekdayFocus: Record<number, string> = {
  0: 'Spiritual recharge and meeting prep',
  1: 'Creative momentum and planning',
  2: 'Family worship leadership',
  3: 'Meeting encouragement',
  4: 'Letter writing and review block',
  5: 'Marriage + date night presence',
  6: 'Field service and artist date flow',
};

const minimumPillars = ['Spiritual', 'Marriage', 'Health', '3D', 'Music'];

export default function TodayScreen() {
  const [journalText, setJournalText] = useState('');
  const [, setRefresh] = useState(0);

  const today = getIsoDate();
  const weekday = new Date().getDay();
  const habits = getHabits();
  const completionSet = new Set<string>();
  getHabitCompletionsForDate(today).forEach((row) => completionSet.add(`${row.habitId}:${row.level}`));
  const anchors = getRecurringEvents(weekday);
  const graceMode = getSetting('graceMode') === '1';

  const minimumHabits = habits.filter((habit) => minimumPillars.includes(habit.pillarName));

  const toggleMinimum = (habitId: number) => {
    if (completionSet.has(`${habitId}:minimum`)) {
      removeHabitLog(habitId, today, 'minimum');
    } else {
      logHabit(habitId, today, 'minimum');
    }
    setRefresh((prev) => prev + 1);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Today&apos;s Focus</Text>
      <Text style={styles.card}>{weekdayFocus[weekday]}</Text>

      <Text style={styles.section}>Minimum Wins</Text>
      {minimumHabits.map((habit) => {
        const checked = completionSet.has(`${habit.id}:minimum`) || completionSet.has(`${habit.id}:standard`);
        return (
          <Pressable key={habit.id} onPress={() => toggleMinimum(habit.id)} style={[styles.row, checked && styles.rowDone]}>
            <Text style={styles.rowTitle}>{checked ? '✅' : '⬜️'} {habit.pillarName}</Text>
            <Text>{habit.name}</Text>
          </Pressable>
        );
      })}

      <Text style={styles.section}>Today&apos;s Scheduled Anchors</Text>
      {anchors.map((event) => (
        <View key={event.id} style={styles.cardRow}>
          <Text style={styles.rowTitle}>{event.title}</Text>
          <Text>{event.category} • {event.time ?? 'Any time'}</Text>
        </View>
      ))}

      <Text style={styles.section}>Quick Journal</Text>
      <TextInput
        placeholder="Capture one win, one lesson, one gratitude..."
        multiline
        value={journalText}
        onChangeText={setJournalText}
        style={styles.input}
      />
      <Pressable
        style={styles.button}
        onPress={() => {
          if (!journalText.trim()) return;
          addJournalEntry(journalText.trim(), 'quick');
          setJournalText('');
          setRefresh((prev) => prev + 1);
        }}>
        <Text style={styles.buttonText}>Save Journal Note</Text>
      </Pressable>

      <Text style={styles.section}>Streak Tiles</Text>
      <View style={styles.tilesWrap}>
        {minimumHabits.map((habit) => (
          <View key={`streak-${habit.id}`} style={styles.tile}>
            <Text style={styles.tileTitle}>{habit.pillarName}</Text>
            <Text style={styles.tileValue}>{calculateStreak(habit.id, graceMode)}d</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f6f7fb' },
  content: { padding: 16, gap: 10, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '700' },
  section: { fontSize: 20, fontWeight: '700', marginTop: 14 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#e7e9f1' },
  row: { backgroundColor: '#fff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#e7e9f1' },
  rowDone: { borderColor: '#86d69b', backgroundColor: '#f2fff5' },
  rowTitle: { fontWeight: '700', marginBottom: 2 },
  cardRow: { backgroundColor: '#fff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#e7e9f1' },
  input: { minHeight: 90, borderWidth: 1, borderColor: '#d4d8e6', borderRadius: 10, backgroundColor: '#fff', padding: 10, textAlignVertical: 'top' },
  button: { backgroundColor: '#111827', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  tilesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: { width: '31%', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e7e9f1', borderRadius: 10, padding: 10 },
  tileTitle: { fontSize: 12, color: '#6b7280' },
  tileValue: { fontSize: 20, fontWeight: '700' },
});
