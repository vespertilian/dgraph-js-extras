import {isPromise} from './is-promise';

describe('.isPromise util', () => {
  // util from stack overflow suggestion
  // https://stackoverflow.com/questions/27746304/how-do-i-tell-if-an-object-is-a-promise/38339199#38339199

  it('returns true when passed a promise', () => {
    const testPromise = Promise.resolve('promise');
    expect(isPromise(testPromise)).toBe(true)
  });

  it('returns true for an async function (as they are promises)', () => {
    async function testAsyncFunc(): Promise<number> {
      return 1
    }
    expect(isPromise(testAsyncFunc())).toBe(true)
  });

  it('returns false when a string is provided', () => {
    expect(isPromise('junk')).toBe(false)
  });

  it('returns false when an object is provided', () => {
    expect(isPromise({junk: 'junk'})).toBe(false)
  });
});


