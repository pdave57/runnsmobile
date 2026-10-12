import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import styled from 'styled-components/native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevation?: number;
}

const StyledCard = styled(View)<{ $padding: CardProps['padding']; $elevation: number }>`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.xl};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: ${({ $padding, theme }) => {
    switch ($padding) {
      case 'none': return 0;
      case 'sm': return theme.space[3];
      case 'md': return theme.space[6];
      case 'lg': return theme.space[8];
      default: return theme.space[6];
    }
  }};
  shadow-color: ${({ theme }) => theme.colors.primaryBlue};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.05;
  shadow-radius: 12px;
  elevation: ${({ $elevation }) => $elevation};
`;

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'md',
  elevation = 2,
}) => {
  return (
    <StyledCard $padding={padding} $elevation={elevation} style={[styles.card, style]}>
      {children}
    </StyledCard>
  );
};

Card.displayName = 'Card';

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  style?: ViewStyle;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  style,
}) => {
  return (
    <View style={[styles.cardHeader, style]}>
      <View style={styles.cardHeaderContent}>
        <Text style={styles.cardHeaderTitle}>{title}</Text>
        {subtitle && <Text style={styles.cardHeaderSubtitle}>{subtitle}</Text>}
      </View>
      {action && <View style={styles.cardHeaderAction}>{action}</View>}
    </View>
  );
};

import { Text } from 'react-native';

interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  style,
  fullWidth = false,
}) => {
  return (
    <View style={[styles.cardFooter, fullWidth && styles.cardFooterFullWidth, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  cardHeaderContent: {
    flex: 1,
  },
  cardHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#132B5E',
  },
  cardHeaderSubtitle: {
    fontSize: 14,
    color: '#555555',
    marginTop: 4,
  },
  cardHeaderAction: {
    flexShrink: 0,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cardFooterFullWidth: {
    flexDirection: 'column-reverse',
  },
});

export default Card;