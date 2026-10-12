import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import styled from 'styled-components/native';

interface IconCircleProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  bgColor?: string;
  color?: string;
  style?: ViewStyle;
}

const sizeMap: Record<IconCircleProps['size'], { width: number; height: number; borderRadius: number }> = {
  sm: { width: 40, height: 40, borderRadius: 10 },
  md: { width: 48, height: 48, borderRadius: 12 },
  lg: { width: 64, height: 64, borderRadius: 16 },
  xl: { width: 90, height: 90, borderRadius: 45 },
};

const StyledIconCircle = styled(View)<{ $size: IconCircleProps['size']; $bgColor?: string }>`
  width: ${({ $size }) => sizeMap[$size || 'md'].width}px;
  height: ${({ $size }) => sizeMap[$size || 'md'].height}px;
  border-radius: ${({ $size }) => sizeMap[$size || 'md'].borderRadius}px;
  background-color: ${({ $bgColor }) => $bgColor || 'rgba(19, 43, 94, 0.08)'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IconCircle: React.FC<IconCircleProps> = ({
  children,
  size = 'md',
  bgColor,
  style,
}) => {
  return (
    <StyledIconCircle $size={size} $bgColor={bgColor} style={[styles.iconCircle, style]}>
      {children}
    </StyledIconCircle>
  );
};

IconCircle.displayName = 'IconCircle';

const styles = StyleSheet.create({
  iconCircle: {
    flexShrink: 0,
  },
});

export default IconCircle;