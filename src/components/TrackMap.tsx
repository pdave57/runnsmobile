import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Platform, View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { useImage } from 'expo-image';
import { Location } from '@/types';

interface TrackMapProps {
  riderLocation: Location;
  pickupLocation: Location;
  dropoffLocation: Location;
  route?: Location[];
  status: string;
  height?: number;
  onMapReady?: () => void;
}

export function TrackMap({
  riderLocation,
  pickupLocation,
  dropoffLocation,
  route = [],
  status,
  height = 300,
  onMapReady,
}: TrackMapProps) {
  const mapRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Use SF Symbols / system icons as fallback since custom marker images may not exist
  const pickupIcon = useImage(require('../../assets/images/pickup-marker.png'), { maxWidth: 40, maxHeight: 40 });
  const dropoffIcon = useImage(require('../../assets/images/dropoff-marker.png'), { maxWidth: 40, maxHeight: 40 });
  const riderIcon = useImage(require('../../assets/images/rider-marker.png'), { maxWidth: 40, maxHeight: 40 });

  const markers = [
    {
      id: 'pickup',
      coordinates: { latitude: pickupLocation.lat, longitude: pickupLocation.lng },
      title: 'Pickup',
      snippet: pickupLocation.address,
      icon: pickupIcon ?? undefined,
      anchor: { x: 0.5, y: 1 },
    },
    {
      id: 'dropoff',
      coordinates: { latitude: dropoffLocation.lat, longitude: dropoffLocation.lng },
      title: 'Dropoff',
      snippet: dropoffLocation.address,
      icon: dropoffIcon ?? undefined,
      anchor: { x: 0.5, y: 1 },
    },
    {
      id: 'rider',
      coordinates: { latitude: riderLocation.lat, longitude: riderLocation.lng },
      title: 'Rider',
      snippet: 'Current location',
      icon: riderIcon ?? undefined,
      anchor: { x: 0.5, y: 0.5 },
      zIndex: 10,
    },
  ];

  const polylines = route.length >= 2 ? [
    {
      id: 'route',
      coordinates: route.map(loc => ({ latitude: loc.lat, longitude: loc.lng })),
      color: '#132B5E',
      width: 4,
      geodesic: true,
    },
  ] : [];

  const circles = [
    {
      id: 'pickup-radius',
      center: { latitude: pickupLocation.lat, longitude: pickupLocation.lng },
      radius: 100,
      color: 'rgba(19, 43, 94, 0.1)',
      lineColor: '#132B5E',
      lineWidth: 2,
    },
    {
      id: 'dropoff-radius',
      center: { latitude: dropoffLocation.lat, longitude: dropoffLocation.lng },
      radius: 100,
      color: 'rgba(16, 185, 129, 0.1)',
      lineColor: '#10b981',
      lineWidth: 2,
    },
  ];

  useEffect(() => {
    if (mapLoaded && onMapReady) {
      onMapReady();
    }
  }, [mapLoaded, onMapReady]);

  const handleMapLoaded = useCallback(() => {
    setMapLoaded(true);
    if (mapRef.current && route.length >= 2) {
      // Fit camera to show entire route
      const lats = route.map(r => r.lat);
      const lngs = route.map(r => r.lng);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      
      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;

      mapRef.current.setCameraPosition({
        coordinates: { latitude: centerLat, longitude: centerLng },
        zoom: 13,
      });
    }
  }, [route]);

  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.container, { height }]}>
        {!mapLoaded && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#132B5E" />
            <Text style={styles.loadingText}>Loading map...</Text>
          </View>
        )}
        <AppleMaps.View
          ref={mapRef}
          style={styles.map}
          markers={markers as any}
          polylines={polylines as any}
          circles={circles as any}
          cameraPosition={
            route.length >= 2 ? undefined : {
              coordinates: { latitude: riderLocation.lat, longitude: riderLocation.lng },
              zoom: 14,
            }
          }
          onMapClick={handleMapLoaded}
          properties={{
            isMyLocationEnabled: true,
            mapType: AppleMaps.MapType.STANDARD,
          }}
          uiSettings={{
            myLocationButtonEnabled: true,
            compassEnabled: true,
            scaleBarEnabled: true,
          }}
        />
      </View>
    );
  } else if (Platform.OS === 'android') {
    return (
      <View style={[styles.container, { height }]}>
        {!mapLoaded && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#132B5E" />
            <Text style={styles.loadingText}>Loading map...</Text>
          </View>
        )}
        <GoogleMaps.View
          ref={mapRef}
          style={styles.map}
          markers={markers as any}
          polylines={polylines as any}
          circles={circles as any}
          cameraPosition={
            route.length >= 2 ? undefined : {
              coordinates: { latitude: riderLocation.lat, longitude: riderLocation.lng },
              zoom: 14,
            }
          }
          onMapLoaded={handleMapLoaded}
          properties={{
            isMyLocationEnabled: true,
            isTrafficEnabled: true,
            mapType: GoogleMaps.MapType.NORMAL,
          }}
          uiSettings={{
            myLocationButtonEnabled: true,
            compassEnabled: true,
            zoomControlsEnabled: false,
            mapToolbarEnabled: false,
          }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.unavailableContainer}>
        <Text style={styles.unavailableText}>Maps are only available on Android and iOS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#132B5E',
    fontWeight: '600',
  },
  unavailableContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  unavailableText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
});

export function useDeviceLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getLocation = useCallback(async () => {
    try {
      const { requestForegroundPermissionsAsync, getCurrentPositionAsync } = await import('expo-location');
      
      const { status } = await requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        setLoading(false);
        return;
      }

      const position = await getCurrentPositionAsync({
        accuracy: 5, // High accuracy
      });

      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to get location');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      await getLocation();
    };
    
    fetchLocation();
  }, [getLocation]);

  return { location, error, loading, refetch: getLocation };
}

export function useWatchLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watching, setWatching] = useState(false);

  const startWatching = useCallback(async () => {
    try {
      const { requestForegroundPermissionsAsync, watchPositionAsync } = await import('expo-location');
      
      const { status } = await requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }

      const subscription = await watchPositionAsync(
        {
          accuracy: 5,
          distanceInterval: 10,
          timeInterval: 5000,
        },
        (newLocation) => {
          setLocation({
            lat: newLocation.coords.latitude,
            lng: newLocation.coords.longitude,
          });
        }
      );

      setWatching(true);
      return subscription;
    } catch (err: any) {
      setError(err.message || 'Failed to start location tracking');
    }
  }, []);

  const stopWatching = useCallback(async (subscription?: any) => {
    if (subscription) {
      subscription.remove();
    }
    setWatching(false);
  }, []);

  return { location, error, watching, startWatching, stopWatching };
}