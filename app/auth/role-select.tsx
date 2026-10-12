import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Package2, Bike } from 'lucide-react-native';
import { IconCircle } from '@/components/IconCircle';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';

export default function RoleSelect() {
  const router = useRouter();

  const handleRoleSelect = (role: 'client' | 'rider') => {
    router.push(`/auth/login?role=${role}` as any);
  };

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.content}>
        <HeroBanner />
        <Text style={styles.title}>How would you like to use Runns?</Text>
        <Text style={styles.subtitle}>Choose your role to continue</Text>

        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleRoleSelect('client')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Continue as Client"
          >
            <IconCircle size="xl" bgColor="rgba(19, 43, 94, 0.08)">
              <Package2 size={40} color="#132B5E" strokeWidth={2} />
            </IconCircle>
            <Text style={styles.cardTitle}>I&#39;m a Client</Text>
            <Text style={styles.cardDescription}>
              Send packages, shop for groceries, and track deliveries in real-time
            </Text>
            <View style={styles.cardButtonContainer}>
              <Button
                title="Continue as Client"
                variant="primary"
                fullWidth
                onPress={() => handleRoleSelect('client')}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => handleRoleSelect('rider')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Continue as Rider"
          >
            <IconCircle size="xl" bgColor="rgba(217, 30, 54, 0.08)">
              <Bike size={40} color="#D91E36" strokeWidth={2} />
            </IconCircle>
            <Text style={styles.cardTitle}>I&#39;m a Rider</Text>
            <Text style={styles.cardDescription}>
              Earn money delivering packages on your own schedule
            </Text>
            <View style={styles.cardButtonContainer}>
              <Button
                title="Continue as Rider"
                variant="primary-rider"
                fullWidth
                onPress={() => handleRoleSelect('rider')}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  cardsContainer: {
    gap: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    shadowColor: '#132B5E',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  cardDescription: {
    color: '#555555',
    fontSize: 16,
    marginBottom: 32,
    lineHeight: 24,
    textAlign: 'center',
  },
  cardButtonContainer: {
    width: '100%',
  },
});

