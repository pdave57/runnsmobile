import { Order, OrderStatus, Location, User, UserRole, RegisterData } from '../types';

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    clientId: '1',
    riderId: 'R-101',
    type: 'dispatch',
    status: 'rider-en-route-pickup',
    pickupLocation: { lat: 6.5244, lng: 3.3792, address: 'Victoria Island, Lagos' },
    dropoffLocation: { lat: 6.5650, lng: 3.3242, address: 'Ikoyi, Lagos' },
    items: [{ id: '1', name: 'Documents', quantity: 1, price: 2000 }],
    distance: 5.2,
    estimatedTime: 15,
    price: 2000,
    paymentStatus: 'paid',
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    acceptedAt: new Date(Date.now() - 3000000).toISOString(),
  },
  {
    id: 'ORD-002',
    clientId: '1',
    type: 'shop-for-me',
    status: 'pending',
    pickupLocation: { lat: 6.5244, lng: 3.3792, address: 'Supermarket, Victoria Island' },
    dropoffLocation: { lat: 6.5650, lng: 3.3242, address: 'Ikoyi, Lagos' },
    items: [
      { id: '1', name: 'Bread', quantity: 2, price: 500 },
      { id: '2', name: 'Milk', quantity: 1, price: 1200 },
      { id: '3', name: 'Eggs', quantity: 1, price: 2000 },
    ],
    distance: 3.1,
    estimatedTime: 25,
    price: 5000,
    paymentStatus: 'pending',
    paymentMethod: 'cash',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'ORD-003',
    clientId: '1',
    riderId: 'R-102',
    type: 'dispatch',
    status: 'delivered',
    pickupLocation: { lat: 6.5244, lng: 3.3792, address: 'Lekki Phase 1, Lagos' },
    dropoffLocation: { lat: 6.5650, lng: 3.3242, address: 'Victoria Island, Lagos' },
    items: [{ id: '1', name: 'Package', quantity: 1, price: 1500 }],
    distance: 8.5,
    estimatedTime: 20,
    price: 1500,
    paymentStatus: 'paid',
    paymentMethod: 'wallet',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    acceptedAt: new Date(Date.now() - 82800000).toISOString(),
    pickedUpAt: new Date(Date.now() - 79200000).toISOString(),
    deliveredAt: new Date(Date.now() - 72000000).toISOString(),
  },
];

const mockRiderProfile = {
  id: 'R-101',
  vehicle_type: 'Motorcycle',
  vehicle_plate: 'LAG-123-AB',
  license_number: 'DL-12345678',
  is_available: true,
  rating: 4.8,
  total_deliveries: 247,
};

const mockUser: User = {
  id: '1',
  email: 'client@test.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+2348012345678',
  role: 'client',
  isVerified: true,
  profileComplete: true,
  createdAt: new Date().toISOString(),
  address: 'Victoria Island, Lagos',
  preferences: {
    notifications: true,
    smsAlerts: true,
    emailAlerts: false,
  },
};

