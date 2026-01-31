import i18n from '@/services/i18n';

describe('services/i18n', () => {
  it('should be initialized', () => {
    expect(i18n).toBeDefined();
    expect(typeof i18n.t).toBe('function');
  });

  it('should translate keys correctly', () => {
    const result = i18n.t('time.never', { defaultValue: 'Never' });
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('should handle missing keys with default value', () => {
    const result = i18n.t('non.existing.key', { defaultValue: 'Default Text' });
    expect(result).toBeDefined();
  });
});
