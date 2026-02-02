export const formatPercent = (value: number): string =>
  value.toLocaleString(undefined, { maximumFractionDigits: 2 }) + '%';
