import { PropsWithChildren, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { SettingsSection } from './SettingsSection';

interface SettingsCategoryProps extends PropsWithChildren {
  children: ReactNode;
  title: string;
}

export const SettingsCategory = ({ children, title }: SettingsCategoryProps) => {
  const { t } = useTranslation();

  return (
    <SettingsSection>
      <Text style={styles.sectionTitle}>{t(title)}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </SettingsSection>
  );
};

const styles = StyleSheet.create(theme => ({
  sectionTitle: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.icon,
    marginBottom: theme.spacing.xs,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
}));
