import { TFunction } from 'i18next';
import { DateTime } from 'luxon';

type Nullable<T> = T | null | undefined;

export interface DailyQuotaInsight {
  daysRemaining: number;
  dailyAverage: number;
}

export function getDailyQuotaInsight(remainingQuota: number, resetDate: Date): DailyQuotaInsight {
  const now = DateTime.now();
  const endOfMonth = DateTime.fromJSDate(new Date(resetDate));

  const diffTime = endOfMonth.diff(now, 'days').days;
  const daysRemaining = Math.max(1, Math.round(diffTime));
  const dailyAverage = Math.max(0, Math.floor(remainingQuota / daysRemaining));

  return {
    daysRemaining,
    dailyAverage,
  };
}

export const formatTime = (t: TFunction, timestamp: Nullable<number>): string => {
  if (!timestamp) return t('time.never');

  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return t('time.justNow');
  if (minutes < 60) return t('time.minutesAgo', { count: minutes });
  if (hours < 24) return t('time.hoursAgo', { count: hours });
  return new Date(timestamp).toLocaleDateString();
};

export const formatFullDate = (t: TFunction, timestamp: Nullable<Date | number>): string => {
  if (!timestamp) return t('time.never');
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
};
