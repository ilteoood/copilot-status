import {
  getPercentRemaining,
  getQuotaStatus,
  getRemainingQuota,
  type QuotaInfo,
} from '@/types/quota';

describe('types/quota', () => {
  describe('getQuotaStatus', () => {
    it('should return "good" when percent remaining is greater than 50', () => {
      expect(getQuotaStatus(51)).toBe('good');
      expect(getQuotaStatus(75)).toBe('good');
      expect(getQuotaStatus(100)).toBe('good');
    });

    it('should return "warning" when percent remaining is between 20 and 50', () => {
      expect(getQuotaStatus(50)).toBe('warning');
      expect(getQuotaStatus(35)).toBe('warning');
      expect(getQuotaStatus(21)).toBe('warning');
    });

    it('should return "critical" when percent remaining is 20 or less', () => {
      expect(getQuotaStatus(20)).toBe('critical');
      expect(getQuotaStatus(10)).toBe('critical');
      expect(getQuotaStatus(0)).toBe('critical');
    });
  });

  describe('getRemainingQuota', () => {
    it('should calculate remaining quota correctly', () => {
      const quota: QuotaInfo = {
        totalQuota: 1000,
        usedQuota: 300,
        resetDate: new Date(),
        hasOverage: false,
        overageCount: 0,
      };

      expect(getRemainingQuota(quota)).toBe(700);
    });

    it('should return 0 when all quota is used', () => {
      const quota: QuotaInfo = {
        totalQuota: 1000,
        usedQuota: 1000,
        resetDate: new Date(),
        hasOverage: false,
        overageCount: 0,
      };

      expect(getRemainingQuota(quota)).toBe(0);
    });

    it('should handle negative remaining when overage exists', () => {
      const quota: QuotaInfo = {
        totalQuota: 1000,
        usedQuota: 1100,
        resetDate: new Date(),
        hasOverage: true,
        overageCount: 100,
      };

      expect(getRemainingQuota(quota)).toBe(-100);
    });
  });

  describe('getPercentRemaining', () => {
    it('should calculate percent remaining correctly', () => {
      const quota: QuotaInfo = {
        totalQuota: 1000,
        usedQuota: 300,
        resetDate: new Date(),
        hasOverage: false,
        overageCount: 0,
      };

      expect(getPercentRemaining(quota)).toBe(70);
    });

    it('should return 0 when all quota is used', () => {
      const quota: QuotaInfo = {
        totalQuota: 1000,
        usedQuota: 1000,
        resetDate: new Date(),
        hasOverage: false,
        overageCount: 0,
      };

      expect(getPercentRemaining(quota)).toBe(0);
    });

    it('should return 100 when no quota is used', () => {
      const quota: QuotaInfo = {
        totalQuota: 1000,
        usedQuota: 0,
        resetDate: new Date(),
        hasOverage: false,
        overageCount: 0,
      };

      expect(getPercentRemaining(quota)).toBe(100);
    });

    it('should return 0 when total quota is 0', () => {
      const quota: QuotaInfo = {
        totalQuota: 0,
        usedQuota: 0,
        resetDate: new Date(),
        hasOverage: false,
        overageCount: 0,
      };

      expect(getPercentRemaining(quota)).toBe(0);
    });

    it('should handle decimal percentages correctly', () => {
      const quota: QuotaInfo = {
        totalQuota: 1000,
        usedQuota: 333,
        resetDate: new Date(),
        hasOverage: false,
        overageCount: 0,
      };

      expect(getPercentRemaining(quota)).toBe(66.7);
    });

    it('should handle negative percent when overage exists', () => {
      const quota: QuotaInfo = {
        totalQuota: 1000,
        usedQuota: 1100,
        resetDate: new Date(),
        hasOverage: true,
        overageCount: 100,
      };

      expect(getPercentRemaining(quota)).toBe(-10);
    });
  });
});
