import { isString } from './is-string';

describe('isString', () => {
  it('returns true when the value is a string literal', () => {
    expect(isString('foo')).toBe(true);
  });

  it('returns true when the value is a string object', () => {
    expect(isString(new String('foo'))).toBe(true);
  });

  it('should be false for all other values', () => {
    expect(isString(undefined)).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString(true)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(5)).toBe(false);
  })
});
