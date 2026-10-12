import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { useNotifications } from '@/contexts/NotificationContext';

export function OrderAssignmentListener() {
  const { user } = useAuth();
  const { showNotification, showSuccess } = useNotifications();
  const { orders } = useOrders(user?.id || null, user?.role || 'client');

  useEffect(() => {
    if (!user || user.role !== 'client') return;

    const activeOrders = orders.filter(o => 
      ['searching-rider', 'rider-assigned'].includes(o.status)
    );

    activeOrders.forEach(order => {
      if (order.status === 'rider-assigned' && order.riderId) {
        showSuccess(
          'Rider Assigned!',
          `A rider has been assigned to your order ${order.id}`,
          {
            label: 'Track',
            onClick: () => {
              // Navigation would be handled by the screen
            }
          }
        );
      }
    });
  }, [orders, user, showSuccess]);

  return null;
}

export default OrderAssignmentListener;