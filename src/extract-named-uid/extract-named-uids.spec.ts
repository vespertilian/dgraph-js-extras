import {xSetupForTest, xSetupWithSchemaDataCommitTxn} from '../test-helpers/setup';
import {xExtractNamedUids} from './extract-named-uids';
import * as messages from "dgraph-js/generated/api_pb";
import {xSetJSONCommitTxn} from '../set-json/set-json';

const schema = `
    name: string @index(exact) .
    street: string @index(exact) .
`;

const sampleData = {
  uid: "_:user",
  name: "cameron",
  username: "vespertilian",
  address: {
    uid: "_:address",
    street: 'William',
    postCode: 2000
  }
};

describe('xExtractNamedUids', () => {

  describe('Promise as input', () => {
    it('returns the uids as an array', async() => {
      const {dgraphClient} = await xSetupForTest();

      const ids = await xExtractNamedUids(['user', 'address'], xSetJSONCommitTxn(sampleData, dgraphClient))
      expect(ids.length).toEqual(2)
    });
  });

  describe('Dgraph mutation result as input', () => {
    let mutationResult: messages.Assigned;
    let dgraphClient;

    beforeAll(async(done) => {
      const r = await xSetupWithSchemaDataCommitTxn({schema, data: sampleData});
      dgraphClient = r.dgraphClient;
      mutationResult = r.result;
      done()
    });

    it('returns results that are strings', () => {
      const ids = xExtractNamedUids(['user'], mutationResult);
      expect(typeof  ids[0]).toBe('string');
      expect(ids.length).toEqual(1);
    });

    it('returns results equal to parameters requested', () => {
      const ids = xExtractNamedUids(['user', 'address'], mutationResult);
      expect(ids.length).toEqual(2);
    });

    it('returns the correct uids', async() => {
      const [userId, addressId] = xExtractNamedUids(['user', 'address'], mutationResult);

      const userQuery = `{
        q(func: eq(name, "cameron")) {
          uid
        }
      }`;

      const user = await dgraphClient.newTxn().queryWithVars(userQuery);
      expect(user.getJson().q[0].uid).toEqual(userId)

      const addressQuery = `{
        q(func: eq(street, "William")) {
          uid
        }
      }`;

      const address = await dgraphClient.newTxn().queryWithVars(addressQuery);
      expect(address.getJson().q[0].uid).toEqual(addressId)
    });

    it('throws an error when an undefined property is requested', () => {
      let error = null;
      try {
        xExtractNamedUids(['foo'], mutationResult);
      } catch(e) {
        error = e;
      }
      expect(error.message).toContain("No named uid present for 'foo'")
    })
  });

  describe('Errors', () => {
    const junkObject = {junk: 'junk'};
    const stringifiedJunkObject = JSON.stringify(junkObject);

    it('throws an informative error when any junk object is passed in', () => {
      let error = null;
      try {
        xExtractNamedUids(['user'], junkObject as any)
      } catch(e) {
        error = e;
      }

      expect(error.message).toContain('xExtractNamedUids could not extract named uids')
      expect(error.message).toContain(stringifiedJunkObject);
    });

    it('throws an informative error when a junk promise is passed in', async() => {
      const junkPromise = Promise.resolve(junkObject);

      let error = null;
      try {
        await xExtractNamedUids(['user'], junkPromise as any);
      } catch(e) {
        error = e
      }

      expect(error.message).toContain('xExtractNamedUids could not extract named uids')
      expect(error.message).toContain(stringifiedJunkObject);
    })
  })
});
