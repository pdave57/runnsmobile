import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Link } from 'expo-router';
import { ArrowLeft, Search, MapPin, Clock, Navigation, Truck, CheckCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useOrderTracking } from '@/hooks/useOrders';
import { Card } from '@/components/Card';
import { Badge, OrderStatusBadge } from '@/components/Badge';
import { IconCircle } from '@/components/IconCircle';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Order } from '@/types';

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: CheckCircle },
  { key: 'searching-rider', label: 'Finding Rider', icon: Search },
  { key: 'rider-assigned', label: 'Rider Assigned', icon: Navigation },
  { key: 'rider-en-route-pickup', label: 'En Route to Pickup', icon: Truck },
  { key: 'at-pickup', label: 'At Pickup', icon: MapPin },
  { key: 'rider-en-route-dropoff', label: 'En Route to Dropoff', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function ClientTrack() {
  const { user } = useAuth();
  const [trackingCode, setTrackingCode] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const { trackingData, loading } = useOrderTracking(order?.id || null);

  const handleSearch = async () => {
    if (!trackingCode.trim()) {
      Alert.alert('Error', 'Please enter a tracking code');
      return;
    }
    setSearched(true);
    // In real app, this would call the API
    // For now, we'll simulate
    setOrder({
      id: trackingCode,
      clientId: user?.id || '',
      type: 'dispatch',
      status: 'rider-en-route-pickup',
      pickupLocation: { lat: 6.5244, lng: 3.3792, address: 'Victoria Island, Lagos' },
      dropoffLocation: { lat: 6.5650, lng: 3.3242, address: 'Ikoyi, Lagos' },
      items: [{ id: '1', name: 'Package', quantity: 1, price: 2000 }],
      distance: 5.2,
      estimatedTime: 15,
      price: 2000,
      paymentStatus: 'paid',
      paymentMethod: 'card',
      createdAt: new Date().toISOString(),
    });
  };

  const currentStatusIndex = order ? statusSteps.findIndex(s => s.key === order.status) : -1;

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Link href="/client/dashboard" style={styles.backButton}>
          <ArrowLeft size={24} color="#132B5E" />
        </Link>
        <Text style={styles.pageTitle}>Track Order</Text>
        <View style={{ width: 48 }} />
      </View>

      {!order ? (
        <Card padding="lg" style={styles.searchCard}>
          <Text style={styles.searchTitle}>Track Your Order</Text>
          <Text style={styles.searchSubtitle}>Enter your tracking code to see real-time updates</Text>
          <View style={styles.searchInputContainer}>
            <Input
              label="Tracking Code"
              placeholder="e.g., ORD-12345"
              value={trackingCode}
              onChangeText={setTrackingCode}
              icon={<Search size={20} color="#999" />}
              rightIcon={
                <Button
                  title="Track"
                  variant="primary"
                  size="sm"
                  onPress={handleSearch}
                  disabled={!trackingCode.trim() || loading}
                  loading={loading}
                />
              }
            />
          </View>
        </Card>
      ) : (
        <>
          <Card padding="lg" style={styles.orderInfoCard}>
            <View style={styles.orderInfoHeader}>
              <View style={styles.orderTypeContainer}>
                <IconCircle size="md" bgColor="rgba(19, 43, 94, 0.1)">
                  <Truck size={22} color="#132B5E" />
                </IconCircle>
                <View>
                  <Text style={styles.orderType}>
                    {order.type === 'dispatch' ? 'Dispatch Order' : 'Shop for Me'}
                  </Text>
                  <Text style={styles.orderId}>{order.id}</Text>
                </View>
              </View>
              <OrderStatusBadge status={order.status} />
            </View>

            <View style={styles.routeInfo}>
              <View style={styles.locationItem}>
                <View style={styles.locationIconWrapper}>
                  <IconCircle size="sm" bgColor="rgba(19, 43, 94, 0.1)">
                    <MapPin size={18} color="#132B5E" />
                  </IconCircle>
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationLabel}>Pickup</Text>
                  <Text style={styles.locationAddress}>{order.pickupLocation.address}</Text>
                </View>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.locationItem}>
                <View style={styles.locationIconWrapper}>
                  <IconCircle size="sm" bgColor="rgba(16, 185, 129, 0.1)">
                    <MapPin size={18} color="#10b981" />
                  </IconCircle>
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationLabel}>Dropoff</Text>
                  <Text style={styles.locationAddress}>{order.dropoffLocation.address}</Text>
                </View>
              </View>
            </View>

            {trackingData && (
              <View style={styles.trackingInfo}>
                <View style={styles.trackingItem}>
                  <IconCircle size="sm" bgColor="rgba(59, 130, 246, 0.1)">
                    <Clock size={18} color="#3b82f6" />
                  </IconCircle>
                  <View>
                    <Text style={styles.trackingLabel}>Estimated Arrival</Text>
                    <Text style={styles.trackingValue}>{trackingData.estimatedArrival} min</Text>
                  </View>
                </View>
                <View style={styles.trackingItem}>
                  <IconCircle size="sm" bgColor="rgba(19, 43, 94, 0.1)">
                    <Navigation size={18} color="#132B5E" />
                  </IconCircle>
                  <View>
                    <Text style={styles.trackingLabel}>Rider Status</Text>
                    <Text style={styles.trackingValue}>
                      {trackingData.status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </Card>

          <Card padding="lg" style={styles.stepsCard}>
            <Text style={styles.stepsTitle}>Delivery Progress</Text>
            <View style={styles.stepsContainer}>
              {statusSteps.map((step, index) => {
                const isCompleted = index < currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const isLast = index === statusSteps.length - 1;

                return (
                  <View key={step.key} style={styles.stepItem}>
                    <View style={styles.stepConnectorContainer}>
                      {!isLast && (
                        <View style={[
                          styles.stepConnector,
                          isCompleted && styles.stepConnectorCompleted,
                        ]} />
                      )}
                      <View style={[
                        styles.stepCircle,
                        isCompleted && styles.stepCircleCompleted,
                        isCurrent && styles.stepCircleCurrent,
                      ]}>
                        <step.icon
                          size={isCurrent ? 20 : 16}
                          color={isCompleted ? '#fff' : isCurrent ? '#132B5E' : '#d1d5db'}
                          strokeWidth={2}
                        />
                      </View>
                    </View>
                    <Text style={[
                      styles.stepLabel,
                      isCompleted && styles.stepLabelCompleted,
                      isCurrent && styles.stepLabelCurrent,
                    ]}>
                      {step.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Card>

          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <Button
              title="Contact Rider"
              variant="outline"
              fullWidth
              size="lg"
              leftIcon={<Navigation size={20} />}
              onPress={() => Alert.alert('Contact', 'Calling rider...')}
              style={styles.contactButton}
            />
          )}
        </>
      )}
    </ScrollView>
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
  searchCard: {
    marginBottom: 20,
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  searchSubtitle: {
    color: '#555555',
    marginBottom: 24,
    textAlign: 'center',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orderInfoCard: {
    marginBottom: 20,
  },
  orderInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  orderTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orderType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  orderId: {
    fontSize: 14,
    color: '#555555',
  },
  routeInfo: {
    marginBottom: 24,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  locationIconWrapper: {
    marginTop: 2,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 15,
    color: '#1A1A1A',
  },
  routeLine: {
    position: 'absolute',
    left: 20,
    top: 44,
    bottom: 44,
    width: 2,
    backgroundColor: '#f0f0f0',
  },
  trackingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  trackingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trackingLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  trackingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  stepsCard: {
    marginBottom: 20,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  stepsContainer: {
    gap: 0,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 16,
  },
  stepConnectorContainer: {
    width: 40,
    alignItems: 'center',
  },
  stepConnector: {
    position: 'absolute',
    left: 19,
    top: 36,
    bottom: 0,
    width: 2,
    backgroundColor: '#f0f0f0',
  },
  stepConnectorCompleted: {
    backgroundColor: '#132B5E',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  stepCircleCompleted: {
    backgroundColor: '#132B5E',
    borderColor: '#132B5E',
  },
  stepCircleCurrent: {
    backgroundColor: '#fff',
    borderColor: '#132B5E',
    borderWidth: 3,
    boxShadow: '0 0 0 4px rgba(19, 43, 94, 0.1)',
  },
  stepLabel: {
    fontSize: 13,
    color: '#999',
    flex: 1,
    marginTop: 8,
  },
  stepLabelCompleted: {
    color: '#1A1A1A',
    fontWeight: '600',
  },
  stepLabelCurrent: {
    color: '#132B5E',
    fontWeight: '700',
  },
  contactButton: {
    marginTop: 8,
  },
});

