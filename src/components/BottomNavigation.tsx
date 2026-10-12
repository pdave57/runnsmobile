import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Home, Package, ShoppingBag, MapPin, User, Menu, Grid, LogOut, Settings, Wallet } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

const clientNavItems = [
  { path: '/client/dashboard', label: 'Home', icon: Home, iconName: 'Home' },
  { path: '/client/orders', label: 'Orders', icon: Package, iconName: 'Package' },
  { path: '/client/shop', label: 'Shop', icon: ShoppingBag, iconName: 'ShoppingBag' },
  { path: '/client/track', label: 'Track', icon: MapPin, iconName: 'MapPin' },
  { path: '/client/profile', label: 'Profile', icon: User, iconName: 'User' },
];

const riderNavItems = [
  { path: '/rider/dashboard', label: 'Dashboard', icon: Home, iconName: 'Home' },
  { path: '/rider/orders', label: 'Orders', icon: Package, iconName: 'Package' },
  { path: '/rider/earnings', label: 'Earnings', icon: Wallet, iconName: 'Wallet' },
  { path: '/rider/profile', label: 'Profile', icon: User, iconName: 'User' },
];

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  iconName: string;
}

export function BottomNavigation() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { notifications } = useNotifications();

  if (!user) return null;

  const navItems: NavItem[] = user.role === 'rider' ? riderNavItems : clientNavItems;
  const currentPath = router.pathname || '/';

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.navBar} pointerEvents="auto">
        <View style={styles.navGrid}>
          {navItems.map((item, index) => {
            const isActive = currentPath === item.path || (item.path !== '/client/dashboard' && currentPath.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path as any}
                style={[
                  styles.navItem,
                  isActive ? styles.navItemActive : styles.navItemInactive,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                <Icon
                  size={24}
                  color={isActive ? '#132B5E' : '#999'}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <View style={styles.badgeContainer}>
                  <Text style={[
                    styles.navLabel,
                    isActive ? styles.navLabelActive : styles.navLabelInactive,
                  ]}>
                    {item.label}
                  </Text>
                </View>
              </Link>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  navBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingBottom: 34, // Safe area for home indicator
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  navGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 60,
  },
  navItemActive: {
    backgroundColor: 'rgba(19, 43, 94, 0.08)',
  },
  navItemInactive: {},
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  navLabelActive: {
    color: '#132B5E',
  },
  navLabelInactive: {
    color: '#999',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default BottomNavigation;