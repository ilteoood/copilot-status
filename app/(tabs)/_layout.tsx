import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useTranslation } from 'react-i18next';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export default function TabLayout() {
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.tint,
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('navigation.dashboard'),
          tabBarIcon: ({ color }) => <Ionicons size={24} name="stats-chart-sharp" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('navigation.settings'),
          tabBarIcon: ({ color }) => <Ionicons size={24} name="settings-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create(theme => ({
  tabBar: {
    backgroundColor: theme.colors.background,
    borderTopColor: theme.colors.border,
  },
}));
