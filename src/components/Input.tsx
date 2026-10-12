import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, View, StyleSheet, Text } from 'react-native';
import styled from 'styled-components/native';

interface InputProps extends Omit<TextInputProps, 'onChangeText' | 'value' | 'onFocus' | 'onBlur'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

import { ViewStyle, TextStyle } from 'react-native';

const InputContainer = styled(View)<{ $hasError: boolean; $focused: boolean }>`
  width: 100%;
  margin-bottom: ${({ $hasError }) => $hasError ? '4px' : '0px'};
`;

const Label = styled(Text)`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
  margin-bottom: 8px;
`;

const InputWrapper = styled(View)<{ $hasError: boolean; $focused: boolean; $disabled: boolean }>`
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-width: 2px;
  border-radius: 10px;
  background-color: ${({ $disabled, theme }) => $disabled ? theme.colors.border : theme.colors.background};
  border-color: ${({ $hasError, $focused, theme }) => 
    $hasError ? theme.colors.primaryRed : 
    $focused ? theme.colors.primaryBlue : 
    theme.colors.border
  };
  padding-horizontal: 12px;
  min-height: 52px;
  box-shadow: ${({ $focused, theme }) => 
    $focused && !theme.colors.border.includes('primary') ? `0 0 0 3px ${theme.colors.primaryBlue}33` : 'none'
  };
`;

const StyledTextInput = styled(TextInput)`
  flex: 1;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textDark};
  padding-vertical: 12px;
  padding-horizontal: ${({ $hasLeftIcon }) => $hasLeftIcon ? '0px' : '12px'};
`;

const IconContainer = styled(View)`
  position: absolute;
  left: 14px;
  z-index: 1;
  pointer-events: none;
`;

const RightIconContainer = styled(View)`
  position: absolute;
  right: 14px;
  z-index: 1;
`;

const ErrorText = styled(Text)`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.primaryRed};
  margin-top: 6px;
`;

const HelperText = styled(Text)`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 6px;
`;

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

    return (
      <InputContainer style={containerStyle} $hasError={hasError} $focused={focused}>
        {label && <Label>{label}</Label>}
        <InputWrapper $hasError={hasError} $focused={focused} $disabled={!!disabled}>
          {icon && <IconContainer>{icon}</IconContainer>}
          <StyledTextInput
            ref={ref}
            value={value}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            style={[
              styles.input,
              { paddingLeft: hasLeftIcon ? 48 : 12, paddingRight: rightIcon ? 48 : 12 },
              inputStyle,
            ]}
            $hasLeftIcon={hasLeftIcon}
            {...props}
          />
          {rightIcon && <RightIconContainer>{rightIcon}</RightIconContainer>}
        </InputWrapper>
        {error && <ErrorText>{error}</ErrorText>}
        {props.placeholderTextColor && !error && <HelperText>{props.placeholderTextColor}</HelperText>}
      </InputContainer>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  input: {
    flex: 1,
  },
});

export default Input;