import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { User, LogOut } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { IconCircle } from './IconCircle';

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/auth/role-select' as any);
  };

  if (!user) {
    return (
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image source={require('../../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
      </View>

      <View style={styles.actions}>
        <Link
          href={user.role === 'rider' ? '/rider/profile-setup' : '/client/profile'}
          style={styles.userLink}
        >
          <IconCircle size="sm" bgColor="rgba(255,255,255,0.2)">
            <User size={20} color="#fff" />
          </IconCircle>
        </Link>
        <Pressable onPress={handleLogout} style={styles.iconButton} accessibilityLabel="Logout">
          <IconCircle size="sm" bgColor="rgba(255,255,255,0.2)">
            <LogOut size={22} color="#fff" />
          </IconCircle>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#132B5E',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    height: 180,
    width: undefined,
    aspectRatio: 1,
  },
  actions: {
    position: 'absolute',
    top: 50,
    right: 20,
    transform: [{ translateY: -25 }],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  userLink: {
    padding: 8,
    borderRadius: 8,
  },
});

export default Header;