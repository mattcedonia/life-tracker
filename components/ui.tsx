import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';

import { theme } from '@/lib/theme';

type CardProps = { children: React.ReactNode; style?: ViewStyle };
export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

type TypographyProps = { children: React.ReactNode; style?: TextStyle };
export function H1({ children, style }: TypographyProps) {
  return <Text style={[styles.h1, style]}>{children}</Text>;
}
export function H2({ children, style }: TypographyProps) {
  return <Text style={[styles.h2, style]}>{children}</Text>;
}
export function Muted({ children, style }: TypographyProps) {
  return <Text style={[styles.muted, style]}>{children}</Text>;
}
export function SectionLabel({ children, style }: TypographyProps) {
  return <Text style={[styles.sectionLabel, style]}>{children}</Text>;
}

type IconTileProps = { children: React.ReactNode; style?: ViewStyle };
export function IconTile({ children, style }: IconTileProps) {
  return <View style={[styles.iconTile, style]}>{children}</View>;
}

type PillProps = { label: string; style?: ViewStyle; textStyle?: TextStyle };
export function Pill({ label, style, textStyle }: PillProps) {
  return (
    <View style={[styles.pill, style]}>
      <Text style={[styles.pillText, textStyle]}>{label}</Text>
    </View>
  );
}

export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}

type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};
export function PrimaryButton({ label, onPress, disabled, style }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.primaryBtn,
        pressed && !disabled ? { opacity: 0.9 } : null,
        disabled ? { opacity: 0.5 } : null,
        style,
      ]}>
      <Text style={styles.primaryBtnText}>{label}</Text>
    </Pressable>
  );
}
export function SecondaryButton({ label, onPress, disabled, style }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.secondaryBtn,
        pressed && !disabled ? { opacity: 0.9 } : null,
        disabled ? { opacity: 0.5 } : null,
        style,
      ]}>
      <Text style={styles.secondaryBtnText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  h1: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '800',
    color: theme.text,
  },
  h2: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.text,
  },
  muted: {
    fontSize: 14,
    lineHeight: 18,
    color: theme.muted,
  },
  sectionLabel: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '700',
    color: theme.muted,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.accentSoft,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.cardAlt,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.muted,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
  },
  primaryBtn: {
    backgroundColor: theme.accent,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryBtn: {
    backgroundColor: theme.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  secondaryBtnText: {
    color: theme.text,
    fontSize: 15,
    fontWeight: '800',
  },
});
