import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import styled from 'styled-components/native';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary' | 'rider';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const badgeColors: Record<BadgeProps['variant'], { bg: string; text: string }> = {
  default: { bg: '#f0f0f0', text: '#555555' },
  success: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' },
  warning: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' },
  error: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' },
  info: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' },
  primary: { bg: 'rgba(19, 43, 94, 0.1)', text: '#132B5E' },
  rider: { bg: 'rgba(217, 30, 54, 0.1)', text: '#D91E36' },
};

const badgeSizes: Record<BadgeProps['size'], { px: number; py: number; fontSize: number; borderRadius: number }> = {
  sm: { px: 8, py: 4, fontSize: 11, borderRadius: 12 },
  md: { px: 12, py: 6, fontSize: 12, borderRadius: 16 },
  lg: { px: 16, py: 8, fontSize: 13, borderRadius: 20 },
};

const StyledBadge = styled(View)<{ $variant: BadgeProps['variant']; $size: BadgeProps['size'] }>`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${({ $size }) => badgeSizes[$size || 'md'].px}px;
  padding-vertical: ${({ $size }) => badgeSizes[$size || 'md'].py}px;
  border-radius: ${({ $size }) => badgeSizes[$size || 'md'].borderRadius}px;
  background-color: ${({ $variant, theme }) => badgeColors[$variant || 'default'].bg};
`;

const BadgeText = styled(Text)<{ $variant: BadgeProps['variant']; $size: BadgeProps['size'] }>`
  font-size: ${({ $size }) => badgeSizes[$size || 'md'].fontSize}px;
  font-weight: 600;
  color: ${({ $variant, theme }) => badgeColors[$variant || 'default'].text};
`;

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}) => {
  return (
    <StyledBadge $variant={variant} $size={size} style={[styles.badge, style]}>
      <BadgeText $variant={variant} $size={size} style={textStyle}>
        {children}
      </BadgeText>
    </StyledBadge>
  );
};

Badge.displayName = 'Badge';

const styles = StyleSheet.create({
  badge: {
    minWidth: 40,
  },
});

export const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    pending: { label: 'Pending', variant: 'warning' },
    'searching-rider': { label: 'Finding Rider', variant: 'info' },
    'rider-assigned': { label: 'Rider Assigned', variant: 'primary' },
    'rider-en-route-pickup': { label: 'En Route to Pickup', variant: 'warning' },
    'at-pickup': { label: 'At Pickup', variant: 'info' },
    'rider-en-route-dropoff': { label: 'En Route to Dropoff', variant: 'primary' },
    delivered: { label: 'Delivered', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'error' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return <Badge variant={config.variant} size="md">{config.label}</Badge>;
};

export default Badge;