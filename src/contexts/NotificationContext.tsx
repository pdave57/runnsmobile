import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Notification } from '../types';

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  hideNotification: (id: string) => void;
  showSuccess: (title: string, message?: string, action?: Notification['action']) => void;
  showError: (title: string, message?: string, action?: Notification['action']) => void;
  showWarning: (title: string, message?: string, action?: Notification['action']) => void;
  showInfo: (title: string, message?: string, action?: Notification['action']) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      hideNotification(id);
    }, 5000);
  }, [hideNotification]);

  const showSuccess = useCallback((title: string, message?: string, action?: Notification['action']) => {
    showNotification({ type: 'success', title, message, action });
  }, [showNotification]);

  const showError = useCallback((title: string, message?: string, action?: Notification['action']) => {
    showNotification({ type: 'error', title, message, action });
  }, [showNotification]);

  const showWarning = useCallback((title: string, message?: string, action?: Notification['action']) => {
    showNotification({ type: 'warning', title, message, action });
  }, [showNotification]);

  const showInfo = useCallback((title: string, message?: string, action?: Notification['action']) => {
    showNotification({ type: 'info', title, message, action });
  }, [showNotification]);

  const value: NotificationContextType = {
    notifications,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}