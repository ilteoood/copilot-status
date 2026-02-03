import type { Theme } from '@/src/styles/unistyles';

/**
 * Creates widget styles for the given theme.
 * We use a factory function instead of StyleSheet.create because
 * widgets render outside React's context (via Voltra's renderer),
 * so unistyles' reactive theming isn't available.
 */
export const createWidgetStyles = (theme: Theme) =>
  ({
    // Containers
    container: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
      flexGrow: 1,
      width: '100%',
      height: '100%',
    },
    androidContainer: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
      width: '100%',
      height: '100%',
      borderRadius: theme.borderRadius.xl,
    },

    // Layout
    row: {
      width: '100%',
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
      marginTop: theme.spacing.sm,
      fontSize: theme.typography.fontSizes.xs,
      color: theme.colors.icon,
    },
    smallFooter: {
      marginTop: theme.spacing.xs,
      fontSize: theme.typography.fontSizes.xxs,
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
  }) as const;

export type WidgetStyles = ReturnType<typeof createWidgetStyles>;
