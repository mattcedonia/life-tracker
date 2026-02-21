import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import Screen from '@/components/screen';
import { Card, H1, Muted, PrimaryButton, SectionLabel } from '@/components/ui';
import { getJournalEntry, saveJournalEntry, todayKey } from '@/lib/db';
import { theme } from '@/lib/theme';

export default function JournalScreen() {
  const db = useSQLiteContext();
  const [content, setContent] = useState('');

  useFocusEffect(
    useCallback(() => {
      void getJournalEntry(db).then((entry) => setContent(entry.content));
    }, [db])
  );

  return (
    <Screen>
      <Muted>{todayKey()}</Muted>
      <H1>Life Tracker</H1>
      <SectionLabel>Quick Journal</SectionLabel>
      <Muted>Capture your day in a few clear lines.</Muted>

      <Card>
        <TextInput
          multiline
          value={content}
          onChangeText={setContent}
          placeholder="Write your daily entry..."
          placeholderTextColor={theme.muted}
          style={styles.input}
        />
        <PrimaryButton
          label="Save Entry"
          onPress={async () => {
            await saveJournalEntry(db, content);
          }}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 180,
    textAlignVertical: 'top',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 12,
    backgroundColor: theme.cardAlt,
    color: theme.text,
  },
});
