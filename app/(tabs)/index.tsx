import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Screen from '@/components/screen';
import { Card, H1, IconTile, Muted, SectionLabel } from '@/components/ui';
import { getTodayWins, toggleWin, todayKey, type MinimumWin } from '@/lib/db';
import { theme } from '@/lib/theme';

export default function TodayScreen() {
  const db = useSQLiteContext();
  const [wins, setWins] = useState<MinimumWin[]>([]);

  const load = useCallback(async () => {
    setWins(await getTodayWins(db));
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const completed = useMemo(() => wins.filter((win) => win.doneToday).length, [wins]);

  return (
    <Screen>
      <Muted>{todayKey()}</Muted>
      <H1>Life Tracker</H1>

      <Card>
        <SectionLabel>Today&apos;s Focus</SectionLabel>
        <View style={styles.summaryRow}>
          <IconTile>
            <Text style={styles.iconGlyph}>✓</Text>
          </IconTile>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.focusTitle}>{completed}/{wins.length} minimum wins complete</Text>
            <Muted>Stack small wins to keep momentum steady.</Muted>
          </View>
        </View>
      </Card>

      <SectionLabel>Minimum Wins Today</SectionLabel>
      {wins.map((win) => (
        <Card key={win.id} style={styles.winCard}>
          <Pressable
            onPress={async () => {
              await toggleWin(db, win.id, win.doneToday ? 0 : 1);
              await load();
            }}
            style={styles.checkRow}>
            <View style={[styles.checkTile, win.doneToday ? styles.checkTileDone : null]}>
              <Text style={styles.check}>{win.doneToday ? '☑' : '☐'}</Text>
            </View>
            <Text style={styles.winTitle}>{win.title}</Text>
          </Pressable>
        </Card>
      ))}
      <Muted>Complete all wins to lock in momentum.</Muted>
    </Screen>
  );
}

const styles = StyleSheet.create({
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconGlyph: { color: theme.accent, fontWeight: '800', fontSize: 18 },
  focusTitle: { fontSize: 16, color: theme.text, fontWeight: '700' },
  winCard: { backgroundColor: theme.cardAlt },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkTile: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
  },
  checkTileDone: {
    backgroundColor: theme.accentSoft,
  },
  check: { fontSize: 18, color: theme.text },
  winTitle: { fontSize: 16, color: theme.text, fontWeight: '600' },
});
