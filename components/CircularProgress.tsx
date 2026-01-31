import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface CircularProgressProps {
  usedQuota: number;
  totalQuota: number;
  size?: number;
}

const PIE_CHART_COVER = { radius: 0.7, color: 'transparent' };

export function CircularProgress({ usedQuota, totalQuota, size = 360 }: CircularProgressProps) {
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  const consumedPercent = totalQuota > 0 ? (usedQuota / totalQuota) * 100 : 0;

  const getColor = () => {
    if (consumedPercent > 90) return theme.colors.critical;
    if (consumedPercent >= 75) return theme.colors.warning;
    return theme.colors.good;
  };
  const color = getColor();

  const series = [
    { value: consumedPercent, color },
    { value: 100 - consumedPercent, color: theme.colors.border },
  ];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.chartContainer}>
        <PieChart widthAndHeight={size} series={series} cover={PIE_CHART_COVER} />
      </View>

      <View style={styles.centerContent}>
        <Text style={[styles.percentText, { fontSize: size * 0.22 }]}>
          {Math.round(consumedPercent)}%
        </Text>
        <Text style={[styles.labelText, { fontSize: size * 0.08 }]}>{t('quota.used')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
  },
  percentText: {
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
  },
  labelText: {
    color: theme.colors.icon,
    fontWeight: theme.typography.fontWeights.medium,
    marginTop: 4,
    opacity: 0.6,
  },
}));
