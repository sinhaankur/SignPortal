// SignPortal Mobile Theme

export const colors = {
  // Brand colors
  primary: '#37322f',
  primaryLight: '#4a433f',
  primaryDark: '#2a2623',
  
  // Backgrounds
  background: '#ffffff',
  backgroundSecondary: '#f7f5f3',
  surface: '#ffffff',
  
  // Text
  text: '#37322f',
  textSecondary: '#6b6560',
  textTertiary: '#9c9690',
  textInverse: '#ffffff',
  
  // Status colors
  success: '#22c55e',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  error: '#ef4444',
  errorLight: '#fee2e2',
  info: '#3b82f6',
  infoLight: '#dbeafe',
  
  // Borders
  border: '#e8e4e0',
  borderLight: '#f0eeeb',
  
  // Document status
  statusDraft: '#6b7280',
  statusPending: '#f59e0b',
  statusInProgress: '#3b82f6',
  statusCompleted: '#22c55e',
  statusExpired: '#ef4444',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#37322f',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#37322f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#37322f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};

const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
};

export type Theme = typeof theme;
export default theme;
