import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getHabits, getHabitCompletionsForDate, getIsoDate, logHabit } from '@/lib/database';

export default function HabitsScreen() {
  const [, setRefresh] = useState(0);
  const habits = getHabits();
  const today = getIsoDate();
  const completionSet = new Set<string>();
  getHabitCompletionsForDate(today).forEach((row) => completionSet.add(`${row.habitId}:${row.level}`));

  const grouped = habits.reduce<Record<string, typeof habits>>((acc, habit) => {
    acc[habit.pillarName] = [...(acc[habit.pillarName] ?? []), habit];
    return acc;
  }, {});

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {Object.entries(grouped).map(([pillar, pillarHabits]) => (
        <View key={pillar}>
          <Text style={styles.heading}>{pillar}</Text>
          {pillarHabits.map((habit) => (
            <View style={styles.row} key={habit.id}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{habit.name}</Text>
                <Text style={styles.sub}>Log today&apos;s win</Text>
              </View>
              <Pressable
                style={[styles.logButton, completionSet.has(`${habit.id}:minimum`) && styles.done]}
                onPress={() => {
                  logHabit(habit.id, today, 'minimum');
                  setRefresh((v) => v + 1);
                }}>
                <Text>Minimum</Text>
              </Pressable>
              <Pressable
                style={[styles.logButton, completionSet.has(`${habit.id}:standard`) && styles.done]}
                onPress={() => {
                  logHabit(habit.id, today, 'standard');
                  setRefresh((v) => v + 1);
                }}>
                <Text>Standard</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f6f7fb' },
  content: { padding: 16, gap: 10 },
  heading: { fontSize: 22, fontWeight: '700', marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderWidth: 1, borderColor: '#e7e9f1', borderRadius: 10, backgroundColor: '#fff' },
  name: { fontWeight: '700' },
  sub: { color: '#6b7280' },
  logButton: { paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, backgroundColor: '#fafafa' },
  done: { borderColor: '#86d69b', backgroundColor: '#f2fff5' },
});
