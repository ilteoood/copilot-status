import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface SettingsVoiceProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  text: string;
  value: string;
}

export const SettingsVoice = ({ icon, text, value }: SettingsVoiceProps) => {
  const { t } = useTranslation();
  const { theme } = useUnistyles();

  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={22} color={theme.colors.text} />
      <Text style={styles.rowText}>{t(text)}</Text>
      <Text style={styles.rowValue}>{t(value)}</Text>
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.md,
  },
  rowText: {
    flex: 1,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  rowValue: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.icon,
  },
}));
