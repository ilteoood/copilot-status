import { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export const SettingsSection = ({ children }: PropsWithChildren) => (
  <View style={styles.section}>{children}</View>
);

const styles = StyleSheet.create(theme => ({
  section: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
}));
