import {pathOr} from './path-or';

// copied from rambda
// https://github.com/ramda/ramda/blob/master/test/pathOr.js

describe('pathOr', () => {

  const deepObject = {a: {b: {c: 'c'}}, falseVal: false, nullVal: null, undefinedVal: undefined, arrayVal: ['arr']};

  it('takes a path and an object and returns the value at the path or the default value', function() {
    const obj = {
      a: {
        b: {
          c: 100,
          d: 200
        },
        e: {
          f: [100, 101, 102],
          g: 'G'
        },
        h: 'H'
      },
      i: 'I',
      j: ['J']
    };
    expect(pathOr('Unknown', ['a', 'b', 'c'], obj)).toEqual(100);
    expect(pathOr('Unknown', [], obj)).toEqual(obj);
    expect(pathOr('Unknown', ['a', 'e', 'f', 1], obj)).toEqual(101);
    expect(pathOr('Unknown', ['j', 0], obj)).toEqual('J');
    expect(pathOr('Unknown', ['j', 1], obj)).toEqual('Unknown');
    expect(pathOr('Unknown', ['a', 'b', 'c'], null)).toEqual('Unknown');
  });


  it("gets a deep property's value from objects", function() {
    expect(pathOr('Unknown', ['a', 'b', 'c'], deepObject)).toEqual('c');
    expect(pathOr('Unknown', ['a'], deepObject)).toEqual(deepObject.a);
  });

  it('returns the default value for items not found', function() {
    expect(pathOr('Unknown', ['a', 'b', 'foo'], deepObject)).toEqual('Unknown');
    expect(pathOr('Unknown', ['bar'], deepObject)).toEqual('Unknown');
  });

  it('returns the default value for null/undefined', function() {
    expect(pathOr('Unknown', ['toString'], null)).toEqual('Unknown');
    expect(pathOr('Unknown', ['toString'], undefined)).toEqual('Unknown');
  });

  it('works with falsy items', function() {
    expect(pathOr('Unknown', ['toString'], false)).toEqual(Boolean.prototype.toString);
  });

});