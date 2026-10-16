import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Link } from 'expo-router';
import { ArrowLeft, Search, MapPin, Clock, Navigation, Truck, CheckCircle, Map, RefreshCw } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useOrderTracking } from '@/hooks/useOrders';
import { Card } from '@/components/Card';
import { OrderStatusBadge } from '@/components/Badge';
import { IconCircle } from '@/components/IconCircle';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { TrackMap, useDeviceLocation } from '@/components/TrackMap';
import { Order, Location } from '@/types';
import { api } from '@/services/api';

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: CheckCircle },
  { key: 'searching-rider', label: 'Finding Rider', icon: Search },
  { key: 'rider-assigned', label: 'Rider Assigned', icon: Navigation },
  { key: 'rider-en-route-pickup', label: 'En Route to Pickup', icon: Truck },
  { key: 'at-pickup', label: 'At Pickup', icon: MapPin },
  { key: 'rider-en-route-dropoff', label: 'En Route to Dropoff', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLon = toRad(loc2.lng - loc1.lng);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(loc1.lat)) * Math.cos(toRad(loc2.lat)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

async function sendLocationToBackend(location: Location, orderId: string): Promise<number> {
  try {
    const distance = await api.calculateDistance?.(location, orderId);
    return distance || 0;
  } catch {
    return 0;
  }
}

export default function ClientTrack() {
  const { user } = useAuth();
  const [trackingCode, setTrackingCode] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const { trackingData, loading } = useOrderTracking(order?.id || null);
  
  // Get device location for distance calculation
  const { location: deviceLocation, error: locationError, loading: locationLoading } = useDeviceLocation();

  const handleSearch = async () => {
    if (!trackingCode.trim()) {
      Alert.alert('Error', 'Please enter a tracking code');
      return;
    }
    setMapError(null);
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

  const handleCalculateDistance = useCallback(async () => {
    if (!order || !deviceLocation) {
      Alert.alert('Error', 'Location not available. Please enable location services.');
      return;
    }

    const pickupDistance = calculateDistance(deviceLocation, order.pickupLocation);
    const dropoffDistance = calculateDistance(deviceLocation, order.dropoffLocation);
    const totalDistance = calculateDistance(order.pickupLocation, order.dropoffLocation);

    Alert.alert(
      'Distance Information',
      `Your location to Pickup: ${pickupDistance.toFixed(2)} km\n` +
      `Your location to Dropoff: ${dropoffDistance.toFixed(2)} km\n` +
      `Total Route Distance: ${totalDistance.toFixed(2)} km`,
      [{ text: 'OK' }]
    );

    // Send to backend if needed
    if (order.id) {
      await sendLocationToBackend(deviceLocation, order.id);
    }
  }, [order, deviceLocation]);

  const currentStatusIndex = order ? statusSteps.findIndex(s => s.key === order.status) : -1;
  const route = trackingData?.route || (order ? [order.pickupLocation, order.dropoffLocation] : []);

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
          {/* Map View */}
          <Card padding="none" style={styles.mapCard}>
            {mapError && (
              <View style={styles.mapError}>
                <Text style={styles.mapErrorText}>{mapError}</Text>
                <Button
                  title="Retry"
                  variant="outline"
                  size="sm"
                  onPress={() => { setMapError(null); }}
                  style={{ marginTop: 8 }}
                />
              </View>
            )}
            <TrackMap
              riderLocation={trackingData?.riderLocation || order.pickupLocation}
              pickupLocation={order.pickupLocation}
              dropoffLocation={order.dropoffLocation}
              route={route}
              status={order.status}
              height={300}
              onMapReady={() => setMapError(null)}
            />
          </Card>

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

            {/* Distance Calculator */}
            <View style={styles.distanceCalculator}>
              <View style={styles.distanceButtonContainer}>
                <Button
                  title="Calculate Distance from My Location"
                  variant="outline"
                  fullWidth
                  size="md"
                  leftIcon={<Map size={20} />}
                  rightIcon={locationLoading ? <RefreshCw size={18} /> : undefined}
                  onPress={handleCalculateDistance}
                  disabled={!deviceLocation || locationLoading}
                  loading={locationLoading}
                />
              </View>
              {deviceLocation && (
                <View style={styles.deviceLocationInfo}>
                  <Text style={styles.deviceLocationText}>
                    Your location: {deviceLocation.lat.toFixed(6)}, {deviceLocation.lng.toFixed(6)}
                  </Text>
                </View>
              )}
              {locationError && (
                <View style={styles.locationError}>
                  <Text style={styles.locationErrorText}>
                    {locationError}. Please enable location services in settings.
                  </Text>
                  <Button
                    title="Open Settings"
                    variant="outline"
                    size="sm"
                    onPress={() => {
                      if (Platform.OS === 'ios') {
                        Alert.alert('Open Settings', 'Please go to Settings > Privacy > Location Services to enable location for this app.');
                      } else {
                        Alert.alert('Open Settings', 'Please go to Settings > Location to enable location for this app.');
                      }
                    }}
                    style={{ marginTop: 8 }}
                  />
                </View>
              )}
            </View>
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
  mapCard: {
    marginBottom: 20,
    overflow: 'hidden',
    borderRadius: 16,
  },
  mapError: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 20,
  },
  mapErrorText: {
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 12,
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
  distanceCalculator: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 16,
  },
  distanceButtonContainer: {
    marginBottom: 12,
  },
  deviceLocationInfo: {
    padding: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
  },
  deviceLocationText: {
    fontSize: 13,
    color: '#0369a1',
    fontFamily: 'monospace',
  },
  locationError: {
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
  },
  locationErrorText: {
    fontSize: 13,
    color: '#dc2626',
    marginBottom: 8,
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