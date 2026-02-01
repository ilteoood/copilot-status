import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface CircularProgressProps {
  usedQuota: number;
  totalQuota: number;
  size?: number;
}

const PIE_CHART_COVER = { radius: 0.7, color: 'transparent' };

const getColorByPercent = (percent: number, colors: any) => {
  if (percent > 90) return colors.critical;
  if (percent >= 75) return colors.warning;
  return colors.good;
};

const getAvailableColorByPercent = (percent: number, colors: any) => {
  if (percent < 10) return colors.critical;
  if (percent < 25) return colors.warning;
  return colors.good;
};

export function CircularProgress({ usedQuota, totalQuota, size = 360 }: CircularProgressProps) {
  const { theme } = useUnistyles();
  const { t } = useTranslation();
  const [showAvailable, setShowAvailable] = useState(false);

  const consumedPercent = totalQuota > 0 ? (usedQuota / totalQuota) * 100 : 0;
  const availablePercent = 100 - consumedPercent;

  const color = getColorByPercent(consumedPercent, theme.colors);
  const availableColor = getAvailableColorByPercent(availablePercent, theme.colors);

  const displayPercent = showAvailable ? availablePercent : consumedPercent;
  const series = showAvailable
    ? [
        { value: availablePercent, color: availableColor },
        { value: consumedPercent, color: theme.colors.border },
      ]
    : [
        { value: consumedPercent, color },
        { value: availablePercent, color: theme.colors.border },
      ];

  const handleToggleView = () => {
    setShowAvailable(prev => !prev);
  };

  return (
    <Pressable
      style={[styles.container, { width: size, height: size }]}
      onPress={handleToggleView}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={t(showAvailable ? 'quota.toggleToUsed' : 'quota.toggleToAvailable')}
    >
      <View style={styles.chartContainer}>
        <PieChart widthAndHeight={size} series={series} cover={PIE_CHART_COVER} />
      </View>

      <View style={styles.centerContent}>
        <Text style={[styles.percentText, { fontSize: size * 0.22 }]}>
          {Math.round(displayPercent)}%
        </Text>
        <Text style={[styles.labelText, { fontSize: size * 0.08 }]}>
          {t(showAvailable ? 'quota.available' : 'quota.used')}
        </Text>
      </View>
    </Pressable>
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
