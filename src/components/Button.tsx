import React from 'react';
import { Pressable, Text, StyleSheet, View, ActivityIndicator, PressableProps } from 'react-native';
import styled from 'styled-components/native';

interface ButtonProps extends Omit<PressableProps, 'children' | 'onPress'> {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'primary-rider' | 'outline' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const StyledButton = styled(Pressable)<{ $variant: ButtonProps['variant']; $size: ButtonProps['size']; $fullWidth: boolean; $disabled: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${({ $size }) => $size === 'sm' ? '8px' : $size === 'lg' ? '16px' : '12px'};
  padding-vertical: ${({ $size }) => $size === 'sm' ? '10px' : $size === 'lg' ? '18px' : '14px'};
  padding-horizontal: ${({ $size }) => $size === 'sm' ? '16px' : $size === 'lg' ? '28px' : '24px'};
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};
  opacity: ${({ $disabled }) => $disabled ? 0.6 : 1};
  background-color: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary': return theme.colors.primaryBlue;
      case 'primary-rider': return theme.colors.primaryRed;
      case 'outline': return 'transparent';
      case 'icon': return theme.colors.border;
      default: return theme.colors.primaryBlue;
    }
  }};
  border-width: ${({ $variant }) => $variant === 'outline' ? '2px' : 0};
  border-color: ${({ $variant, theme }) => $variant === 'outline' ? theme.colors.border : 'transparent'};
  shadow-color: ${({ $variant, theme }) => {
    if ($variant === 'primary') return theme.colors.primaryBlue;
    if ($variant === 'primary-rider') return theme.colors.primaryRed;
    return 'transparent';
  }};
  shadow-offset: 0px 10px;
  shadow-opacity: 0.2;
  shadow-radius: 20px;
  elevation: 5;
`;

const ButtonText = styled(Text)<{ $variant: ButtonProps['variant']; $size: ButtonProps['size']; $disabled: boolean }>`
  font-size: ${({ $size }) => $size === 'sm' ? '0.875rem' : $size === 'lg' ? '1.125rem' : '1rem'};
  font-weight: 700;
  color: ${({ $variant, $disabled, theme }) => {
    if ($disabled) return theme.colors.textLight;
    if ($variant === 'outline') return theme.colors.textDark;
    return '#fff';
  }};
  margin-horizontal: ${({ $leftIcon, $rightIcon }) => ($leftIcon || $rightIcon) ? '8px' : 0};
`;

export const Button = React.forwardRef<Pressable, ButtonProps>(
  (
    {
      title,
      onPress,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      style,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <StyledButton
        ref={ref}
        onPress={onPress}
        disabled={isDisabled}
        $variant={variant}
        $size={size}
        $fullWidth={fullWidth}
        $disabled={isDisabled}
        style={[styles.button, style]}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        {...props}
      >
        {loading ? (
          <ActivityIndicator size="small" color={variant === 'outline' ? '#132B5E' : '#fff'} />
        ) : (
          <>
            {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
            <ButtonText $variant={variant} $size={size} $disabled={isDisabled}>{title}</ButtonText>
            {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
          </>
        )}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Button;