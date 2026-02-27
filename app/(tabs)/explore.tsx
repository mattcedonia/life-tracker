import { StyleSheet } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function RemindersScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#C8E6C9', dark: '#1B3A1F' }}
      headerImage={
        <IconSymbol
          size={220}
          color="#4CAF5055"
          name="bell.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Reminders</ThemedText>
      </ThemedView>
      <ThemedText>
        Daily emails keep you on track. Sent automatically via SendGrid + GitHub Actions.
      </ThemedText>

      <Collapsible title="☀️ Morning Check-in — 5:00 AM">
        <ThemedText style={styles.item}>· Bible audio on commute (10 min or 1 chapter)</ThemedText>
        <ThemedText style={styles.item}>· 10 minutes movement (or 20 if you have it)</ThemedText>
        <ThemedText style={styles.item}>
          · 15 minutes intentional time with Jasmine (no phone)
        </ThemedText>
        <ThemedText style={[styles.item, styles.prompt]}>
          Prompt: What would make today feel successful?
        </ThemedText>
      </Collapsible>

      <Collapsible title="🌙 Evening Journal — 9:15 PM">
        <ThemedText style={styles.item}>1. What did I do that I'm proud of today?</ThemedText>
        <ThemedText style={styles.item}>2. Where did I show love as a husband?</ThemedText>
        <ThemedText style={styles.item}>3. Spiritual win today?</ThemedText>
        <ThemedText style={styles.item}>4. Creative win today (3D, music, or coding)?</ThemedText>
        <ThemedText style={styles.item}>5. What's one thing I'll do tomorrow?</ThemedText>
      </Collapsible>

      <Collapsible title="How reminders work">
        <ThemedText>
          A GitHub Actions cron job runs every 5 minutes. It checks the current time in
          America/New_York and sends an email via SendGrid if the time matches a scheduled slot
          (within a ±2 minute window).
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -30,
    left: -10,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  item: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 2,
  },
  prompt: {
    fontStyle: 'italic',
    marginTop: 4,
  },
});
