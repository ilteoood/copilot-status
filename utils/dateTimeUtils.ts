import { TFunction } from 'i18next';

export const formatTime = (t: TFunction, timestamp: number | null): string => {
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

export const formatFullDate = (t: TFunction, timestamp: Date | number | null): string => {
  if (!timestamp) return t('time.never');
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
};
