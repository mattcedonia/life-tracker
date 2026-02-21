import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Screen from '@/components/screen';
import { Card, H1, H2, Muted, SecondaryButton, SectionLabel } from '@/components/ui';
import { getPillars, resetTrackerData, todayKey } from '@/lib/db';
import { theme } from '@/lib/theme';

export default function SettingsScreen() {
  const db = useSQLiteContext();
  const [pillars, setPillars] = useState<{ id: number; name: string }[]>([]);

  const load = useCallback(async () => {
    setPillars(await getPillars(db));
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
      <SectionLabel>Settings</SectionLabel>

      <Card>
        <H2>Default Pillars</H2>
        <View style={styles.pillarWrap}>
          {pillars.map((pillar) => (
            <Text key={pillar.id} style={styles.pillarText}>
              • {pillar.name}
            </Text>
          ))}
        </View>
      </Card>

      <Card>
        <H2>Data</H2>
        <SecondaryButton
          label="Reset activity logs"
          onPress={async () => {
            await resetTrackerData(db);
          }}
        />
      </Card>

      <Muted>Email reminders intentionally not included in this V1.</Muted>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pillarWrap: {
    backgroundColor: theme.cardAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 10,
    gap: 6,
  },
  pillarText: { color: theme.text },
});
