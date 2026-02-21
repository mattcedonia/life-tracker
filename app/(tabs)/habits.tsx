import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Screen from '@/components/screen';
import { Card, H1, H2, Muted, Pill, PrimaryButton, SecondaryButton, SectionLabel } from '@/components/ui';
import { getHabits, setHabitStatus, todayKey, type Habit } from '@/lib/db';
import { theme } from '@/lib/theme';

export default function HabitsScreen() {
  const db = useSQLiteContext();
  const [habits, setHabits] = useState<Habit[]>([]);

  const load = useCallback(async () => {
    setHabits(await getHabits(db));
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  return (
    <Screen>
      <Muted>{todayKey()}</Muted>
      <H1>Life Tracker</H1>
      <SectionLabel>Habits</SectionLabel>
      <Muted>Grace Mode protects streaks up to 2x per week.</Muted>

      {habits.map((habit) => (
        <Card key={habit.id} style={styles.habitCard}>
          <View style={styles.topRow}>
            <H2>{habit.name}</H2>
            <Pill label={`Streak ${habit.streak}`} />
          </View>
          <Muted>Grace left this week: {habit.graceLeft}</Muted>
          <Muted>Today: {habit.todayStatus ?? 'pending'}</Muted>
          <View style={styles.actionRow}>
            <PrimaryButton
              label="Done"
              onPress={async () => {
                await setHabitStatus(db, habit.id, 'done');
                await load();
              }}
              style={styles.flexBtn}
            />
            <SecondaryButton
              label="Grace"
              disabled={habit.graceLeft <= 0}
              onPress={async () => {
                if (habit.graceLeft <= 0) {
                  return;
                }
                await setHabitStatus(db, habit.id, 'grace');
                await load();
              }}
              style={styles.flexBtn}
            />
            <SecondaryButton
              label="Miss"
              onPress={async () => {
                await setHabitStatus(db, habit.id, 'miss');
                await load();
              }}
              style={styles.flexBtn}
            />
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  habitCard: { backgroundColor: theme.cardAlt, gap: 10 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  actionRow: { flexDirection: 'row', gap: 8 },
  flexBtn: { flex: 1 },
});
