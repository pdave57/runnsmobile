import React from 'react';
import { Stack } from 'expo-router';
import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';
import { SafeAreaView, StyleSheet, View } from 'react-native';

export default function ClientLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f8f9fa' },
      }}
    >
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="orders" options={{ headerShown: false }} />
      <Stack.Screen name="orders/new" options={{ headerShown: false }} />
      <Stack.Screen name="orders/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="track" options={{ headerShown: false }} />
      <Stack.Screen name="shop" options={{ headerShown: false }} />
      <Stack.Screen name="dispatch" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="profile-setup" options={{ headerShown: false }} />
    </Stack>
  );
}

function ClientScreenWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'horizontal']}>
      <Header />
      <View style={styles.content}>{children}</View>
      <BottomNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingBottom: 100, // Space for bottom navigation
  },
});

export { ClientScreenWrapper };