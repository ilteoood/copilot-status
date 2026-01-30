import { Stack } from 'expo-router';

const SCREEN_OPTIONS = { headerShown: false }

export default function AuthLayout() {
  return (
    <Stack screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="login" />
    </Stack>
  );
}
