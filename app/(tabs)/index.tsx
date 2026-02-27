import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DAY_FOCUS: Record<string, string> = {
  Sunday: 'Meeting → optional music flow',
  Monday: 'Sculpt night',
  Tuesday: 'Family worship night',
  Wednesday: 'Meeting night',
  Thursday: 'Creative review → letter writing',
  Friday: 'Date night',
  Saturday: 'Field service → artist date',
};

const MORNING_WINS = [
  'Bible audio on commute (10 min or 1 chapter)',
  '10 minutes movement (or 20 if you have it)',
  '15 minutes intentional time with Jasmine (no phone)',
];

const EVENING_QUESTIONS = [
  "What did I do that I'm proud of today?",
  'Where did I show love as a husband?',
  'Spiritual win today?',
  'Creative win today (3D, music, or coding)?',
  "What's one thing I'll do tomorrow?",
];

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();
  const now = new Date();
  const dayName = DAYS[now.getDay()];
  const dateStr = `${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  const todayFocus = DAY_FOCUS[dayName];
  const tint = Colors[colorScheme].tint;
  const isDark = colorScheme === 'dark';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 16, backgroundColor: isDark ? '#1D3D47' : '#0a7ea4' },
        ]}>
        <ThemedText type="title" style={styles.headerTitle}>
          Life Tracker
        </ThemedText>
        <ThemedText style={styles.headerDate}>
          {dayName}, {dateStr}
        </ThemedText>
      </View>

      <ThemedView style={[styles.card, styles.focusCard, { borderLeftColor: tint }]}>
        <ThemedText type="subtitle">Today's Focus</ThemedText>
        <ThemedText style={styles.focusText}>{todayFocus}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">☀️ Morning Minimums · 5:00 AM</ThemedText>
        {MORNING_WINS.map((win, i) => (
          <ThemedText key={i} style={styles.listItem}>
            · {win}
          </ThemedText>
        ))}
        <ThemedText style={[styles.prompt, { color: tint }]}>
          What would make today feel successful?
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">🌙 Evening Journal · 9:15 PM</ThemedText>
        {EVENING_QUESTIONS.map((q, i) => (
          <ThemedText key={i} style={styles.listItem}>
            {i + 1}. {q}
          </ThemedText>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    gap: 16,
  },
  header: {
    paddingBottom: 28,
    paddingHorizontal: 20,
    gap: 4,
  },
  headerTitle: {
    color: '#fff',
  },
  headerDate: {
    color: '#ffffffcc',
    fontSize: 15,
  },
  card: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  focusCard: {
    borderLeftWidth: 4,
  },
  focusText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  listItem: {
    fontSize: 14,
    lineHeight: 22,
  },
  prompt: {
    marginTop: 4,
    fontSize: 14,
    fontStyle: 'italic',
  },
});
