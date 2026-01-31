import { StyleSheet } from 'react-native-unistyles';

const sharedColors = {
  good: '#22C55E',
  warning: '#F97316',
  critical: '#EF4444',
  tint: '#0a7ea4',
};

const commonTheme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    fontSizes: {
      xs: 10,
      sm: 12,
      base: 14,
      md: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 28,
      '4xl': 32,
      '5xl': 36,
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    fontWeights: {
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

// Light theme
const lightTheme = {
  ...commonTheme,
  colors: {
    ...sharedColors,
    text: '#11181C',
    background: '#fff',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
    border: '#E5E7EB',
    card: '#F9FAFB',
    error: '#EF4444',
    success: '#22C55E',
  },
};

// Dark theme
const darkTheme = {
  ...commonTheme,
  colors: {
    ...sharedColors,
    text: '#ECEDEE',
    background: '#151718',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
    border: '#2D3748',
    card: '#1F2937',
    error: '#EF4444',
    success: '#22C55E',
  },
};

// Breakpoints for responsive design
const breakpoints = {
  xs: 0,
  sm: 300,
  md: 500,
  lg: 800,
  xl: 1200,
};

// TypeScript type definitions
type AppBreakpoints = typeof breakpoints;
type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

// Export themes for use outside of React component context (e.g., widgets)
export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type Theme = typeof lightTheme;

// Augment unistyles types
declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

// Configure Unistyles
StyleSheet.configure({
  themes,
  breakpoints,
  settings: {
    adaptiveThemes: true, // Auto-switch based on system preference
  },
});
