import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="records" />
      <Tabs.Screen name="add" />
      <Tabs.Screen name="analytics" />
      <Tabs.Screen name="account" />
    </Tabs>
  );
}
