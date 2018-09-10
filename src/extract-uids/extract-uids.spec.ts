import {xSetupForTestNow} from '../test-helpers/setup';
import {xSetJSONNow} from '../set-json-now/set-json-now';
import {xExtractFirstUid, xExtractUids} from './extract-uids';
import * as messages from "dgraph-js/generated/api_pb";

const users = [
  { username: 'user1' },
  { username: 'user2' },
  { username: 'user3' },
  { username: 'user4' },
  { username: 'user5' },
];

describe('xExtractUids', () => {

  describe('Promise as input', () => {
    it('returns the uids as an array', async() => {
      const {dgraphClient} = await xSetupForTestNow();
      const ids = await xExtractUids(xSetJSONNow(users, dgraphClient));
      expect(ids.length).toEqual(5);
    });
  });

  describe('DGraph mutation result as input', async() => {
    let mutationResult: messages.Assigned;

    beforeAll(async(done) => {
      const {dgraphClient} = await xSetupForTestNow();
      mutationResult = await xSetJSONNow(users, dgraphClient);
      done()
    });

    it('return results that are strings',() => {
      const ids = xExtractUids(mutationResult, 1);
      expect(typeof ids[0]).toBe('string')
    });

    it('returns the number of uids specified in the limit attribute',() => {
      const ids = xExtractUids(mutationResult, 3);
      expect(ids.length).toBe(3);
    });

    it('returns all available uids when no parameters are passed in',() => {
      const ids = xExtractUids(mutationResult);
      expect(ids.length).toBe(5);
    });
  });

  describe('Errors', () => {
    const junkObject = {junk: 'junk'};
    const stringifiedJunkObject = JSON.stringify(junkObject);
    it('throws an informative error when a junk promise is passed in', async() => {
      const junkPromise = Promise.resolve(junkObject);

      let error = null;
      try {
        await xExtractUids(junkPromise as any);
      } catch(e) {
        error = e
      }

      expect(error.message).toContain('xExtractUids could not extract uids from');
      expect(error.message).toContain('Original Error');
      expect(error.message).toContain(stringifiedJunkObject);
    });

    it('throws an informative error when any junk object is passed in', () => {
      let error = null;
      try {
        xExtractUids(junkObject as any);
      } catch(e) {
        error = e
      }

      expect(error.message).toContain('xExtractUids could not extract uids from');
      expect(error.message).toContain('Original Error');
      expect(error.message).toContain(stringifiedJunkObject);
    });
  });

});

describe('xExtractFirstUid', () => {
  it('extracts only the first uid from the SetJSON result from a promise', async() => {
    const {dgraphClient} = await xSetupForTestNow();
    const id = await xExtractFirstUid(xSetJSONNow(users, dgraphClient));
    expect(typeof id).toEqual('string')
  });

  it('extracts only the first uid from the SetJSON result from an existing result', async() => {
    const {dgraphClient} = await xSetupForTestNow();
    const result = await xSetJSONNow(users, dgraphClient);
    const id = xExtractFirstUid(result);
    expect(typeof id).toEqual('string')
  })
});

