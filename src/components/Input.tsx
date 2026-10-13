import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, View, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
  helperText?: string;
}

const COLORS = {
  textDark: '#1A1A1A',
  textLight: '#999',
  background: '#fff',
  border: '#f0f0f0',
  primaryBlue: '#132B5E',
  primaryRed: '#D91E36',
};

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      icon,
      rightIcon,
      containerStyle,
      inputStyle,
      onChangeText,
      value,
      onFocus,
      onBlur,
      disabled,
      helperText,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false);
    const hasError = !!error;
    const hasLeftIcon = !!icon;

    const handleChangeText = (text: string) => {
      onChangeText?.(text);
    };

    const handleFocus = (e: any) => {
      setFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setFocused(false);
      onBlur?.(e);
    };

    const borderColor = hasError
      ? COLORS.primaryRed
      : focused
      ? COLORS.primaryBlue
      : COLORS.border;

    const backgroundColor = disabled ? COLORS.border : COLORS.background;

    return (
      <View style={[styles.container, containerStyle]} >
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={[
          styles.inputWrapper,
          {
            backgroundColor,
            borderColor,
            borderWidth: 2,
          },
        ]}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <TextInput
            ref={ref}
            value={value}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={!disabled}
            style={[
              styles.input,
              {
                paddingLeft: hasLeftIcon ? 48 : 12,
                paddingRight: rightIcon ? 48 : 12,
              },
              inputStyle,
            ]}
            {...props}
          />
          {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 0,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 12,
    minHeight: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textDark,
    paddingVertical: 12,
  },
  iconContainer: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
    pointerEvents: 'none',
  },
  rightIconContainer: {
    position: 'absolute',
    right: 14,
    zIndex: 1,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.primaryRed,
    marginTop: 6,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 6,
  },
});

export default Input;