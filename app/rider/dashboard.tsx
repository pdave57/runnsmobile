import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Wallet, Truck, CheckCircle, Clock, MapPin, DollarSign, TrendingUp } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders, useRiderAvailability } from '@/hooks/useOrders';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { IconCircle } from '@/components/IconCircle';
import { Button } from '@/components/Button';

export default function RiderDashboard() {
  const { user } = useAuth();
  const { orders, loading } = useOrders(user?.id || null, 'rider');
  const { isOnline, loading: availabilityLoading, toggleAvailability } = useRiderAvailability(user?.id || null);

  const activeOrders = orders.filter(o => 
    ['rider-assigned', 'rider-en-route-pickup', 'at-pickup', 'rider-en-route-dropoff'].includes(o.status)
  );
  const pendingDispatches = orders.filter(o => o.status === 'pending' || o.status === 'searching-rider');
  const completedToday = orders.filter(o => 
    o.status === 'delivered' && 
    new Date(o.deliveredAt || 0).toDateString() === new Date().toDateString()
  ).length;
  const earningsToday = completedToday * 500; // Mock calculation

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Good morning, {user?.firstName}!</Text>
        <Text style={styles.welcomeSubtitle}>Ready to earn today?</Text>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusContent}>
          <View style={[
            styles.statusIndicator,
            isOnline ? styles.statusOnline : styles.statusOffline,
          ]}>
            <View style={[
              styles.statusDot,
              isOnline && styles.statusDotActive,
            ]} />
            <Text style={[
              styles.statusText,
              isOnline ? styles.statusTextOnline : styles.statusTextOffline,
            ]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
          <Button
            title={isOnline ? 'Go Offline' : 'Go Online'}
            variant={isOnline ? 'outline' : 'primary-rider'}
            size="md"
            onPress={toggleAvailability}
            disabled={availabilityLoading}
            loading={availabilityLoading}
            leftIcon={<Truck size={18} />}
            style={styles.toggleButton}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>{"Today's Stats"}</Text>
      <View style={styles.statsGrid}>
        <StatCard
          title="Earnings Today"
          value={`₦${earningsToday.toLocaleString()}`}
          icon={Wallet}
          color="#10b981"
          bgColor="rgba(16, 185, 129, 0.1)"
        />
        <StatCard
          title="Deliveries"
          value={completedToday.toString()}
          icon={CheckCircle}
          color="#3b82f6"
          bgColor="rgba(59, 130, 246, 0.1)"
        />
        <StatCard
          title="Active Orders"
          value={activeOrders.length.toString()}
          icon={Truck}
          color="#f59e0b"
          bgColor="rgba(245, 158, 11, 0.1)"
        />
        <StatCard
          title="Rating"
          value={user?.rating?.toFixed(1) || '5.0'}
          icon={TrendingUp}
          color="#8b5cf6"
          bgColor="rgba(139, 92, 246, 0.1)"
        />
      </View>

      {activeOrders.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Deliveries</Text>
          </View>
          <View style={styles.ordersList}>
            {activeOrders.map(order => (
              <Link key={order.id} href={`/rider/orders/${order.id}`} asChild>
                <RiderOrderCard order={order} />
              </Link>
            ))}
          </View>
        </>
      )}

      {pendingDispatches.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Orders</Text>
          </View>
          <View style={styles.ordersList}>
            {pendingDispatches.slice(0, 3).map(order => (
              <Link key={order.id} href={`/rider/orders/${order.id}`} asChild>
                <RiderOrderCard order={order} showAccept={true} />
              </Link>
            ))}
          </View>
        </>
      )}

      {(activeOrders.length === 0 && pendingDispatches.length === 0) && (
        <Card padding="lg" style={styles.emptyState}>
          <IconCircle size="xl" bgColor="#f0f0f0" style={styles.emptyIcon}>
            <Truck size={48} color="#d1d5db" />
          </IconCircle>
          <Text style={styles.emptyTitle}>No active deliveries</Text>
          <Text style={styles.emptyDescription}>
            Go online to start receiving orders
          </Text>
          <Button
            title={isOnline ? 'Waiting for orders...' : 'Go Online'}
            variant={isOnline ? 'outline' : 'primary-rider'}
            fullWidth
            size="lg"
            onPress={toggleAvailability}
            disabled={availabilityLoading || isOnline}
            loading={availabilityLoading}
            leftIcon={<Truck size={20} />}
          />
        </Card>
      )}
    </ScrollView>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

function StatCard({ title, value, icon: Icon, color, bgColor }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <IconCircle size="lg" bgColor={bgColor}>
        <Icon size={28} color={color} />
      </IconCircle>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

interface RiderOrderCardProps {
  order: any;
  showAccept?: boolean;
}

function RiderOrderCard({ order, showAccept }: RiderOrderCardProps) {
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
        <Badge variant={showAccept ? 'warning' : 'primary'} size="md">
          {order.status.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
        </Badge>
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
      {showAccept && (
        <Button
          title="Accept Order"
          variant="primary-rider"
          fullWidth
          size="sm"
          onPress={() => {}}
          style={styles.acceptButton}
        />
      )}
    </Card>
  );
}

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
    marginBottom: 24,
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
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#132B5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusOnline: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
  },
  statusOffline: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#999',
  },
  statusDotActive: {
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusTextOnline: {
    color: '#10b981',
  },
  statusTextOffline: {
    color: '#ef4444',
  },
  toggleButton: {
    minWidth: 120,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#132B5E',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 16,
  },
  statCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#132B5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 12,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 32,
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
    backgroundColor: '#132B5E',
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

