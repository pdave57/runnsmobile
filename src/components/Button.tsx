import React from 'react';
import { Pressable, Text, StyleSheet, View, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: (event?: any) => void;
  variant?: 'primary' | 'primary-rider' | 'outline' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
}

const COLORS = {
  primaryBlue: '#132B5E',
  primaryRed: '#D91E36',
  textDark: '#1A1A1A',
  textLight: '#999',
  border: '#f0f0f0',
  white: '#fff',
};

const getBackgroundColor = (variant: ButtonProps['variant'], disabled: boolean) => {
  if (disabled) return COLORS.border;
  switch (variant) {
    case 'primary': return COLORS.primaryBlue;
    case 'primary-rider': return COLORS.primaryRed;
    case 'outline': return 'transparent';
    case 'icon': return COLORS.border;
    default: return COLORS.primaryBlue;
  }
};

const getTextColor = (variant: ButtonProps['variant'], disabled: boolean) => {
  if (disabled) return COLORS.textLight;
  if (variant === 'outline') return COLORS.textDark;
  return COLORS.white;
};

const getBorderColor = (variant: ButtonProps['variant']) => {
  if (variant === 'outline') return COLORS.border;
  return 'transparent';
};

const getBorderWidth = (variant: ButtonProps['variant']) => {
  return variant === 'outline' ? 2 : 0;
};

const getShadowColor = (variant: ButtonProps['variant']) => {
  if (variant === 'primary') return COLORS.primaryBlue;
  if (variant === 'primary-rider') return COLORS.primaryRed;
  return 'transparent';
};

const getPaddingVertical = (size: ButtonProps['size']) => {
  switch (size) {
    case 'sm': return 10;
    case 'lg': return 18;
    default: return 14;
  }
};

const getPaddingHorizontal = (size: ButtonProps['size']) => {
  switch (size) {
    case 'sm': return 16;
    case 'lg': return 28;
    default: return 24;
  }
};

const getBorderRadius = (size: ButtonProps['size']) => {
  switch (size) {
    case 'sm': return 8;
    case 'lg': return 16;
    default: return 12;
  }
};

const getFontSize = (size: ButtonProps['size']) => {
  switch (size) {
    case 'sm': return 14;
    case 'lg': return 18;
    default: return 16;
  }
};

export const Button = React.forwardRef<View, ButtonProps>(
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
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        disabled={isDisabled}
        style={[
          styles.button,
          {
            backgroundColor: getBackgroundColor(variant, isDisabled),
            borderColor: getBorderColor(variant),
            borderWidth: getBorderWidth(variant),
            borderRadius: getBorderRadius(size),
            paddingVertical: getPaddingVertical(size),
            paddingHorizontal: getPaddingHorizontal(size),
            width: fullWidth ? '100%' : 'auto',
            opacity: isDisabled ? 0.6 : 1,
            shadowColor: getShadowColor(variant),
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 5,
          },
          style,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={variant === 'outline' ? COLORS.primaryBlue : COLORS.white} />
        ) : (
          <>
            {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
            <Text
              style={[
                styles.text,
                {
                  fontSize: getFontSize(size),
                  color: getTextColor(variant, isDisabled),
                  marginHorizontal: (leftIcon || rightIcon) ? 8 : 0,
                },
              ]}
            >
              {title}
            </Text>
            {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
          </>
        )}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    fontWeight: '700',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Button;