import type { Theme } from '@/src/styles/unistyles';

/**
 * Creates widget styles for the given theme.
 * We use a factory function instead of StyleSheet.create because
 * widgets render outside React's context (via Voltra's renderer),
 * so unistyles' reactive theming isn't available.
 */
export const createWidgetStyles = (theme: Theme) => ({
  // Containers
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    width: '100%' as const,
    height: '100%' as const,
  },
  smallContainer: {
    padding: theme.spacing.sm + 4,
    backgroundColor: theme.colors.background,
    width: '100%' as const,
    height: '100%' as const,
  },
  androidContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    width: '100%' as const,
    height: '100%' as const,
    borderRadius: theme.borderRadius.xl,
  },

  // Layout
  row: {
    width: '100%' as const,
    flex: 1,
  },
  column: {
    flex: 1,
  },

  // Text - values
  largeValue: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
  },
  mediumValue: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
  },

  // Text - labels & footer
  label: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.icon,
  },
  footer: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.icon,
  },
  smallFooter: {
    fontSize: 8,
    color: theme.colors.icon,
  },
  footerWithMargin: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.icon,
    marginTop: theme.spacing.sm,
  },

  // Text - status
  loadingText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.critical,
  },
});

export type WidgetStyles = ReturnType<typeof createWidgetStyles>;

