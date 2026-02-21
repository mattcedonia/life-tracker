import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { addJournalEntry, getJournalEntries } from '@/lib/database';

export default function JournalScreen() {
  const [search, setSearch] = useState('');
  const [entry, setEntry] = useState('');
  const [tags, setTags] = useState('');
  const [, setRefresh] = useState(0);

  const entries = getJournalEntries(search);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Daily Entries</Text>
      <TextInput style={styles.input} placeholder="Search content or tags" value={search} onChangeText={setSearch} />
      <TextInput style={[styles.input, styles.multi]} placeholder="Write today's entry" multiline value={entry} onChangeText={setEntry} />
      <TextInput style={styles.input} placeholder="Tags (comma separated)" value={tags} onChangeText={setTags} />
      <Pressable
        style={styles.button}
        onPress={() => {
          if (!entry.trim()) return;
          addJournalEntry(entry.trim(), tags.trim());
          setEntry('');
          setTags('');
          setRefresh((v) => v + 1);
        }}>
        <Text style={styles.buttonText}>Save Entry</Text>
      </Pressable>

      {entries.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.date}>{item.date}</Text>
          <Text>{item.content}</Text>
          {!!item.tags && <Text style={styles.tags}>#{item.tags.split(',').join(' #')}</Text>}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f6f7fb' },
  content: { padding: 16, gap: 10, paddingBottom: 30 },
  title: { fontSize: 26, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#fff', borderRadius: 10, padding: 10 },
  multi: { minHeight: 90, textAlignVertical: 'top' },
  button: { backgroundColor: '#111827', borderRadius: 10, alignItems: 'center', paddingVertical: 10 },
  buttonText: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e7e9f1', borderRadius: 10, padding: 12 },
  date: { fontWeight: '700', marginBottom: 4 },
  tags: { marginTop: 6, color: '#4b5563' },
});
