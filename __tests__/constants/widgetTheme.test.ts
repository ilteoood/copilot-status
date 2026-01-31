import { 
  WidgetColors, 
  WidgetSpacing, 
  WidgetFontSizes, 
  WidgetBorderRadius 
} from '@/constants/widgetTheme';

describe('constants/widgetTheme', () => {
  describe('WidgetColors', () => {
    it('should have all required color properties', () => {
      expect(WidgetColors.text).toBe('#ECEDEE');
      expect(WidgetColors.background).toBe('#151718');
      expect(WidgetColors.tint).toBe('#fff');
      expect(WidgetColors.icon).toBe('#9BA1A6');
      expect(WidgetColors.tabIconDefault).toBe('#9BA1A6');
      expect(WidgetColors.tabIconSelected).toBe('#fff');
      expect(WidgetColors.border).toBe('#2D3748');
      expect(WidgetColors.card).toBe('#1F2937');
      expect(WidgetColors.error).toBe('#EF4444');
      expect(WidgetColors.success).toBe('#22C55E');
    });

    it('should have valid hex color format', () => {
      const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      Object.values(WidgetColors).forEach(color => {
        expect(color).toMatch(hexColorRegex);
      });
    });
  });

  describe('WidgetSpacing', () => {
    it('should have all spacing properties', () => {
      expect(WidgetSpacing.xs).toBe(4);
      expect(WidgetSpacing.sm).toBe(8);
      expect(WidgetSpacing.md).toBe(16);
      expect(WidgetSpacing.lg).toBe(24);
      expect(WidgetSpacing.xl).toBe(32);
      expect(WidgetSpacing.xxl).toBe(48);
    });

    it('should have numeric values', () => {
      Object.values(WidgetSpacing).forEach(value => {
        expect(typeof value).toBe('number');
      });
    });

    it('should have values in ascending order', () => {
      expect(WidgetSpacing.xs).toBeLessThan(WidgetSpacing.sm);
      expect(WidgetSpacing.sm).toBeLessThan(WidgetSpacing.md);
      expect(WidgetSpacing.md).toBeLessThan(WidgetSpacing.lg);
      expect(WidgetSpacing.lg).toBeLessThan(WidgetSpacing.xl);
      expect(WidgetSpacing.xl).toBeLessThan(WidgetSpacing.xxl);
    });
  });

  describe('WidgetFontSizes', () => {
    it('should have all font size properties', () => {
      expect(WidgetFontSizes.xs).toBe(10);
      expect(WidgetFontSizes.sm).toBe(12);
      expect(WidgetFontSizes.base).toBe(14);
      expect(WidgetFontSizes.md).toBe(16);
      expect(WidgetFontSizes.lg).toBe(18);
      expect(WidgetFontSizes.xl).toBe(20);
    });

    it('should have numeric values', () => {
      Object.values(WidgetFontSizes).forEach(value => {
        expect(typeof value).toBe('number');
      });
    });

    it('should have values in ascending order', () => {
      expect(WidgetFontSizes.xs).toBeLessThan(WidgetFontSizes.sm);
      expect(WidgetFontSizes.sm).toBeLessThan(WidgetFontSizes.base);
      expect(WidgetFontSizes.base).toBeLessThan(WidgetFontSizes.md);
      expect(WidgetFontSizes.md).toBeLessThan(WidgetFontSizes.lg);
      expect(WidgetFontSizes.lg).toBeLessThan(WidgetFontSizes.xl);
    });
  });

  describe('WidgetBorderRadius', () => {
    it('should have all border radius properties', () => {
      expect(WidgetBorderRadius.sm).toBe(4);
      expect(WidgetBorderRadius.md).toBe(8);
      expect(WidgetBorderRadius.lg).toBe(12);
      expect(WidgetBorderRadius.xl).toBe(16);
      expect(WidgetBorderRadius.round).toBe(999);
    });

    it('should have numeric values', () => {
      Object.values(WidgetBorderRadius).forEach(value => {
        expect(typeof value).toBe('number');
      });
    });

    it('should have round as highest value', () => {
      expect(WidgetBorderRadius.round).toBeGreaterThan(WidgetBorderRadius.xl);
    });
  });
});
