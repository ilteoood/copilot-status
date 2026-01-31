import { Ionicons } from '@expo/vector-icons';
import { t } from 'i18next';
import { ComponentProps } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface RadioButtonProps<T> {
  value: T;
  i18nPrefix: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  selected: boolean;
  onSelect: (value: T) => void | Promise<void>;
}

export const RadioButton = <T,>({
  onSelect,
  value,
  i18nPrefix,
  selected,
  icon,
}: RadioButtonProps<T>) => {
  const { theme } = useUnistyles();

  return (
    <TouchableOpacity style={styles.row} onPress={() => onSelect(value)}>
      <Ionicons
        name={selected ? 'radio-button-on' : 'radio-button-off'}
        size={22}
        color={selected ? theme.colors.tint : theme.colors.text}
      />
      <Text style={styles.rowText}>{t(`${i18nPrefix}.${value}`)}</Text>
      <Ionicons name={icon} size={20} color={theme.colors.icon} />
    </TouchableOpacity>
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
}));
