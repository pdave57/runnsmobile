import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { ArrowLeft, Plus, ShoppingBag, Trash2, CheckCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { IconCircle } from '@/components/IconCircle';

interface ShopItem {
  id: string;
  name: string;
  quantity: number;
  price?: number;
  notes?: string;
}

export default function ShopForMePage() {
  const { user } = useAuth();
  const [items, setItems] = useState<ShopItem[]>([{ id: '1', name: '', quantity: 1 }]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', quantity: 1 }]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ShopItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSubmit = async () => {
    const validItems = items.filter(item => item.name.trim());
    if (validItems.length === 0) {
      Alert.alert('Error', 'Please add at least one item');
      return;
    }
    if (!deliveryAddress.trim()) {
      Alert.alert('Error', 'Please enter delivery address');
      return;
    }

    setLoading(true);
    try {
      // In real app, call API
      Alert.alert('Success', 'Shop for Me request created! A rider will contact you soon.');
      // Clear form
      setItems([{ id: '1', name: '', quantity: 1 }]);
      setDeliveryAddress('');
      setSpecialInstructions('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create request');
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
          <Link href="/client/dashboard" style={styles.backButton}>
            <ArrowLeft size={24} color="#132B5E" />
          </Link>
          <Text style={styles.pageTitle}>Shop for Me</Text>
          <View style={{ width: 48 }} />
        </View>

        <Card padding="lg" style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <IconCircle size="lg" bgColor="rgba(139, 92, 246, 0.1)">
              <ShoppingBag size={28} color="#8b5cf6" />
            </IconCircle>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>How it works</Text>
              <Text style={styles.infoDescription}>
                Tell us what you need, {"we'll"} buy and deliver it to your doorstep.
                You pay for items + delivery fee upon delivery.
              </Text>
            </View>
          </View>
        </Card>

        <Card padding="lg" style={styles.formCard}>
          <Text style={styles.sectionTitle}>Items to Buy</Text>
          
          {items.map((item, index) => (
            <View key={item.id} style={styles.itemRow}>
              <Input
                label={`Item ${index + 1}`}
                placeholder="e.g., Bread, Milk 1L"
                value={item.name}
                onChangeText={(v) => updateItem(item.id, 'name', v)}
                icon={<ShoppingBag size={20} color="#999" />}
                style={{ flex: 1 }}
              />
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Qty</Text>
                <View style={styles.quantityInput}>
                  <Pressable
                    onPress={() => updateItem(item.id, 'quantity', Math.max(1, item.quantity - 1))}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </Pressable>
                  <Text style={styles.quantityValue}>{item.quantity}</Text>
                  <Pressable
                    onPress={() => updateItem(item.id, 'quantity', item.quantity + 1)}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </Pressable>
                </View>
              </View>
              {items.length > 1 && (
                <Pressable onPress={() => removeItem(item.id)} style={styles.removeButton}>
                  <Trash2 size={20} color="#ef4444" />
                </Pressable>
              )}
            </View>
          ))}

          <Pressable onPress={addItem} style={styles.addItemButton}>
            <Plus size={20} color="#132B5E" />
            <Text style={styles.addItemText}>Add another item</Text>
          </Pressable>
        </Card>

        <Card padding="lg" style={styles.formCard}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          
          <Input
            label="Delivery Address"
            placeholder="Enter full delivery address"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            icon={<IconCircle size="sm" bgColor="#f0f0f0"><Text style={styles.mapPinIcon}>📍</Text></IconCircle>}
            multiline
            numberOfLines={3}
            placeholderTextColor="e.g., 123 Victoria Island, Lagos, Nigeria"
          />

          <Input
            label="Special Instructions (Optional)"
            placeholder="Any specific brand, store preference, etc."
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            icon={<IconCircle size="sm" bgColor="#f0f0f0"><Text style={styles.mapPinIcon}>📝</Text></IconCircle>}
            multiline
            numberOfLines={3}
            placeholderTextColor="e.g., Prefer Shoprite, get whole wheat bread"
          />
        </Card>

        <Button
          title={loading ? 'Submitting...' : 'Submit Request'}
          variant="primary"
          fullWidth
          size="lg"
          onPress={handleSubmit}
          disabled={loading}
          loading={loading}
          leftIcon={<ShoppingBag size={20} />}
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
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 16,
  },
  quantityContainer: {
    width: 100,
  },
  quantityLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 4,
  },
  quantityInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#132B5E',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: 10,
    marginBottom: 12,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#132B5E',
    borderRadius: 10,
    borderStyle: 'dashed',
  },
  addItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#132B5E',
  },
  mapPinIcon: {
    fontSize: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});

