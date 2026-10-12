import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { ArrowLeft, User, Mail, Phone, Shield, Settings, LogOut, Camera, Edit2, HelpCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { IconCircle } from '@/components/IconCircle';
import { Badge } from '@/components/Badge';

export default function ClientProfile() {
  const { user, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await updateProfile(formData);
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: logout, style: 'destructive' },
    ]);
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
          <Text style={styles.pageTitle}>Profile</Text>
          <View style={{ width: 48 }} />
        </View>

        <Card padding="lg" style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              {user?.avatar ? (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>👤</Text>
                </View>
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{user?.firstName?.[0]}{user?.lastName?.[0]}</Text>
                </View>
              )}
              {editing && (
                <View style={styles.cameraButton}>
                  <Camera size={20} color="#fff" />
                </View>
              )}
            </View>
            <View style={styles.nameSection}>
              {editing ? (
                <>
                  <Input
                    label="First Name"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChangeText={(v) => setFormData({ ...formData, firstName: v })}
                    icon={<User size={20} color="#999" />}
                    style={{ width: '48%' }}
                  />
                  <Input
                    label="Last Name"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChangeText={(v) => setFormData({ ...formData, lastName: v })}
                    icon={<User size={20} color="#999" />}
                    style={{ width: '48%' }}
                  />
                </>
              ) : (
                <Text style={styles.name}>
                  {user?.firstName} {user?.lastName}
                </Text>
              )}
              {!editing && (
                <Text style={styles.email}>{user?.email}</Text>
              )}
              <View style={styles.roleBadge}>
                <Badge variant="primary" size="sm">Client</Badge>
                {user?.isVerified && (
                  <Badge variant="success" size="sm">Verified</Badge>
                )}
              </View>
            </View>
          </View>
        </Card>

        <Card padding="lg" style={styles.formCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            {editing ? (
              <Button
                title={loading ? 'Saving...' : 'Save'}
                variant="primary"
                size="sm"
                onPress={handleSave}
                disabled={loading}
                loading={loading}
              />
            ) : (
              <Button
                title="Edit"
                variant="outline"
                size="sm"
                leftIcon={<Edit2 size={16} />}
                onPress={() => setEditing(true)}
              />
            )}
          </View>

          {editing ? (
            <>
              <Input
                label="Email"
                placeholder="Email"
                value={formData.email}
                onChangeText={(v) => setFormData({ ...formData, email: v })}
                icon={<Mail size={20} color="#999" />}
                keyboardType="email-address"
                disabled
              />
              <Input
                label="Phone"
                placeholder="Phone"
                value={formData.phone}
                onChangeText={(v) => setFormData({ ...formData, phone: v })}
                icon={<Phone size={20} color="#999" />}
                keyboardType="phone-pad"
              />
              <Input
                label="Address"
                placeholder="Address"
                value={formData.address}
                onChangeText={(v) => setFormData({ ...formData, address: v })}
                icon={<IconCircle size="sm" bgColor="#f0f0f0"><Text style={styles.mapPinIcon}>📍</Text></IconCircle>}
                multiline
                numberOfLines={3}
              />
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <IconCircle size="sm" bgColor="rgba(19, 43, 94, 0.1)">
                  <Mail size={20} color="#132B5E" />
                </IconCircle>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{user?.email}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <IconCircle size="sm" bgColor="rgba(19, 43, 94, 0.1)">
                  <Phone size={20} color="#132B5E" />
                </IconCircle>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{user?.phone}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <IconCircle size="sm" bgColor="rgba(19, 43, 94, 0.1)">
                  <Text style={styles.mapPinIcon}>📍</Text>
                </IconCircle>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>{user?.address || 'Not set'}</Text>
                </View>
              </View>
            </>
          )}
        </Card>

        <Card padding="lg" style={styles.formCard}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <View style={styles.settingsItem}>
            <View style={styles.settingsIcon}>
              <Shield size={22} color="#132B5E" />
            </View>
            <View style={styles.settingsContent}>
              <Text style={styles.settingsLabel}>Security</Text>
              <Text style={styles.settingsDesc}>Change password, enable 2FA</Text>
            </View>
            <Text style={styles.settingsChevron}>›</Text>
          </View>

          <View style={styles.settingsItem}>
            <View style={styles.settingsIcon}>
              <Settings size={22} color="#132B5E" />
            </View>
            <View style={styles.settingsContent}>
              <Text style={styles.settingsLabel}>Notifications</Text>
              <Text style={styles.settingsDesc}>Manage notification preferences</Text>
            </View>
            <Text style={styles.settingsChevron}>›</Text>
          </View>

          <View style={styles.settingsItem}>
            <View style={styles.settingsIcon}>
              <HelpCircle size={22} color="#132B5E" />
            </View>
            <View style={styles.settingsContent}>
              <Text style={styles.settingsLabel}>Help & Support</Text>
              <Text style={styles.settingsDesc}>FAQ, contact us, feedback</Text>
            </View>
            <Text style={styles.settingsChevron}>›</Text>
          </View>
        </Card>

        <Button
          title="Logout"
          variant="outline"
          fullWidth
          size="lg"
          leftIcon={<LogOut size={20} />}
          onPress={handleLogout}
          style={styles.logoutButton}
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
  profileCard: {
    marginBottom: 20,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#132B5E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#132B5E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    gap: 8,
  },
  formCard: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  mapPinIcon: {
    fontSize: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingsIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(19, 43, 94, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsContent: {
    flex: 1,
  },
  settingsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  settingsDesc: {
    fontSize: 13,
    color: '#999',
  },
  settingsChevron: {
    fontSize: 20,
    color: '#999',
  },
  logoutButton: {
    marginTop: 8,
  },
});

