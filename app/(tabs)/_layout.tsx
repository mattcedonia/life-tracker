import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerTitleAlign: 'center', tabBarLabelStyle: { fontSize: 12 } }}>
      <Tabs.Screen name="today" options={{ title: 'Today', tabBarIcon: ({ color, size }) => <Ionicons name="today" color={color} size={size} /> }} />
      <Tabs.Screen name="week" options={{ title: 'Week', tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} /> }} />
      <Tabs.Screen name="habits" options={{ title: 'Habits', tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-done" color={color} size={size} /> }} />
      <Tabs.Screen name="journal" options={{ title: 'Journal', tabBarIcon: ({ color, size }) => <Ionicons name="book" color={color} size={size} /> }} />
      <Tabs.Screen name="projects" options={{ title: 'Projects', tabBarIcon: ({ color, size }) => <Ionicons name="cube" color={color} size={size} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size} /> }} />
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}
