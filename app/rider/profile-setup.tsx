import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { ArrowLeft, User, Mail, Phone, Shield, Camera, CheckCircle, IdCard, Car, HelpCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { IconCircle } from '@/components/IconCircle';

export default function RiderProfileSetup() {
  const { user, updateProfile, verifyRider, logout } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    licenseNumber: '',
    licenseExpiry: '',
    vehicleType: '',
    vehiclePlate: '',
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.phone) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!formData.licenseNumber || !formData.licenseExpiry || !formData.vehicleType || !formData.vehiclePlate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await verifyRider({
        licenseNumber: formData.licenseNumber,
        licenseExpiry: formData.licenseExpiry,
        vehicleType: formData.vehicleType,
        vehiclePlate: formData.vehiclePlate,
        idDocument: null,
        selfie: null,
      });
      await updateProfile({ ...formData, profileComplete: true });
      Alert.alert('Success', 'Profile completed! You can now go online.');
      router.replace('/rider/dashboard');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
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
          label="Email"
          placeholder="Email"
          value={user?.email || ''}
          onChangeText={() => {}}
          icon={<Mail size={20} color="#999" />}
          keyboardType="email-address"
          disabled
        />
      </Card>
    </>
  );

  const renderStep2 = () => (
    <>
      <Card padding="lg" style={styles.formCard}>
        <Text style={styles.stepTitle}>Rider Verification</Text>
        <Text style={styles.stepSubtitle}>We need to verify your identity and vehicle details</Text>

        <Input
          label="License Number"
          placeholder="Driver's license number"
          value={formData.licenseNumber}
          onChangeText={(v) => setFormData({ ...formData, licenseNumber: v })}
          icon={<IdCard size={20} color="#999" />}
          placeholderTextColor="e.g., DL-12345678"
        />

        <Input
          label="License Expiry Date"
          placeholder="MM/YYYY"
          value={formData.licenseExpiry}
          onChangeText={(v) => setFormData({ ...formData, licenseExpiry: v })}
          icon={<Shield size={20} color="#999" />}
          keyboardType="numeric"
          placeholderTextColor="e.g., 12/2026"
        />

        <Input
          label="Vehicle Type"
          placeholder="Motorcycle, Car, Van, etc."
          value={formData.vehicleType}
          onChangeText={(v) => setFormData({ ...formData, vehicleType: v })}
          icon={<Car size={20} color="#999" />}
          placeholderTextColor="e.g., Motorcycle"
        />

        <Input
          label="Vehicle Plate Number"
          placeholder="Vehicle registration plate"
          value={formData.vehiclePlate}
          onChangeText={(v) => setFormData({ ...formData, vehiclePlate: v })}
          icon={<Car size={20} color="#999" />}
          placeholderTextColor="e.g., LAG-123-AB"
        />
      </Card>

      <Card padding="lg" style={styles.formCard}>
        <Text style={styles.stepTitle}>Documents Required</Text>
        <View style={styles.documentRow}>
          <DocumentItem
            title="Driver's License"
            description="Front and back"
            icon={IdCard}
          />
          <DocumentItem
            title="Vehicle Registration"
            description="Proof of ownership"
            icon={Car}
          />
          <DocumentItem
            title="Selfie Photo"
            description="For identity verification"
            icon={User}
          />
        </View>
      </Card>
    </>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Link href="/rider/dashboard" style={styles.backButton}>
            <ArrowLeft size={24} color="#D91E36" />
          </Link>
          <Text style={styles.pageTitle}>Complete Profile</Text>
          <View style={{ width: 48 }} />
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressSteps}>
            {[
              { label: 'Personal', number: 1 },
              { label: 'Verification', number: 2 },
            ].map((s, i) => (
              <View key={s.number} style={styles.progressStep}>
                <View style={[
                  styles.progressCircle,
                  step > s.number && styles.progressCircleCompleted,
                  step === s.number && styles.progressCircleActive,
                ]}>
                  {step > s.number ? <CheckCircle size={16} color="#fff" /> : <Text style={styles.progressNumber}>{s.number}</Text>}
                </View>
                {!i && <View style={styles.progressLine} />}
                <Text style={[
                  styles.progressLabel,
                  step >= s.number && styles.progressLabelActive,
                ]}>
                  {s.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {step === 1 ? renderStep1() : renderStep2()}

        {step === 1 ? (
          <Button
            title="Continue"
            variant="primary-rider"
            fullWidth
            size="lg"
            onPress={handleNext}
            leftIcon={<ArrowLeft size={20} />}
            style={styles.submitButton}
          />
        ) : (
          <Button
            title={loading ? 'Completing...' : 'Complete Setup'}
            variant="primary-rider"
            fullWidth
            size="lg"
            onPress={handleSubmit}
            disabled={loading}
            loading={loading}
            leftIcon={<CheckCircle size={20} />}
            style={styles.submitButton}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

interface DocumentItemProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

function DocumentItem({ title, description, icon: Icon }: DocumentItemProps) {
  return (
    <View style={styles.documentItem}>
      <IconCircle size="md" bgColor="rgba(217, 30, 54, 0.1)">
        <Icon size={22} color="#D91E36" />
      </IconCircle>
      <Text style={styles.documentTitle}>{title}</Text>
      <Text style={styles.documentDesc}>{description}</Text>
    </View>
  );
}

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
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStep: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  progressCircleCompleted: {
    backgroundColor: '#D91E36',
    borderColor: '#D91E36',
  },
  progressCircleActive: {
    backgroundColor: '#fff',
    borderColor: '#D91E36',
    borderWidth: 3,
  },
  progressNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#999',
  },
  progressLine: {
    position: 'absolute',
    left: 60,
    right: -60,
    top: 19,
    height: 2,
    backgroundColor: '#f0f0f0',
    zIndex: -1,
  },
  progressLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
  },
  progressLabelActive: {
    color: '#D91E36',
    fontWeight: '600',
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
    backgroundColor: '#D91E36',
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
    backgroundColor: '#D91E36',
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
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
  },
  documentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  documentItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  documentTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  documentDesc: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 8,
  },
});

