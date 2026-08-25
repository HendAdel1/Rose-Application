import { describe, expect, it } from 'vitest';
import { getAvatarColor, getUserInitial } from './avatar-color.util';

describe('avatar-color.util', () => {
  describe('getAvatarColor', () => {
    it('should return default palette color for empty or null identifier', () => {
      const color1 = getAvatarColor(null);
      const color2 = getAvatarColor('');
      const color3 = getAvatarColor('   ');

      expect(color1).toBeDefined();
      expect(color1.bg).toBe('#F4B400');
      expect(color2.bg).toBe('#F4B400');
      expect(color3.bg).toBe('#F4B400');
    });

    it('should return consistent deterministic color for the same identifier', () => {
      const result1 = getAvatarColor('john.doe@example.com');
      const result2 = getAvatarColor('john.doe@example.com');

      expect(result1.bg).toBe(result2.bg);
      expect(result1.text).toBe(result2.text);
    });

    it('should be case-insensitive for email/username', () => {
      const resultLower = getAvatarColor('admin@rose.com');
      const resultUpper = getAvatarColor('ADMIN@ROSE.COM');

      expect(resultLower.bg).toBe(resultUpper.bg);
    });
  });

  describe('getUserInitial', () => {
    it('should return the first uppercase letter of name', () => {
      expect(getUserInitial('Jonathan', 'user@example.com')).toBe('J');
      expect(getUserInitial('hend', 'user@example.com')).toBe('H');
    });

    it('should fallback to email if name is empty', () => {
      expect(getUserInitial('', 'admin@rose.com')).toBe('A');
      expect(getUserInitial(null, 'sarah@example.com')).toBe('S');
    });

    it('should return "A" default when both are empty', () => {
      expect(getUserInitial('', '')).toBe('A');
      expect(getUserInitial(null, null)).toBe('A');
    });
  });
});
