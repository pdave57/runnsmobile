import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, User, Phone, AlertCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { IconCircle } from '@/components/IconCircle';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export default function Register() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { register, loading, error } = useAuth();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [role] = useState<'client' | 'rider'>((params.role as 'client' | 'rider') || 'client');
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email format';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      case 'firstName':
        if (!value) return 'First name is required';
        return '';
      case 'lastName':
        if (!value) return 'Last name is required';
        return '';
      case 'phone':
        if (!value) return 'Phone number is required';
        if (!/^\+?[\d\s-]{10,}$/.test(value)) return 'Invalid phone number';
        return '';
      default:
        return '';
    }
  };

  const handleChangeText = (name: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    const fieldError = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: fieldError }));
  };

  const validateAllFields = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};
    let hasErrors = false;
    
    (Object.keys(formData) as Array<keyof RegisterFormData>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });
    
    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFormError('');

    if (!validateAllFields()) {
      setFormError('Please fix the errors above');
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role,
      });
      router.replace(role === 'client' ? '/client/profile-setup' : '/rider/profile-setup');
    } catch {
      setFormError(error || 'Registration failed');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <IconCircle size="lg" bgColor="rgba(19, 43, 94, 0.08)">
            <Text style={styles.logoText}>Runns</Text>
          </IconCircle>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Runns and start delivering</Text>
        </View>

        <View style={styles.roleIndicator}>
          <Text style={styles.roleLabel}>Registering as </Text>
          <Text style={[styles.roleValue, role === 'rider' && styles.roleValueRider]}>
            {role === 'client' ? 'Client' : 'Rider'}
          </Text>
        </View>

        {formError && (
          <View style={styles.errorContainer}>
            <IconCircle size="sm" bgColor="rgba(239, 68, 68, 0.1)">
              <AlertCircle size={18} color="#ef4444" />
            </IconCircle>
            <Text style={styles.errorText}>{formError}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <Input
              label="First Name"
              placeholder="John"
              value={formData.firstName}
              onChangeText={(v) => handleChangeText('firstName', v)}
              icon={<User size={20} color="#999" />}
              error={errors.firstName}
              autoComplete="given-name"
              textContentType="givenName"
              disabled={loading}
              style={styles.nameRowItem}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              value={formData.lastName}
              onChangeText={(v) => handleChangeText('lastName', v)}
              icon={<User size={20} color="#999" />}
              error={errors.lastName}
              autoComplete="family-name"
              textContentType="familyName"
              disabled={loading}
              style={styles.nameRowItem}
            />
          </View>

          <Input
            label="Email Address"
            placeholder="you@example.com"
            value={formData.email}
            onChangeText={(v) => handleChangeText('email', v)}
            icon={<Mail size={20} color="#999" />}
            autoComplete="email"
            keyboardType="email-address"
            error={errors.email}
            disabled={loading}
            textContentType="emailAddress"
          />

          <Input
            label="Phone Number"
            placeholder="+234 801 234 5678"
            value={formData.phone}
            onChangeText={(v) => handleChangeText('phone', v)}
            icon={<Phone size={20} color="#999" />}
            autoComplete="tel"
            keyboardType="phone-pad"
            error={errors.phone}
            disabled={loading}
            textContentType="telephoneNumber"
          />

          <Input
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChangeText={(v) => handleChangeText('password', v)}
            secureTextEntry={!showPassword}
            icon={<Lock size={20} color="#999" />}
            rightIcon={
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color="#999" /> : <Eye size={20} color="#999" />}
              </Pressable>
            }
            autoComplete="new-password"
            error={errors.password}
            disabled={loading}
            textContentType="newPassword"
          />

          <Input
            label="Confirm Password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChangeText={(v) => handleChangeText('confirmPassword', v)}
            secureTextEntry={!showConfirmPassword}
            icon={<Lock size={20} color="#999" />}
            rightIcon={
              <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={20} color="#999" /> : <Eye size={20} color="#999" />}
              </Pressable>
            }
            autoComplete="new-password"
            error={errors.confirmPassword}
            disabled={loading}
            textContentType="newPassword"
          />

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Link href="/terms" style={styles.termsLink}>Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" style={styles.termsLink}>Privacy Policy</Link>
            </Text>
          </View>

          <Button
            title={loading ? 'Creating account...' : `Register as ${role === 'client' ? 'Client' : 'Rider'}`}
            variant={role === 'client' ? 'primary' : 'primary-rider'}
            fullWidth
            onPress={handleSubmit}
            disabled={loading}
            loading={loading}
            style={styles.registerButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/auth/login" style={styles.footerLink}>
            Login
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#132B5E',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#555555',
  },
  roleIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  roleLabel: {
    fontSize: 14,
    color: '#555555',
  },
  roleValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#132B5E',
  },
  roleValueRider: {
    color: '#D91E36',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 10,
    marginBottom: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    flex: 1,
  },
  form: {
    gap: 16,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameRowItem: {
    flex: 1,
  },
  termsContainer: {
    marginTop: 8,
  },
  termsText: {
    fontSize: 13,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: '#132B5E',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  registerButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 15,
    color: '#555555',
  },
  footerLink: {
    fontSize: 15,
    color: '#132B5E',
    fontWeight: '700',
  },
});

