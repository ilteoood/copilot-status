import { TFunction } from 'i18next';
import { differenceInHours, formatDistanceToNow } from 'date-fns';

type Nullable<T> = T | null | undefined;

export interface DailyQuotaInsight {
  daysRemaining: number;
  dailyAverage: number;
}

export function getDailyQuotaInsight(remainingQuota: number, resetDate: Date): DailyQuotaInsight {
  const now = new Date();

  // Calculate difference in hours to get fractional days behavior similar to Luxon
  const diffHours = differenceInHours(resetDate, now);
  const diffDays = diffHours / 24;

  const daysRemaining = Math.max(1, Math.round(diffDays));
  const dailyAverage = Math.max(0, Math.floor(remainingQuota / daysRemaining));

  return {
    daysRemaining,
    dailyAverage,
  };
}

export const formatTime = (t: TFunction, timestamp: Nullable<Date>): string => {
  if (!timestamp) return t('time.never');

  const now = new Date();
  const dateTimestamp = new Date(timestamp);

  const hours = differenceInHours(now, dateTimestamp);

  if (hours >= 24) {
    return dateTimestamp.toLocaleDateString();
  }

  return formatDistanceToNow(dateTimestamp, { addSuffix: true });
};

export const formatFullDate = (t: TFunction, timestamp: Nullable<Date | number>): string => {
  if (!timestamp) return t('time.never');
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
};
