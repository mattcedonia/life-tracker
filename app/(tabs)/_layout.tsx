import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

import { theme } from '@/lib/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 78,
          paddingTop: 10,
          paddingBottom: 18,
          backgroundColor: theme.bg,
          borderTopColor: theme.border,
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color: iconColor, size }) => <Ionicons name="today-outline" color={iconColor} size={size} />,
        }}
      />
      <Tabs.Screen
        name="week"
        options={{
          title: 'Week',
          tabBarIcon: ({ color: iconColor, size }) => <Ionicons name="calendar-outline" color={iconColor} size={size} />,
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
          tabBarIcon: ({ color: iconColor, size }) => <Ionicons name="repeat-outline" color={iconColor} size={size} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color: iconColor, size }) => <Ionicons name="book-outline" color={iconColor} size={size} />,
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: '3D Projects',
          tabBarIcon: ({ color: iconColor, size }) => <Ionicons name="cube-outline" color={iconColor} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color: iconColor, size }) => <Ionicons name="settings-outline" color={iconColor} size={size} />,
        }}
      />
    </Tabs>
  );
}
