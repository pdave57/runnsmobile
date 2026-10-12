import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { ArrowLeft, MapPin, Package, CreditCard, Wallet, HelpCircle, CheckCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { IconCircle } from '@/components/IconCircle';
import { Badge } from '@/components/Badge';

export default function DispatchPage() {
  const { user } = useAuth();
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [packageDescription, setPackageDescription] = useState('');
  const [weight, setWeight] = useState('1');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'wallet'>('card');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!pickupAddress || !dropoffAddress || !packageDescription) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      Alert.alert('Success', 'Dispatch order created! We\'ll find a rider for you.');
      setPickupAddress('');
      setDropoffAddress('');
      setPackageDescription('');
      setWeight('1');
      setNotes('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create dispatch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Link href="/client/dashboard" as any style={styles.backButton}>
            <ArrowLeft size={24} color="#132B5E" />
          </Link>
          <Text style={styles.pageTitle}>Order Dispatch</Text>
          <View style={{ width: 48 }} />
        </View>

        <Card padding="lg" style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <IconCircle size="lg" bgColor="rgba(19, 43, 94, 0.1)">
              <Package size={28} color="#132B5E" />
            </IconCircle>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Quick Dispatch</Text>
              <Text style={styles.infoDescription}>
                Send packages anywhere in Lagos. We'll match you with a nearby rider.
              </Text>
            </View>
          </View>
        </Card>

        <Card padding="lg" style={styles.formCard}>
          <Text style={styles.sectionTitle}>Pickup & Dropoff</Text>
          
          <Input
            label="Pickup Address"
            placeholder="Where should the rider pick up?"
            value={pickupAddress}
            onChangeText={setPickupAddress}
            icon={<MapPin size={20} color="#999" />}
            placeholderTextColor="e.g., 123 Victoria Island, Lagos"
          />

          <Input
            label="Dropoff Address"
            placeholder="Where should it be delivered?"
            value={dropoffAddress}
            onChangeText={setDropoffAddress}
            icon={<MapPin size={20} color="#999" />}
            placeholderTextColor="e.g., 456 Ikoyi, Lagos"
          />
        </Card>

        <Card padding="lg" style={styles.formCard}>
          <Text style={styles.sectionTitle}>Package Details</Text>
          
          <Input
            label="What are you sending?"
            placeholder="Describe the package contents"
            value={packageDescription}
            onChangeText={setPackageDescription}
            icon={<Package size={20} color="#999" />}
            placeholderTextColor="e.g., Documents, Clothes, Electronics"
            multiline
            numberOfLines={3}
          />

          <View style={styles.weightRow}>
            <Input
              label="Weight (kg)"
              placeholder="1"
              value={weight}
              onChangeText={setWeight}
              icon={<IconCircle size="sm" bgColor="#f0f0f0"><Text style={styles.weightIcon}>⚖</Text></IconCircle>}
              keyboardType="numeric"
              style={{ flex: 1 }}
            />
          </View>

          <Input
            label="Notes (Optional)"
            placeholder="Fragile, handle with care, etc."
            value={notes}
            onChangeText={setNotes}
            icon={<IconCircle size="sm" bgColor="#f0f0f0"><Text style={styles.weightIcon}>📝</Text></IconCircle>}
            multiline
            numberOfLines={3}
          />
        </Card>

        <Card padding="lg" style={styles.formCard}>
          <Text style={styles.sectionTitle}>Payment</Text>
          
          <View style={styles.paymentOptions}>
            {([
              { value: 'card', label: 'Card', icon: CreditCard, desc: 'Pay with saved card' },
              { value: 'wallet', label: 'Wallet', icon: Wallet, desc: 'Use wallet balance' },
              { value: 'cash', label: 'Cash', icon: HelpCircle, desc: 'Pay on delivery' },
            ] as const).map(option => (
              <Pressable
                key={option.value}
                onPress={() => setPaymentMethod(option.value)}
                style={[
                  styles.paymentOption,
                  paymentMethod === option.value && styles.paymentOptionSelected,
                ]}
              >
                <View style={styles.paymentOptionIcon}>
                  <option.icon size={24} color={paymentMethod === option.value ? '#fff' : '#132B5E'} />
                </View>
                <View style={styles.paymentOptionInfo}>
                  <Text style={[
                    styles.paymentOptionLabel,
                    paymentMethod === option.value && styles.paymentOptionLabelSelected,
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={[
                    styles.paymentOptionDesc,
                    paymentMethod === option.value && styles.paymentOptionDescSelected,
                  ]}>
                    {option.desc}
                  </Text>
                </View>
                {paymentMethod === option.value && (
                  <View style={styles.paymentOptionCheck}>
                    <CheckCircle size={24} color="#fff" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </Card>

        <View style={styles.priceEstimate}>
          <Text style={styles.priceLabel}>Estimated Price</Text>
          <Text style={styles.priceValue}>₦1,500 - ₦3,000</Text>
          <Text style={styles.priceNote}>Final price depends on distance and package size</Text>
        </View>

        <Button
          title={loading ? 'Creating...' : 'Create Dispatch Order'}
          variant="primary"
          fullWidth
          size="lg"
          onPress={handleSubmit}
          disabled={loading}
          loading={loading}
          leftIcon={<Package size={20} />}
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

import { Pressable } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#132B5E',
    flex: 1,
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
  },
  formCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  weightRow: {
    marginTop: 16,
  },
  weightIcon: {
    fontSize: 16,
  },
  paymentOptions: {
    gap: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  paymentOptionSelected: {
    borderColor: '#132B5E',
    backgroundColor: '#132B5E',
  },
  paymentOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(19, 43, 94, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentOptionInfo: {
    flex: 1,
  },
  paymentOptionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  paymentOptionLabelSelected: {
    color: '#fff',
  },
  paymentOptionDesc: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  paymentOptionDescSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  paymentOptionCheck: {
    width: 24,
    height: 24,
  },
  priceEstimate: {
    backgroundColor: '#132B5E',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  priceNote: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  submitButton: {
    marginTop: 8,
  },
});

