import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { getSetting, setSetting } from '@/lib/database';

export default function SettingsScreen() {
  const [email, setEmail] = useState(getSetting('email'));
  const [morning, setMorning] = useState(getSetting('reminderMorning'));
  const [evening, setEvening] = useState(getSetting('reminderEvening'));
  const [graceMode, setGraceMode] = useState(getSetting('graceMode') === '1');

  const saveAll = () => {
    setSetting('email', email);
    setSetting('reminderMorning', morning);
    setSetting('reminderEvening', evening);
    setSetting('graceMode', graceMode ? '1' : '0');
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>Settings</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email (stored only)" autoCapitalize="none" />
      <TextInput style={styles.input} value={morning} onChangeText={setMorning} placeholder="Morning reminder time" />
      <TextInput style={styles.input} value={evening} onChangeText={setEvening} placeholder="Evening reminder time" />

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Grace Mode</Text>
          <Text style={styles.help}>Allow 1 miss before a streak breaks.</Text>
        </View>
        <Switch value={graceMode} onValueChange={setGraceMode} />
      </View>

      <Pressable style={styles.button} onPress={saveAll}>
        <Text style={styles.buttonText}>Save Settings</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f6f7fb', padding: 16, gap: 10 },
  heading: { fontSize: 28, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, backgroundColor: '#fff', padding: 10 },
  row: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, backgroundColor: '#fff', padding: 12 },
  label: { fontWeight: '700' },
  help: { color: '#6b7280' },
  button: { backgroundColor: '#111827', borderRadius: 10, alignItems: 'center', paddingVertical: 10 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
