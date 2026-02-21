import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Screen from '@/components/screen';
import { Card, H1, H2, Muted, SectionLabel } from '@/components/ui';
import { getAnchors, todayKey, type Anchor } from '@/lib/db';
import { theme } from '@/lib/theme';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function WeekScreen() {
  const db = useSQLiteContext();
  const [anchors, setAnchors] = useState<Anchor[]>([]);

  useFocusEffect(
    useCallback(() => {
      void getAnchors(db).then(setAnchors);
    }, [db])
  );

  return (
    <Screen>
      <Muted>{todayKey()}</Muted>
      <H1>Life Tracker</H1>
      <SectionLabel>Weekly Anchors</SectionLabel>
      <Muted>Recurring anchors keep your week stable.</Muted>

      {dayNames.map((day, index) => {
        const dayAnchors = anchors.filter((anchor) => anchor.weekday === index);
        return (
          <Card key={day} style={styles.dayCard}>
            <H2>{day}</H2>
            <View style={styles.anchorList}>
              {dayAnchors.length ? (
                dayAnchors.map((anchor) => (
                  <View key={anchor.id} style={styles.anchorItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.anchorText}>{anchor.title}</Text>
                  </View>
                ))
              ) : (
                <Muted>No anchor set.</Muted>
              )}
            </View>
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  dayCard: { backgroundColor: theme.cardAlt },
  anchorList: { gap: 8 },
  anchorItem: { flexDirection: 'row', gap: 8 },
  bullet: { color: theme.muted, marginTop: 1 },
  anchorText: { color: theme.text, fontSize: 15 },
});
