import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Link } from 'expo-router';
import { ArrowLeft, Filter, Package, Truck, Clock, MapPin } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { Card } from '@/components/Card';
import { Badge, OrderStatusBadge } from '@/components/Badge';
import { IconCircle } from '@/components/IconCircle';
import { Button } from '@/components/Button';

const statusTabs = [
  { key: 'all', label: 'All' },
  { key: 'available', label: 'Available' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

export default function RiderOrders() {
  const { user } = useAuth();
  const { orders, loading, fetchOrders } = useOrders(user?.id || null, 'rider');
  const [activeTab, setActiveTab] = useState('all');

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'available') return ['pending', 'searching-rider'].includes(order.status);
    if (activeTab === 'active') return ['rider-assigned', 'rider-en-route-pickup', 'at-pickup', 'rider-en-route-dropoff'].includes(order.status);
    if (activeTab === 'completed') return ['delivered', 'cancelled'].includes(order.status);
    return true;
  });

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Link href="/rider/dashboard" as any style={styles.backButton}>
          <ArrowLeft size={24} color="#D91E36" />
        </Link>
        <Text style={styles.pageTitle}>My Orders</Text>
        <View style={{ width: 48 }} />
      </View>

      <View style={styles.tabsContainer}>
        {statusTabs.map(tab => (
          <Pressable
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[
              styles.tab,
              activeTab === tab.key ? styles.tabActive : styles.tabInactive,
            ]}
          >
            <Text style={[
              styles.tabLabel,
              activeTab === tab.key ? styles.tabLabelActive : styles.tabLabelInactive,
            ]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
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
      ) : filteredOrders.length > 0 ? (
        <View style={styles.ordersList}>
          {filteredOrders.map(order => (
            <Link key={order.id} href={`/rider/orders/${order.id}`} as any>
              <RiderOrderCard order={order} />
            </Link>
          ))}
        </View>
      ) : (
        <Card padding="lg" style={styles.emptyState}>
          <IconCircle size="xl" bgColor="#f0f0f0" style={styles.emptyIcon}>
            <Package size={48} color="#d1d5db" />
          </IconCircle>
          <Text style={styles.emptyTitle}>No orders found</Text>
          <Text style={styles.emptyDescription}>
            {activeTab === 'available' ? 'No available orders at the moment' : `No ${activeTab} orders`}
          </Text>
        </Card>
      )}
    </ScrollView>
  );
}

interface RiderOrderCardProps {
  order: any;
}

function RiderOrderCard({ order }: RiderOrderCardProps) {
  const isActive = ['rider-assigned', 'rider-en-route-pickup', 'at-pickup', 'rider-en-route-dropoff'].includes(order.status);
  const isAvailable = ['pending', 'searching-rider'].includes(order.status);

  return (
    <Card style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderTypeContainer}>
          <IconCircle size="md" bgColor="rgba(217, 30, 54, 0.1)">
            <Truck size={22} color="#D91E36" />
          </IconCircle>
          <View style={styles.orderTypeInfo}>
            <Text style={styles.orderType}>
              {order.type === 'dispatch' ? 'Dispatch' : 'Shop for Me'}
            </Text>
            <Text style={styles.orderMeta}>
              {order.id} • ₦{order.price.toLocaleString()}
            </Text>
          </View>
        </View>
        <OrderStatusBadge status={order.status} />
      </View>
      <View style={styles.orderRoute}>
        <View style={styles.routePoint}>
          <View style={styles.routeDot} />
          <View style={styles.routeLine} />
        </View>
        <View style={styles.routeInfo}>
          <Text style={styles.routeLabel}>Pickup</Text>
          <Text style={styles.routeAddress}>{order.pickupLocation.address?.split(',')[0]}</Text>
        </View>
      </View>
      <View style={styles.orderRoute}>
        <View style={styles.routePoint}>
          <View style={[styles.routeDot, styles.routeDotEnd]} />
        </View>
        <View style={styles.routeInfo}>
          <Text style={styles.routeLabel}>Dropoff</Text>
          <Text style={styles.routeAddress}>{order.dropoffLocation.address?.split(',')[0]}</Text>
        </View>
      </View>
      {isAvailable && (
        <Button
          title="Accept Order"
          variant="primary-rider"
          fullWidth
          size="sm"
          onPress={() => {}}
          style={styles.acceptButton}
        />
      )}
      {isActive && (
        <View style={styles.activeActions}>
          {order.status === 'rider-assigned' && (
            <Button
              title="Start Pickup"
              variant="primary-rider"
              fullWidth
              size="sm"
              onPress={() => {}}
              style={styles.actionButton}
            />
          )}
          {order.status === 'rider-en-route-pickup' && (
            <Button
              title="Arrived at Pickup"
              variant="primary-rider"
              fullWidth
              size="sm"
              onPress={() => {}}
              style={styles.actionButton}
            />
          )}
          {order.status === 'at-pickup' && (
            <Button
              title="Start Delivery"
              variant="primary-rider"
              fullWidth
              size="sm"
              onPress={() => {}}
              style={styles.actionButton}
            />
          )}
          {order.status === 'rider-en-route-dropoff' && (
            <Button
              title="Complete Delivery"
              variant="primary-rider"
              fullWidth
              size="sm"
              onPress={() => {}}
              style={styles.actionButton}
            />
          )}
        </View>
      )}
    </Card>
  );
}

import { Pressable, Truck } from 'react-native';

const styles = StyleSheet.create({
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabInactive: {},
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#D91E36',
  },
  tabLabelInactive: {
    color: '#999',
  },
  ordersList: {
    gap: 16,
  },
  orderCard: {},
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
  orderRoute: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  routePoint: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D91E36',
    zIndex: 1,
  },
  routeDotEnd: {
    backgroundColor: '#10b981',
  },
  routeLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#f0f0f0',
    marginTop: 4,
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  routeAddress: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  acceptButton: {
    marginTop: 8,
  },
  activeActions: {
    marginTop: 8,
  },
  actionButton: {
    marginTop: 8,
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

