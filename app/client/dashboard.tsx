import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { Link } from 'expo-router';
import { Package, ShoppingBag, MapPin, User, Plus, Clock, MapPin as MapPinIcon, DollarSign } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { Card } from '@/components/Card';
import { Badge, OrderStatusBadge } from '@/components/Badge';
import { IconCircle } from '@/components/IconCircle';

const quickActions = [
  { label: 'Order Dispatch', icon: Package, path: '/client/orders/new?type=dispatch', color: '#132B5E', bgColor: 'rgba(19, 43, 94, 0.1)' },
  { label: 'Shop for Me', icon: ShoppingBag, path: '/client/shop', color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)' },
  { label: 'Track Order', icon: MapPin, path: '/client/track', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  { label: 'Profile', icon: User, path: '/client/profile', color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.1)' },
];

export default function ClientDashboard() {
  const { user } = useAuth();
  const { orders, loading, fetchOrders } = useOrders(user?.id || null, 'client');

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const recentOrders = orders.slice(0, 3);

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Welcome back, {user?.firstName}!</Text>
        <Text style={styles.welcomeSubtitle}>What would you like to do today?</Text>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} href={action.path} asChild>
              <View style={styles.actionCard}>
                <IconCircle size="lg" bgColor={action.bgColor}>
                  <Icon size={28} color={action.color} />
                </IconCircle>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </View>
            </Link>
          );
        })}
      </View>

      {activeOrders.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Orders</Text>
            <Link href="/client/orders" style={styles.viewAllLink}>
              View all
            </Link>
          </View>
          <View style={styles.ordersList}>
            {activeOrders.map((order) => (
              <Link key={order.id} href={`/client/orders/${order.id}`} asChild>
                <OrderCard order={order} />
              </Link>
            ))}
          </View>
        </>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        <Link href="/client/orders" style={styles.viewAllLink}>
          View all
        </Link>
      </View>

      {loading ? (
        <View style={styles.skeletonList}>
          {[1, 2, 3].map(i => (
            <View key={i} style={styles.skeletonCard}>
              <View style={styles.skeletonLine} />
              <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
            </View>
          ))}
        </View>
      ) : recentOrders.length > 0 ? (
        <View style={styles.ordersList}>
          {recentOrders.map((order) => (
            <Link key={order.id} href={`/client/orders/${order.id}`} asChild>
              <OrderCard order={order} />
            </Link>
          ))}
        </View>
      ) : (
        <Card padding="lg" style={styles.emptyState}>
          <IconCircle size="xl" bgColor="#f0f0f0" style={styles.emptyIcon}>
            <Package size={48} color="#d1d5db" />
          </IconCircle>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyDescription}>Start by creating your first order</Text>
          <Link href="/client/orders/new?type=dispatch" asChild>
            <Button
              title="Create Order"
              variant="primary"
              fullWidth
              size="lg"
              onPress={() => {}}
            />
          </Link>
        </Card>
      )}
    </ScrollView>
  );
}

interface OrderCardProps {
  order: any;
}

function OrderCard({ order }: OrderCardProps) {
  return (
    <Card style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderTypeContainer}>
          <IconCircle size="md" bgColor={order.status === 'delivered' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(19, 43, 94, 0.1)'}>
            {order.type === 'dispatch' ? (
              <Package size={22} color={order.status === 'delivered' ? '#10b981' : '#132B5E'} />
            ) : (
              <ShoppingBag size={22} color={order.status === 'delivered' ? '#10b981' : '#132B5E'} />
            )}
          </IconCircle>
          <View style={styles.orderTypeInfo}>
            <Text style={styles.orderType}>
              {order.type === 'dispatch' ? 'Dispatch Order' : 'Shop for Me'}
            </Text>
            <Text style={styles.orderMeta}>
              {order.id} • ₦{order.price.toLocaleString()}
            </Text>
          </View>
        </View>
        <OrderStatusBadge status={order.status} />
      </View>
      <View style={styles.orderDetails}>
        <View style={styles.detailItem}>
          <MapPinIcon size={16} color="#999" />
          <Text style={styles.detailText}>{order.pickupLocation.address?.split(',')[0]}</Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={16} color="#999" />
          <Text style={styles.detailText}>{order.estimatedTime} min</Text>
        </View>
      </View>
    </Card>
  );
}

import { Button } from '@/components/Button';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#132B5E',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#555555',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#132B5E',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 32,
  },
  viewAllLink: {
    fontSize: 15,
    color: '#132B5E',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 16,
  },
  actionCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#132B5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 12,
    textAlign: 'center',
  },
  ordersList: {
    gap: 16,
  },
  orderCard: {
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 16,
  },
  orderTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  orderTypeInfo: {
    flex: 1,
  },
  orderType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  orderMeta: {
    fontSize: 14,
    color: '#555555',
  },
  orderDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#555555',
  },
  skeletonList: {
    gap: 16,
  },
  skeletonCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  skeletonLine: {
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    width: '60%',
    marginBottom: 12,
  },
  skeletonLineShort: {
    width: '40%',
    marginBottom: 0,
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    color: '#555555',
    marginBottom: 24,
    textAlign: 'center',
  },
});

