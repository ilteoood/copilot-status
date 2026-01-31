import { Fonts } from '@/constants/theme';

describe('constants/theme', () => {
  describe('Fonts', () => {
    it('should have font families defined', () => {
      expect(Fonts).toBeDefined();
      expect(Fonts.sans).toBeDefined();
      expect(Fonts.serif).toBeDefined();
      expect(Fonts.rounded).toBeDefined();
      expect(Fonts.mono).toBeDefined();
    });

    it('should have correct font types', () => {
      expect(typeof Fonts.sans).toBe('string');
      expect(typeof Fonts.serif).toBe('string');
      expect(typeof Fonts.rounded).toBe('string');
      expect(typeof Fonts.mono).toBe('string');
    });
  });
});
