import { describe, it, expect } from 'bun:test';
import { Email } from './email.vo';
import { InvalidEmailException } from '../exceptions/invalid-email.exception';

describe('Email', () => {
  describe('create', () => {
    it('creates valid email lowercased', () => {
      const email = Email.create('User@Example.COM');
      expect(email.value).toBe('user@example.com');
    });

    it('throws InvalidEmailException for missing @', () => {
      expect(() => Email.create('notanemail')).toThrow(InvalidEmailException);
    });

    it('throws InvalidEmailException for empty string', () => {
      expect(() => Email.create('')).toThrow(InvalidEmailException);
    });

    it('trims whitespace', () => {
      const email = Email.create('  user@example.com  ');
      expect(email.value).toBe('user@example.com');
    });
  });

  describe('equals', () => {
    it('returns true for same value', () => {
      const a = Email.create('user@example.com');
      const b = Email.create('user@example.com');
      expect(a.equals(b)).toBe(true);
    });

    it('returns false for different values', () => {
      const a = Email.create('a@example.com');
      const b = Email.create('b@example.com');
      expect(a.equals(b)).toBe(false);
    });
  });
});
