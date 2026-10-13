import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Link } from 'expo-router';
import { Package, ArrowLeft, Filter, Calendar } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { Card } from '@/components/Card';
import { Badge, OrderStatusBadge } from '@/components/Badge';
import { IconCircle } from '@/components/IconCircle';
import { Button } from '@/components/Button';

const statusTabs = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function ClientOrders() {
  const { user } = useAuth();
  const { orders, loading, fetchOrders } = useOrders(user?.id || null, 'client');
  const [activeTab, setActiveTab] = useState('all');

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return !['delivered', 'cancelled'].includes(order.status);
    return order.status === activeTab;
  });

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Link href="/client/dashboard" style={styles.backButton}>
          <ArrowLeft size={24} color="#132B5E" />
        </Link>
        <Text style={styles.pageTitle}>My Orders</Text>
        <View style={styles.headerActions}>
          <Button
            title="New Order"
            variant="primary"
            size="sm"
            leftIcon={<Package size={18} />}
            onPress={() => {}}
          />
        </View>
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
          <Text style={styles.emptyTitle}>No orders found</Text>
          <Text style={styles.emptyDescription}>
            {activeTab === 'all' ? 'Start by creating your first order' : `No ${activeTab} orders`}
          </Text>
          {activeTab === 'all' && (
            <Button
              title="Create Order"
              variant="primary"
              fullWidth
              size="lg"
              onPress={() => {}}
            />
          )}
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
          <IconCircle size="md" bgColor="rgba(19, 43, 94, 0.1)">
            <Package size={22} color="#132B5E" />
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
          <Calendar size={16} color="#999" />
          <Text style={styles.detailText}>
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailText}>
            {order.pickupLocation.address?.split(',')[0]} → {order.dropoffLocation.address?.split(',')[0]}
          </Text>
        </View>
      </View>
    </Card>
  );
}

import { Pressable } from 'react-native';

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
  headerActions: {
    width: 48,
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
    color: '#132B5E',
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
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  detailText: {
    fontSize: 13,
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

