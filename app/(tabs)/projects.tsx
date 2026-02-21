import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { addPrintLog, addProject, getPrintLogs, getProjects } from '@/lib/database';

export default function ProjectsScreen() {
  const [, setRefresh] = useState(0);
  const [name, setName] = useState('');
  const [archetype, setArchetype] = useState('');
  const [stage, setStage] = useState('');
  const [notes, setNotes] = useState('');
  const [nextActions, setNextActions] = useState('');

  const projects = getProjects();
  const printLogs = getPrintLogs();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Character Cards</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Name" style={styles.input} />
      <TextInput value={archetype} onChangeText={setArchetype} placeholder="Archetype" style={styles.input} />
      <TextInput value={stage} onChangeText={setStage} placeholder="Stage" style={styles.input} />
      <TextInput value={notes} onChangeText={setNotes} placeholder="Notes" style={styles.input} />
      <TextInput value={nextActions} onChangeText={setNextActions} placeholder="Next actions" style={styles.input} />
      <Pressable
        style={styles.button}
        onPress={() => {
          if (!name.trim()) return;
          addProject({ name, archetype, stage, notes, nextActions });
          setName('');
          setArchetype('');
          setStage('');
          setNotes('');
          setNextActions('');
          setRefresh((v) => v + 1);
        }}>
        <Text style={styles.buttonText}>Add Character</Text>
      </Pressable>

      {projects.map((project) => (
        <View key={project.id} style={styles.card}>
          <Text style={styles.cardTitle}>{project.name}</Text>
          <Text>Archetype: {project.archetype || '—'}</Text>
          <Text>Stage: {project.stage || '—'}</Text>
          <Text>Notes: {project.notes || '—'}</Text>
          <Text>Next: {project.nextActions || '—'}</Text>
          <Pressable
            style={[styles.button, { marginTop: 8 }]}
            onPress={() => {
              addPrintLog(project.id, `Printed checkpoint for ${project.name}`);
              setRefresh((v) => v + 1);
            }}>
            <Text style={styles.buttonText}>Log Print</Text>
          </Pressable>
        </View>
      ))}

      <Text style={styles.heading}>Print Logs</Text>
      {printLogs.map((log) => (
        <View key={log.id} style={styles.logRow}>
          <Text>{log.date}</Text>
          <Text>{log.details}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f6f7fb' },
  content: { padding: 16, gap: 10, paddingBottom: 30 },
  heading: { fontSize: 24, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, backgroundColor: '#fff', padding: 10 },
  button: { backgroundColor: '#111827', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  card: { borderWidth: 1, borderColor: '#e7e9f1', backgroundColor: '#fff', borderRadius: 10, padding: 12, gap: 3 },
  cardTitle: { fontWeight: '700', fontSize: 16, marginBottom: 6 },
  logRow: { borderWidth: 1, borderColor: '#e7e9f1', backgroundColor: '#fff', borderRadius: 10, padding: 10 },
});
