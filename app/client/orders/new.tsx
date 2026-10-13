import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { ArrowLeft, MapPin, Package, ShoppingBag } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { IconCircle } from '@/components/IconCircle';
import { Badge } from '@/components/Badge';

const orderTypes = [
  { value: 'dispatch', label: 'Dispatch', icon: Package, description: 'Send a package from A to B', color: '#132B5E' },
  { value: 'shop-for-me', label: 'Shop for Me', icon: ShoppingBag, description: 'Buy and deliver groceries/items', color: '#8b5cf6' },
];

export default function NewOrder() {
  const { user } = useAuth();
  const { createOrder, loading } = useOrders(user?.id || null, 'client');
  const [selectedType, setSelectedType] = useState<'dispatch' | 'shop-for-me'>('dispatch');
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [items, setItems] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'wallet'>('cash');
  const [price, setPrice] = useState('');

  const handleSubmit = async () => {
    if (!pickupAddress || !dropoffAddress || !items) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await createOrder({
        clientId: user?.id,
        type: selectedType,
        pickupLocation: { address: pickupAddress, lat: 0, lng: 0 },
        dropoffLocation: { address: dropoffAddress, lat: 0, lng: 0 },
        items: [{ id: '1', name: items, quantity: 1, price: parseFloat(price) || 0 }],
        price: parseFloat(price) || 0,
        paymentMethod,
        notes,
      });
      Alert.alert('Success', 'Order created successfully!');
      // Navigate back or to orders list
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create order');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Link href="/client/orders" style={styles.backButton}>
            <ArrowLeft size={24} color="#132B5E" />
          </Link>
          <Text style={styles.pageTitle}>New Order</Text>
          <View style={{ width: 48 }} />
        </View>

        <View style={styles.typeSelector}>
          {orderTypes.map(type => {
            const Icon = type.icon;
            return (
              <Pressable
                key={type.value}
                onPress={() => setSelectedType(type.value as 'dispatch' | 'shop-for-me')}
                style={[
                  styles.typeCard,
                  selectedType === type.value && styles.typeCardSelected,
                ]}
              >
                <IconCircle size="lg" bgColor={selectedType === type.value ? `${type.color}15` : '#f5f5f5'}>
                  <Icon size={28} color={selectedType === type.value ? type.color : '#999'} />
                </IconCircle>
                <View style={styles.typeInfo}>
                  <Text style={[
                    styles.typeLabel,
                    selectedType === type.value && styles.typeLabelSelected,
                  ]}>
                    {type.label}
                  </Text>
                  <Text style={[
                    styles.typeDescription,
                    selectedType === type.value && styles.typeDescriptionSelected,
                  ]}>
                    {type.description}
                  </Text>
                </View>
                {selectedType === type.value && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <Card padding="lg" style={styles.formCard}>
          <Text style={styles.formTitle}>Pickup Location</Text>
          <Input
            label="Pickup Address"
            placeholder="Enter pickup address"
            value={pickupAddress}
            onChangeText={setPickupAddress}
            icon={<MapPin size={20} color="#999" />}
            placeholderTextColor="e.g., 123 Victoria Island, Lagos"
          />

          <Text style={[styles.formTitle, { marginTop: 24 }]}>Dropoff Location</Text>
          <Input
            label="Dropoff Address"
            placeholder="Enter dropoff address"
            value={dropoffAddress}
            onChangeText={setDropoffAddress}
            icon={<MapPin size={20} color="#999" />}
            placeholderTextColor="e.g., 456 Ikoyi, Lagos"
          />

          <Text style={[styles.formTitle, { marginTop: 24 }]}>Items</Text>
          <Input
            label="What are you sending?"
            placeholder="Describe the items"
            value={items}
            onChangeText={setItems}
            icon={<Package size={20} color="#999" />}
            placeholderTextColor="e.g., Documents, 2kg package"
            multiline
            numberOfLines={3}
          />

          <Text style={[styles.formTitle, { marginTop: 24 }]}>Pricing & Payment</Text>
          <View style={styles.priceRow}>
            <Input
              label="Estimated Price (₦)"
              placeholder="0"
              value={price}
              onChangeText={setPrice}
              icon={<IconCircle size="sm" bgColor="#f0f0f0"><Text style={styles.nairaIcon}>₦</Text></IconCircle>}
              keyboardType="numeric"
              style={{ flex: 1 }}
            />
            <View style={styles.paymentMethodContainer}>
              <Text style={styles.paymentLabel}>Payment</Text>
              <View style={styles.paymentOptions}>
                {(['cash', 'card', 'wallet'] as const).map(method => (
                  <Pressable
                    key={method}
                    onPress={() => setPaymentMethod(method)}
                    style={[
                      styles.paymentOption,
                      paymentMethod === method && styles.paymentOptionSelected,
                    ]}
                  >
                    <Text style={[
                      styles.paymentOptionText,
                      paymentMethod === method && styles.paymentOptionTextSelected,
                    ]}>
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <Text style={[styles.formTitle, { marginTop: 24 }]}>Notes (Optional)</Text>
          <Input
            label="Additional Notes"
            placeholder="Any special instructions..."
            value={notes}
            onChangeText={setNotes}
            icon={<IconCircle size="sm" bgColor="#f0f0f0"><Text style={styles.nairaIcon}>📝</Text></IconCircle>}
            multiline
            numberOfLines={3}
          />
        </Card>

        <Button
          title={loading ? 'Creating...' : 'Create Order'}
          variant="primary"
          fullWidth
          size="lg"
          onPress={handleSubmit}
          disabled={loading}
          loading={loading}
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
  typeSelector: {
    marginBottom: 20,
    gap: 12,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  typeCardSelected: {
    borderColor: '#132B5E',
    backgroundColor: 'rgba(19, 43, 94, 0.02)',
  },
  typeInfo: {
    flex: 1,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  typeLabelSelected: {
    color: '#132B5E',
  },
  typeDescription: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  typeDescriptionSelected: {
    color: '#132B5E',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#132B5E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  formCard: {
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 16,
  },
  paymentMethodContainer: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 8,
  },
  paymentOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  paymentOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    alignItems: 'center',
  },
  paymentOptionSelected: {
    borderColor: '#132B5E',
    backgroundColor: 'rgba(19, 43, 94, 0.08)',
  },
  paymentOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555555',
  },
  paymentOptionTextSelected: {
    color: '#132B5E',
  },
  nairaIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
  },
  submitButton: {
    marginTop: 8,
  },
});

