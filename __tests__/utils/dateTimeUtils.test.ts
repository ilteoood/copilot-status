import { formatTime, formatFullDate } from '@/utils/dateTimeUtils';

describe('dateTimeUtils', () => {
  describe('formatTime', () => {
    const mockT = jest.fn((key: string, options?: any) => {
      const translations: Record<string, string> = {
        'time.never': 'Never',
        'time.justNow': 'Just now',
      };
      
      if (key === 'time.minutesAgo') {
        return `${options.count} minute${options.count > 1 ? 's' : ''} ago`;
      }
      
      if (key === 'time.hoursAgo') {
        return `${options.count} hour${options.count > 1 ? 's' : ''} ago`;
      }
      
      return translations[key] || key;
    });

    beforeEach(() => {
      mockT.mockClear();
    });

    it('should return "Never" for null timestamp', () => {
      const result = formatTime(mockT as any, null);
      expect(result).toBe('Never');
      expect(mockT).toHaveBeenCalledWith('time.never');
    });

    it('should return "Just now" for timestamps less than 1 minute ago', () => {
      const now = Date.now();
      const timestamp = now - 30000;
      
      jest.spyOn(Date, 'now').mockReturnValue(now);
      
      const result = formatTime(mockT as any, timestamp);
      expect(result).toBe('Just now');
      expect(mockT).toHaveBeenCalledWith('time.justNow');
      
      jest.restoreAllMocks();
    });

    it('should return minutes ago for timestamps less than 60 minutes', () => {
      const now = Date.now();
      const timestamp = now - 5 * 60000;
      
      jest.spyOn(Date, 'now').mockReturnValue(now);
      
      const result = formatTime(mockT as any, timestamp);
      expect(result).toBe('5 minutes ago');
      expect(mockT).toHaveBeenCalledWith('time.minutesAgo', { count: 5 });
      
      jest.restoreAllMocks();
    });

    it('should return 1 minute ago for singular', () => {
      const now = Date.now();
      const timestamp = now - 1 * 60000;
      
      jest.spyOn(Date, 'now').mockReturnValue(now);
      
      const result = formatTime(mockT as any, timestamp);
      expect(result).toBe('1 minute ago');
      expect(mockT).toHaveBeenCalledWith('time.minutesAgo', { count: 1 });
      
      jest.restoreAllMocks();
    });

    it('should return hours ago for timestamps less than 24 hours', () => {
      const now = Date.now();
      const timestamp = now - 5 * 3600000;
      
      jest.spyOn(Date, 'now').mockReturnValue(now);
      
      const result = formatTime(mockT as any, timestamp);
      expect(result).toBe('5 hours ago');
      expect(mockT).toHaveBeenCalledWith('time.hoursAgo', { count: 5 });
      
      jest.restoreAllMocks();
    });

    it('should return formatted date for timestamps more than 24 hours ago', () => {
      const now = Date.now();
      const timestamp = now - 25 * 3600000;
      
      jest.spyOn(Date, 'now').mockReturnValue(now);
      
      const result = formatTime(mockT as any, timestamp);
      const expectedDate = new Date(timestamp).toLocaleDateString();
      expect(result).toBe(expectedDate);
      
      jest.restoreAllMocks();
    });
  });

  describe('formatFullDate', () => {
    const mockT = jest.fn((key: string) => {
      const translations: Record<string, string> = {
        'time.never': 'Never',
      };
      return translations[key] || key;
    });

    beforeEach(() => {
      mockT.mockClear();
    });

    it('should return "Never" for null timestamp', () => {
      const result = formatFullDate(mockT as any, null);
      expect(result).toBe('Never');
      expect(mockT).toHaveBeenCalledWith('time.never');
    });

    it('should format Date object correctly', () => {
      const date = new Date('2024-01-15T10:30:00');
      const result = formatFullDate(mockT as any, date);
      
      const expectedDate = date.toLocaleDateString();
      const expectedTime = date.toLocaleTimeString();
      expect(result).toBe(`${expectedDate} - ${expectedTime}`);
    });

    it('should format timestamp number correctly', () => {
      const timestamp = new Date('2024-01-15T10:30:00').getTime();
      const result = formatFullDate(mockT as any, timestamp);
      
      const date = new Date(timestamp);
      const expectedDate = date.toLocaleDateString();
      const expectedTime = date.toLocaleTimeString();
      expect(result).toBe(`${expectedDate} - ${expectedTime}`);
    });
  });
});