export const mockApi = {
  async login(email: string, password: string, role: UserRole): Promise<{ token: string; user: User }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'test@test.com' && password === 'password') {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          ...mockUser,
          role,
          firstName: role === 'rider' ? 'Mike' : 'John',
        },
      };
    }
    throw new Error('Invalid credentials');
  },

  async register(data: RegisterData): Promise<{ token: string; user: User }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: String(Date.now()),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
        isVerified: data.role === 'client',
        profileComplete: false,
        createdAt: new Date().toISOString(),
      },
    };
  },

  async getMe(): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUser;
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      clientId: orderData.clientId || '1',
      type: orderData.type || 'dispatch',
      status: 'pending',
      pickupLocation: orderData.pickupLocation!,
      dropoffLocation: orderData.dropoffLocation!,
      items: orderData.items || [],
      distance: orderData.distance || 2.5,
      estimatedTime: orderData.estimatedTime || 15,
      price: orderData.price || 1500,
      paymentStatus: 'pending',
      paymentMethod: orderData.paymentMethod || 'cash',
      notes: orderData.notes,
      createdAt: new Date().toISOString(),
    };
    return newOrder;
  },

  async getOrders(role: 'client' | 'rider', userId: string): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockOrders;
  },

  async getOrderById(id: string): Promise<Order> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const order = mockOrders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    return order;
  },

  async getOrderByTrackingCode(trackingCode: string): Promise<Order> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const order = mockOrders.find(o => o.id === trackingCode);
    if (!order) throw new Error('Order not found');
    return order;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');
    return { ...order, status };
  },

  async cancelOrder(orderId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  async createDispatch(orderId: string, riderId?: string): Promise<{ id: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: `DISP-${Date.now()}` };
  },

  async respondToDispatch(dispatchId: string, action: 'accept' | 'reject'): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  async getDispatchByOrderId(orderId: string): Promise<{ id: string; order_id: string; rider_id: string; status: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: 'DISP-001', order_id: orderId, rider_id: 'R-101', status: 'pending' };
  },

  async getPendingDispatches(riderId: string): Promise<Array<{ id: string; order_id: string }>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [{ id: 'DISP-001', order_id: 'ORD-002' }];
  },

  async initiatePayment(orderId: string, amount: number, method: string): Promise<{ id: string; client_secret?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: `PAY-${Date.now()}`, client_secret: 'mock-client-secret' };
  },

  async verifyPayment(paymentId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  async getPaymentByOrderId(orderId: string): Promise<{ id: string; amount: number; status: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: 'PAY-001', amount: 2000, status: 'completed' };
  },

  async getWalletBalance(): Promise<{ balance: number }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { balance: 15000 };
  },

  async topUpWallet(amount: number): Promise<{ balance: number }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { balance: 15000 + amount };
  },

  async getRiderLocation(riderId: string): Promise<Location> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { lat: 6.5300, lng: 3.3800 };
  },

  async getRiderProfile(): Promise<{ id: string; vehicle_type: string; vehicle_plate: string; license_number: string; is_available: boolean; rating: number; total_deliveries: number }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockRiderProfile;
  },

  async updateRiderAvailability(available: boolean): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockRiderProfile.is_available = available;
  },

  async updateRiderLocation(location: Location): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
  },

  async getNearbyRiders(location: Location, radiusKm: number = 1): Promise<Array<{ id: string; latitude: number; longitude: number }>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 'R-101', latitude: 6.5300, longitude: 3.3800 },
      { id: 'R-102', latitude: 6.5250, longitude: 3.3750 },
    ];
  },

  async createShopForMeRequest(requestData: { items: Array<{ name: string; quantity: number }>; delivery_address: string; special_instructions?: string }): Promise<{ id: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id: `SFM-${Date.now()}` };
  },

  async getMyShopForMeRequests(role: 'client' | 'rider'): Promise<Array<{ id: string; status: string }>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [{ id: 'SFM-001', status: 'pending' }];
  },

  async acceptShopForMeRequest(requestId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  async createShopForMeOrder(requestId: string, items: Array<{ name: string; quantity: number; price: number }>): Promise<{ id: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: `ORD-${Date.now()}` };
  },

  async verifyShopForMeItems(requestId: string, verified: boolean): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  async payShopForMeRequest(requestId: string, amount: number): Promise<{ payment_id: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { payment_id: `PAY-${Date.now()}` };
  },

  async dispatchShopForMeRequest(requestId: string, riderId: string): Promise<{ dispatch_id: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { dispatch_id: `DISP-${Date.now()}` };
  },

  async deliverShopForMeRequest(requestId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  async cancelShopForMeRequest(requestId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  async getShopForMeRequestById(requestId: string): Promise<{ id: string; status: string; items: Array<{ name: string; quantity: number; verified: boolean }>; total_amount: number }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: requestId,
      status: 'pending',
      items: [
        { name: 'Bread', quantity: 2, verified: false },
        { name: 'Milk', quantity: 1, verified: false },
      ],
      total_amount: 3000,
    };
  },

  async uploadAvatar(file: any): Promise<{ url: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { url: 'https://example.com/avatar.jpg' };
  },

  async getTrackingData(orderId: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) {
      return {
        orderId,
        riderLocation: { lat: 6.5244, lng: 3.3792 },
        estimatedArrival: 15,
        status: 'pending' as OrderStatus,
        route: [],
      };
    }
    return {
      orderId,
      riderLocation: order.riderId ? { lat: 6.5300, lng: 3.3800 } : order.pickupLocation,
      estimatedArrival: order.estimatedTime,
      status: order.status,
      route: [order.pickupLocation, order.dropoffLocation],
    };
  },
};