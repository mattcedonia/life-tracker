import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Screen from '@/components/screen';
import { Card, H1, H2, Muted, Pill, PrimaryButton, SectionLabel } from '@/components/ui';
import { addPrintLog, getPrintLogs, getProjects, todayKey, type PrintLog, type Project } from '@/lib/db';
import { theme } from '@/lib/theme';

export default function ProjectsScreen() {
  const db = useSQLiteContext();
  const [projects, setProjects] = useState<Project[]>([]);
  const [logs, setLogs] = useState<Record<number, PrintLog[]>>({});

  const load = useCallback(async () => {
    const next = await getProjects(db);
    setProjects(next);
    const entries: Record<number, PrintLog[]> = {};
    for (const project of next) {
      entries[project.id] = await getPrintLogs(db, project.id);
    }
    setLogs(entries);
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
      <SectionLabel>3D Projects</SectionLabel>
      <Muted>Track design projects and print attempts.</Muted>

      {projects.map((project) => (
        <Card key={project.id}>
          <View style={styles.headRow}>
            <H2>{project.title}</H2>
            <Pill label={project.pillar} />
          </View>
          <Text style={styles.summary}>{project.summary}</Text>
          <Muted>Print logs: {project.printCount}</Muted>
          <PrimaryButton
            label="Add Print Log"
            onPress={async () => {
              await addPrintLog(db, project.id, 'Quick iteration pass');
              await load();
            }}
          />
          <View style={styles.logWrap}>
            {(logs[project.id] ?? []).slice(0, 3).map((log) => (
              <Text key={log.id} style={styles.logItem}>
                • {new Date(log.createdAt).toLocaleDateString()} — {log.notes}
              </Text>
            ))}
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  summary: { color: theme.text, fontSize: 15 },
  logWrap: {
    backgroundColor: theme.cardAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 10,
    gap: 6,
  },
  logItem: { color: theme.muted, fontSize: 13 },
});
