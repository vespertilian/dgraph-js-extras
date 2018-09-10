import {isPromise} from './is-promise';

describe('.isPromise util', () => {
  // util from stack overflow suggestion
  // https://stackoverflow.com/questions/27746304/how-do-i-tell-if-an-object-is-a-promise/38339199#38339199

  it('should return true when passed a promise', () => {
    const testPromise = Promise.resolve('promise');
    expect(isPromise(testPromise)).toBe(true)
  });

  it('should return true for an async function (as they are promises)', () => {
    async function testAsyncFunc(): Promise<number> {
      return 1
    }
    expect(isPromise(testAsyncFunc())).toBe(true)
  });

  it('should return false when a string', () => {
    expect(isPromise('junk')).toBe(false)
  });

  it('should return false when an object', () => {
    expect(isPromise({junk: 'junk'})).toBe(false)
  });
});


