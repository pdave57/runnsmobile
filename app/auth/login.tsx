import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { IconCircle } from '@/components/IconCircle';

export default function Login() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { login, loading, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState('');
  const [role, setRole] = useState<'client' | 'rider'>((params.role as 'client' | 'rider') || 'client');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password, role);
      router.replace(role === 'client' ? '/client/dashboard' : '/rider/dashboard');
    } catch {
      setFormError(error || 'Login failed');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <IconCircle size="lg" bgColor="rgba(19, 43, 94, 0.08)">
            <Text style={styles.logoText}>Runns</Text>
          </IconCircle>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.roleToggle}>
          <TouchableOpacity
            style={[styles.roleOption, role === 'client' && styles.roleOptionActive]}
            onPress={() => setRole('client')}
            activeOpacity={0.8}
          >
            <Text style={[styles.roleLabel, role === 'client' && styles.roleLabelActive]}>Client</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleOption, role === 'rider' && styles.roleOptionActive]}
            onPress={() => setRole('rider')}
            activeOpacity={0.8}
          >
            <Text style={[styles.roleLabel, role === 'rider' && styles.roleLabelActive]}>Rider</Text>
          </TouchableOpacity>
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
          <Input
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            icon={<Mail size={20} color="#999" />}
            autoComplete="email"
            keyboardType="email-address"
            disabled={loading}
            textContentType="emailAddress"
          />

          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            icon={<Lock size={20} color="#999" />}
            rightIcon={
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color="#999" /> : <Eye size={20} color="#999" />}
              </Pressable>
            }
            autoComplete="current-password"
            disabled={loading}
            textContentType="password"
          />

          <View style={styles.formOptions}>
            <Pressable style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkmark}>\u2713</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Remember me</Text>
            </Pressable>
            <Link href="/forgot-password" style={styles.forgotPassword}>
              Forgot password?
            </Link>
          </View>

          <Button
            title={loading ? 'Signing in...' : role === 'client' ? 'Login as Client' : 'Login as Rider'}
            variant={role === 'client' ? 'primary' : 'primary-rider'}
            fullWidth
            onPress={handleSubmit}
            disabled={loading}
            loading={loading}
            style={styles.loginButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{"Don't have an account? "}</Text>
          <Link href="/auth/register" style={styles.footerLink}>
            Register
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
    marginBottom: 32,
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
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  roleOptionActive: {
    backgroundColor: '#132B5E',
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#555555',
  },
  roleLabelActive: {
    color: '#fff',
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
    gap: 20,
  },
  formOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#999',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#132B5E',
    borderColor: '#132B5E',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#555555',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#132B5E',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  loginButton: {
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

