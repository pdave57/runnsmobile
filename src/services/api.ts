import { Order, OrderStatus, Location, User, UserRole, RegisterData } from '../types';
import { mockApi } from './mockApi';
import { storage } from '../utils/storage';

const API_BASE = '/api';

const GEOCODING_API_URL = 'https://nominatim.openstreetmap.org/search';

interface GeocodeResult {
  lat: string;
  lon: string;
  display_name: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

function formatOrderStatus(status?: string): OrderStatus {
  if (!status) return 'pending';
  if (status === 'assigned') return 'rider-assigned';
  if (status === 'picked_up') return 'at-pickup';
  return status as OrderStatus;
}

class ApiService {
  private token: string | null = null;

  async initialize(): Promise<void> {
    this.token = await storage.getToken();
  }

  setToken(token: string | null) {
    this.token = token;
    storage.setToken(token);
  }

  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await storage.getToken();
    }
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      const json: ApiResponse<T> = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || json.message || 'Request failed');
      }

      return json.data !== undefined ? json.data : (json as unknown as T);
    } catch (err: any) {
      console.warn(`[api-service] Network/API call failed for ${endpoint}: ${err.message}`);
      throw err;
    }
  }

  // ==================== GEOCODING SERVICE ====================
  async geocode(address: string): Promise<Location> {
    const defaultLocation = { lat: 6.5244, lng: 3.3792 };
    try {
      const params = new URLSearchParams({
        q: address,
        format: 'json',
        limit: '1',
        addressdetails: '1',
      });

      const response = await fetch(`${GEOCODING_API_URL}?${params.toString()}`, {
        headers: {
          'User-Agent': 'RiderSystem/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`Geocoding request failed: ${response.statusText}`);
      }

      const results: GeocodeResult[] = await response.json();

      if (results && results.length > 0) {
        const result = results[0];
        return {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          address: result.display_name,
        };
      }
    } catch (err: any) {
      console.warn(`[api-service] Geocoding failed for "${address}": ${err.message}. Using default location.`);
    }
    return { lat: defaultLocation.lat, lng: defaultLocation.lng, address: address };
  }

  private async ensureLocation(address: string, lat?: string | number, lng?: string | number): Promise<Location> {
    if (lat && lng) {
      return { lat: Number(lat), lng: Number(lng), address };
    }
    return this.geocode(address);
  }

  // ==================== AUTH SERVICE ====================
  async login(email: string, password: string, role: UserRole): Promise<{ token: string; user: User }> {
    try {
      const res = await this.request<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const user: User = {
        id: String(res.user.id),
        email: res.user.email,
        firstName: res.user.full_name?.split(' ')[0] || res.user.full_name || 'User',
        lastName: res.user.full_name?.split(' ').slice(1).join(' ') || '',
        phone: res.user.phone || '',
        role: res.user.role || role,
        isVerified: true,
        profileComplete: true,
        createdAt: new Date().toISOString(),
      };

      this.setToken(res.token);
      await storage.setUser(user);
      return { token: res.token, user };
    } catch (err: any) {
      throw new Error(err.message || 'Failed to login. Please check your credentials.');
    }
  }

  async register(data: RegisterData): Promise<{ token: string; user: User }> {
    try {
      const payload = {
        full_name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
      };

      const res = await this.request<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const user: User = {
        id: String(res.user.id),
        email: res.user.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
        isVerified: data.role === 'client',
        profileComplete: false,
        createdAt: new Date().toISOString(),
      };

      this.setToken(res.token);
      await storage.setUser(user);
      return { token: res.token, user };
    } catch (err: any) {
      throw new Error(err.message || 'Failed to register. Please try again.');
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  }

  async getMe(): Promise<User> {
    const res = await this.request<{ user_id: number; role: UserRole; email: string; full_name: string; phone: string }>('/auth/me');
    return {
      id: String(res.user_id),
      email: res.email,
      firstName: res.full_name?.split(' ')[0] || res.full_name || 'User',
      lastName: res.full_name?.split(' ').slice(1).join(' ') || '',
      phone: res.phone || '',
      role: res.role,
      isVerified: true,
      profileComplete: true,
      createdAt: new Date().toISOString(),
    };
  }

  // ==================== ORDER SERVICE ====================
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const payload = {
      pickup_address: orderData.pickupLocation?.address || 'Pickup location',
      pickup_latitude: orderData.pickupLocation?.lat || 0,
      pickup_longitude: orderData.pickupLocation?.lng || 0,
      dropoff_address: orderData.dropoffLocation?.address || 'Dropoff location',
      dropoff_latitude: orderData.dropoffLocation?.lat || 0,
      dropoff_longitude: orderData.dropoffLocation?.lng || 0,
      package_desc: orderData.items?.map(i => i.name).join(', ') || 'Package',
      weight_kg: 1.0,
      notes: orderData.notes || '',
    };

    if (orderData.pickupLocation?.address && !orderData.pickupLocation?.lat) {
      const geocodedPickup = await this.geocode(orderData.pickupLocation.address);
      payload.pickup_latitude = geocodedPickup.lat;
      payload.pickup_longitude = geocodedPickup.lng;
    }

    if (orderData.dropoffLocation?.address && !orderData.dropoffLocation?.lat) {
      const geocodedDropoff = await this.geocode(orderData.dropoffLocation.address);
      payload.dropoff_latitude = geocodedDropoff.lat;
      payload.dropoff_longitude = geocodedDropoff.lng;
    }

    const res = await this.request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return {
      id: String(res.id || res.tracking_code || `ORD-${Date.now()}`),
      clientId: String(res.client_id || orderData.clientId || '1'),
      type: orderData.type || 'dispatch',
      status: formatOrderStatus(res.status),
      pickupLocation: orderData.pickupLocation!,
      dropoffLocation: orderData.dropoffLocation!,
      items: orderData.items || [],
      distance: orderData.distance || 2.5,
      estimatedTime: orderData.estimatedTime || 15,
      price: res.delivery_fee || orderData.price || 15.0,
      paymentStatus: 'pending',
      paymentMethod: orderData.paymentMethod || 'cash',
      notes: orderData.notes,
      createdAt: new Date().toISOString(),
    };
  }

  async getOrders(role: 'client' | 'rider', userId: string): Promise<Order[]> {
    const res = await this.request<any[]>('/orders');
    if (!Array.isArray(res)) {
      throw new Error('Invalid response format: expected array of orders');
    }
    const ordersWithGeocode = await Promise.all(res.map(async (o: any): Promise<Order> => ({
      id: String(o.id || o.tracking_code),
      clientId: String(o.client_id),
      riderId: o.rider_id ? String(o.rider_id) : undefined,
      type: (o.type as 'dispatch' | 'shop-for-me') || 'dispatch',
      status: formatOrderStatus(o.status),
      pickupLocation: o.pickup_latitude && o.pickup_longitude
        ? { lat: parseFloat(o.pickup_latitude), lng: parseFloat(o.pickup_longitude), address: o.pickup_address }
        : await this.geocode(o.pickup_address || ''),
      dropoffLocation: o.dropoff_latitude && o.dropoff_longitude
        ? { lat: parseFloat(o.dropoff_latitude), lng: parseFloat(o.dropoff_longitude), address: o.dropoff_address }
        : await this.geocode(o.dropoff_address || ''),
      items: [{ id: '1', name: o.package_desc || 'Package', quantity: 1, price: o.delivery_fee || 0 }],
      distance: o.distance || 2.5,
      estimatedTime: 15,
      price: o.delivery_fee || 0,
      paymentStatus: 'paid',
      paymentMethod: 'card',
      notes: o.notes,
      createdAt: o.created_at || new Date().toISOString(),
    })));
    return ordersWithGeocode;
  }

  async getOrderById(id: string): Promise<Order> {
    try {
      const res = await this.request<any>(`/orders/${id}`);
      const pickupLocation = await this.ensureLocation(
        res.pickup_address,
        res.pickup_latitude,
        res.pickup_longitude
      );
      const dropoffLocation = await this.ensureLocation(
        res.dropoff_address,
        res.dropoff_latitude,
        res.dropoff_longitude
      );
      return {
        id: String(res.id),
        clientId: String(res.client_id),
        riderId: res.rider_id ? String(res.rider_id) : undefined,
        type: res.type || 'dispatch',
        status: formatOrderStatus(res.status),
        pickupLocation,
        dropoffLocation,
        items: res.items || [],
        distance: res.distance || 2.5,
        estimatedTime: res.estimatedTime || 15,
        price: res.delivery_fee || 0,
        paymentStatus: res.paymentStatus || 'pending',
        paymentMethod: res.paymentMethod || 'cash',
        notes: res.notes || '',
        createdAt: res.created_at || new Date().toISOString(),
      };
    } catch (err: any) {
      throw new Error(err.message || 'Failed to get order');
    }
  }

  async getOrderByTrackingCode(trackingCode: string): Promise<Order> {
    try {
      const res = await this.request<any>(`/orders/track/${trackingCode}`);
      const pickupLocation = await this.ensureLocation(
        res.pickup_address,
        res.pickup_latitude,
        res.pickup_longitude
      );
      const dropoffLocation = await this.ensureLocation(
        res.dropoff_address,
        res.dropoff_latitude,
        res.dropoff_longitude
      );
      return {
        id: String(res.id),
        clientId: String(res.client_id),
        riderId: res.rider_id ? String(res.rider_id) : undefined,
        type: res.type || 'dispatch',
        status: formatOrderStatus(res.status),
        pickupLocation,
        dropoffLocation,
        items: res.items || [],
        distance: res.distance || 2.5,
        estimatedTime: res.estimatedTime || 15,
        price: res.delivery_fee || 0,
        paymentStatus: res.paymentStatus || 'pending',
        paymentMethod: res.paymentMethod || 'cash',
        notes: res.notes || '',
        createdAt: res.created_at || new Date().toISOString(),
      };
    } catch (err: any) {
      throw new Error(err.message || 'Failed to get order by tracking code');
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    try {
      const res = await this.request<any>(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      const pickupLocation = await this.ensureLocation(
        res.pickup_address,
        res.pickup_latitude,
        res.pickup_longitude
      );
      const dropoffLocation = await this.ensureLocation(
        res.dropoff_address,
        res.dropoff_latitude,
        res.dropoff_longitude
      );
      return {
        id: String(res.id),
        clientId: String(res.client_id),
        riderId: res.rider_id ? String(res.rider_id) : undefined,
        type: res.type || 'dispatch',
        status: res.status,
        pickupLocation,
        dropoffLocation,
        items: [],
        distance: res.distance || 2.5,
        estimatedTime: 15,
        price: res.delivery_fee || 0,
        paymentStatus: 'paid',
        paymentMethod: 'card',
        createdAt: new Date().toISOString(),
      };
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update order status');
    }
  }

  async cancelOrder(orderId: string): Promise<void> {
    try {
      await this.request(`/orders/${orderId}`, {
        method: 'DELETE',
      });
    } catch (err: any) {
      throw new Error(err.message || 'Failed to cancel order');
    }
  }

  // ==================== DISPATCH SERVICE ====================
  async createDispatch(orderId: string, riderId?: string): Promise<{ id: string }> {
    try {
      const payload: any = { order_id: orderId };
      if (riderId) payload.rider_id = riderId;
      const res = await this.request<{ id: string }>('/dispatch', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return res;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create dispatch');
    }
  }

  async respondToDispatch(dispatchId: string, action: 'accept' | 'reject'): Promise<void> {
    try {
      await this.request(`/dispatch/${dispatchId}/respond`, {
        method: 'POST',
        body: JSON.stringify({ action }),
      });
    } catch (err: any) {
      throw new Error(err.message || 'Failed to respond to dispatch');
    }
  }

  async getDispatchByOrderId(orderId: string): Promise<{ id: string; order_id: string; rider_id: string; status: string }> {
    try {
      const res = await this.request<any>(`/dispatch/order/${orderId}`);
      return {
        id: String(res.id),
        order_id: String(res.order_id),
        rider_id: String(res.rider_id),
        status: res.rider_id ? 'accepted' : 'pending',
      };
    } catch (err: any) {
      throw new Error(err.message || 'Failed to get dispatch by order ID');
    }
  }

  async getPendingDispatches(riderId: string): Promise<Array<{ id: string; order_id: string; }>> {
    try {
      const res = await this.request<any[]>('/dispatch/pending');
      return res.map(d => ({
        id: String(d.id),
        order_id: String(d.order_id),
      }));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to get pending dispatches');
    }
  }

  // ==================== PAYMENT SERVICE ====================
  async initiatePayment(orderId: string, amount: number, method: string): Promise<{ id: string; client_secret?: string }> {
    const payload = {
      order_id: orderId,
      amount,
      method,
    };
    const res = await this.request<{ id: string; client_secret?: string }>('/payments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res;
  }

  async verifyPayment(paymentId: string): Promise<void> {
    await this.request('/payments/verify', {
      method: 'POST',
      body: JSON.stringify({ payment_id: paymentId }),
    });
  }

  async getPaymentByOrderId(orderId: string): Promise<{ id: string; amount: number; status: string }> {
    const res = await this.request<any>(`/payments/order/${orderId}`);
    return {
      id: String(res.id),
      amount: res.amount,
      status: res.status,
    };
  }

  async getWalletBalance(): Promise<{ balance: number }> {
    const res = await this.request<any>('/payments/wallet');
    return { balance: res.balance || 0 };
  }

  async topUpWallet(amount: number): Promise<{ balance: number }> {
    const res = await this.request<{ balance: number }>('/payments/wallet/topup', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    return res;
  }

  // ==================== REALTIME SERVICE ====================
  async getRiderLocation(riderId: string): Promise<Location> {
    let res;
    try {
      res = await this.request<{ latitude: number; longitude: number }>(`/realtime/location/${riderId}`);
    } catch {
      res = { latitude: 0, longitude: 0 };
    }
    return { lat: res.latitude, lng: res.longitude };
  }

  // ==================== RIDER SERVICE ====================
  async getRiderProfile(): Promise<{ id: string; vehicle_type: string; vehicle_plate: string; license_number: string; is_available: boolean; rating: number; total_deliveries: number }> {
    const res = await this.request<any>('/riders/me');
    return {
      id: String(res.id),
      vehicle_type: res.vehicle_type || '',
      vehicle_plate: res.vehicle_plate || '',
      license_number: res.license_number || '',
      is_available: res.is_available ?? false,
      rating: res.rating || 0,
      total_deliveries: res.total_deliveries || 0,
    };
  }

  async updateRiderAvailability(available: boolean): Promise<void> {
    await this.request('/riders/me/availability', {
      method: 'PATCH',
      body: JSON.stringify({ available }),
    });
  }

  async updateRiderLocation(location: Location): Promise<void> {
    await this.request('/riders/me/location', {
      method: 'PATCH',
      body: JSON.stringify({ latitude: location.lat, longitude: location.lng }),
    });
  }

  async getNearbyRiders(location: Location, radiusKm: number = 1): Promise<Array<{ id: string; latitude: number; longitude: number; }>> {
    const res = await this.request<any[]>('/riders/nearby');
    return res.map(r => ({
      id: String(r.id),
      latitude: r.latitude,
      longitude: r.longitude,
    }));
  }

  // ==================== SHOPFORME SERVICE ====================
  async createShopForMeRequest(requestData: {
    items: Array<{ name: string; quantity: number; }>;
    delivery_address: string;
    special_instructions?: string;
  }): Promise<{ id: string }> {
    const res = await this.request<{ id: string }>('/shopforme', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
    return res;
  }

  async getMyShopForMeRequests(role: 'client' | 'rider'): Promise<Array<{ id: string; status: string }>> {
    const res = await this.request<any[]>('/shopforme/my', { method: 'POST' });
    return res.map(r => ({
      id: String(r.id),
      status: r.status || 'pending',
    }));
  }

  async acceptShopForMeRequest(requestId: string): Promise<void> {
    await this.request(`/shopforme/${requestId}/accept`, {
      method: 'POST',
    });
  }

  async createShopForMeOrder(requestId: string, items: Array<{ name: string; quantity: number; price: number }>): Promise<{ id: string }> {
    const res = await this.request<{ id: string }>(`/shopforme/${requestId}/order`, {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
    return res;
  }

  async verifyShopForMeItems(requestId: string, verified: boolean): Promise<void> {
    await this.request(`/shopforme/${requestId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ verified }),
    });
  }

  async payShopForMeRequest(requestId: string, amount: number): Promise<{ payment_id: string }> {
    const res = await this.request<{ payment_id: string }>(`/shopforme/${requestId}/pay`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    return res;
  }

  async dispatchShopForMeRequest(requestId: string, riderId: string): Promise<{ dispatch_id: string }> {
    const res = await this.request<{ dispatch_id: string }>(`/shopforme/${requestId}/dispatch`, {
      method: 'POST',
      body: JSON.stringify({ rider_id: riderId }),
    });
    return res;
  }

  async deliverShopForMeRequest(requestId: string): Promise<void> {
    await this.request(`/shopforme/${requestId}/deliver`, {
      method: 'POST',
    });
  }

  async cancelShopForMeRequest(requestId: string): Promise<void> {
    await this.request(`/shopforme/${requestId}/cancel`, {
      method: 'POST',
    });
  }

  async getShopForMeRequestById(requestId: string): Promise<{
    id: string;
    status: string;
    items: Array<{ name: string; quantity: number; verified: boolean }>;
    total_amount: number;
  }> {
    const res = await this.request<any>(`/shopforme/${requestId}`);
    return {
      id: String(res.id),
      status: res.status || 'pending',
      items: res.items || [],
      total_amount: res.total_amount || 0,
    };
  }

  // ==================== UPLOAD SERVICE ====================
  async uploadAvatar(file: any): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const token = await this.getToken();
    const response = await fetch(`${API_BASE}/upload/avatar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.error || 'Upload failed');
    }

    return { url: json.data?.secure_url || json.data?.thumbnail || '' };
  }

  // ==================== TRACKING ====================
  async getTrackingData(orderId: string) {
    try {
      const order = await this.getOrderById(orderId);
      if (!order) {
        return mockApi.getTrackingData(orderId);
      }

      let riderLocation = order.pickupLocation;
      if (order.riderId) {
        try {
          const loc = await this.getRiderLocation(order.riderId);
          if (loc && loc.lat && loc.lng) {
            riderLocation = loc;
          }
        } catch {
          // Use pickup location if rider location fails
        }
      }

      return {
        orderId,
        riderLocation: riderLocation || order.pickupLocation,
        estimatedArrival: order.estimatedTime || 15,
        status: order.status,
        route: [order.pickupLocation, order.dropoffLocation].filter(Boolean),
      };
    } catch {
      return mockApi.getTrackingData(orderId);
    }
  }

  // ==================== DISTANCE CALCULATION ====================
  async calculateDistance(userLocation: Location, orderId: string): Promise<number> {
    try {
      const res = await this.request<{ distance: number }>('/orders/calculate-distance', {
        method: 'POST',
        body: JSON.stringify({
          order_id: orderId,
          user_latitude: userLocation.lat,
          user_longitude: userLocation.lng,
        }),
      });
      return res.distance || 0;
    } catch {
      // Fallback to client-side calculation
      const order = await this.getOrderById(orderId);
      if (!order) return 0;
      
      const R = 6371;
      const toRad = (deg: number) => deg * (Math.PI / 180);
      const dLat = toRad(order.pickupLocation.lat - userLocation.lat);
      const dLon = toRad(order.pickupLocation.lng - userLocation.lng);
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(userLocation.lat)) * Math.cos(toRad(order.pickupLocation.lat)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }
  }
}

export const api = new ApiService();