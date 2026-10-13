import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { ArrowLeft, User, Mail, Phone, Shield, Camera, CheckCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { IconCircle } from '@/components/IconCircle';

export default function ClientProfileSetup() {
  const { user, updateProfile, logout } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await updateProfile({ ...formData, profileComplete: true });
      Alert.alert('Success', 'Profile completed!');
      router.replace('/client/dashboard');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to complete profile');
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
          <Text style={styles.pageTitle}>Complete Profile</Text>
          <View style={{ width: 48 }} />
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '75%' }]} />
          </View>
          <Text style={styles.progressText}>Step 2 of 3: Personal Details</Text>
        </View>

        <Card padding="lg" style={styles.formCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{formData.firstName?.[0]}{formData.lastName?.[0]}</Text>
              </View>
              <View style={styles.cameraButton}>
                <Camera size={20} color="#fff" />
              </View>
            </View>
            <Text style={styles.avatarHint}>Tap to add photo (optional)</Text>
          </View>

          <View style={styles.nameRow}>
            <Input
              label="First Name"
              placeholder="First Name"
              value={formData.firstName}
              onChangeText={(v) => setFormData({ ...formData, firstName: v })}
              icon={<User size={20} color="#999" />}
              style={{ flex: 1 }}
            />
            <Input
              label="Last Name"
              placeholder="Last Name"
              value={formData.lastName}
              onChangeText={(v) => setFormData({ ...formData, lastName: v })}
              icon={<User size={20} color="#999" />}
              style={{ flex: 1 }}
            />
          </View>

          <Input
            label="Phone Number"
            placeholder="+234 801 234 5678"
            value={formData.phone}
            onChangeText={(v) => setFormData({ ...formData, phone: v })}
            icon={<Phone size={20} color="#999" />}
            keyboardType="phone-pad"
            placeholderTextColor="e.g., +234 801 234 5678"
          />

          <Input
            label="Address (Optional)"
            placeholder="Your delivery address"
            value={formData.address}
            onChangeText={(v) => setFormData({ ...formData, address: v })}
            icon={<IconCircle size="sm" bgColor="#f0f0f0"><Text style={styles.mapPinIcon}>📍</Text></IconCircle>}
            multiline
            numberOfLines={3}
            placeholderTextColor="e.g., 123 Victoria Island, Lagos"
          />
        </Card>

        <Card padding="lg" style={styles.formCard}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Push Notifications</Text>
              <Text style={styles.toggleDesc}>Receive order updates and promotions</Text>
            </View>
            <View style={styles.toggleSwitch}>
              <View style={styles.toggleThumb} />
            </View>
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>SMS Alerts</Text>
              <Text style={styles.toggleDesc}>Important alerts via SMS</Text>
            </View>
            <View style={styles.toggleSwitch}>
              <View style={styles.toggleThumb} />
            </View>
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Email Updates</Text>
              <Text style={styles.toggleDesc}>Weekly summaries and receipts</Text>
            </View>
            <View style={styles.toggleSwitch}>
              <View style={styles.toggleThumb} />
            </View>
          </View>
        </Card>

        <Button
          title={loading ? 'Completing...' : 'Complete Setup'}
          variant="primary"
          fullWidth
          size="lg"
          onPress={handleSave}
          disabled={loading}
          loading={loading}
          leftIcon={<CheckCircle size={20} />}
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

import { useRouter } from 'expo-router';
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
  progressSection: {
    marginBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#132B5E',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  formCard: {
    marginBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#132B5E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#132B5E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarHint: {
    fontSize: 13,
    color: '#999',
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  mapPinIcon: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  toggleDesc: {
    fontSize: 13,
    color: '#999',
  },
  toggleSwitch: {
    width: 52,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#132B5E',
    padding: 2,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  submitButton: {
    marginTop: 8,
  },
});

