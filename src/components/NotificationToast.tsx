import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Pressable } from 'react-native';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react-native';
import { useNotifications } from '@/contexts/NotificationContext';
import { IconCircle } from './IconCircle';

const iconStyles = {
  success: { icon: CheckCircle, color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  error: { icon: AlertCircle, color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
  warning: { icon: XCircle, color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' },
  info: { icon: Info, color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
};

interface ToastItemProps {
  notification: any;
  index: number;
  hideNotification: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ notification, index, hideNotification }) => {
  const { icon: Icon, color, bgColor } = iconStyles[notification.type as keyof typeof iconStyles];
  
  const fadeAnim = useRef(new Animated.Value(0));
  const translateAnim = useRef(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim.current, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim.current, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      hideNotification(notification.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id, hideNotification]);

  // Access .current in render for Animated - required pattern for react-native Animated
  // eslint-disable-next-line react-hooks/refs
  const animatedStyle = {
    // eslint-disable-next-line react-hooks/refs
    opacity: fadeAnim.current,
    // eslint-disable-next-line react-hooks/refs
    transform: [{ translateX: translateAnim.current }],
  };

  // eslint-disable-next-line react-hooks/refs
  return (
    // eslint-disable-next-line react-hooks/refs
    <Animated.View style={[styles.toast, animatedStyle]} pointerEvents="box-none">
      <View style={styles.toastContent} pointerEvents="auto">
        <IconCircle size="md" bgColor={bgColor} style={styles.iconWrapper}>
          <Icon size={20} color={color} />
        </IconCircle>
        <View style={[styles.textContainer, { flex: 1 }]}>
          <Text style={styles.title} numberOfLines={1}>{notification.title}</Text>
          {notification.message && (
            <Text style={styles.message} numberOfLines={2}>{notification.message}</Text>
          )}
          {notification.action && (
            <Pressable
              onPress={notification.action.onClick}
              style={styles.actionButton}
              android_ripple={{ color: color + '33' }}
            >
              <Text style={[styles.actionText, { color }]}>{notification.action.label}</Text>
            </Pressable>
          )}
        </View>
        <Pressable onPress={() => hideNotification(notification.id)} style={styles.closeButton} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <XCircle size={18} color="#999" />
        </Pressable>
      </View>
    </Animated.View>
  );
};

export function NotificationToast() {
  const { notifications, hideNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {notifications.map((notification, index) => (
        <ToastItem
          key={notification.id}
          notification={notification}
          index={index}
          hideNotification={hideNotification}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    right: 16,
    left: 16,
    zIndex: 9999,
    flexDirection: 'column',
    gap: 12,
    pointerEvents: 'box-none',
  },
  toast: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  iconWrapper: {
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
    marginTop: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 18,
  },
  actionButton: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
    flexShrink: 0,
  },
});

export default NotificationToast;