import React from 'react';
import { Slot } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { NotificationToast } from '@/components/NotificationToast';
import { OrderAssignmentListener } from '@/components/OrderAssignmentListener';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NotificationProvider>
          <Slot />
          <NotificationToast />
          <OrderAssignmentListener />
          <StatusBar style="light" />
        </NotificationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}