import {xSetupWithSchemaDataCommitTxn} from '../test-helpers/setup';
import {xExtractUids} from '../extract-uids/extract-uids';
import {xQueryTxn, xQueryWithVarsTxn} from './query';

const users = [
  { username: 'user1' },
  { username: 'user2' },
];

describe("xQuery", () => {
  let user1uid, user2uid, dgraphClient;
  beforeAll(async(done) => {
    const r = await xSetupWithSchemaDataCommitTxn({data: users});
    const uids = await xExtractUids(r.result);

    dgraphClient = r.dgraphClient;
    [user1uid, user2uid] = uids;
    done()
  });

  describe('xQueryTxn', async() => {
    it("queries dgraph and return the result of .getJson()", async() => {
      const user1Query = `{
        q(func: uid(${user1uid})) {
          username
        }
      }`;

      const r1 = await xQueryTxn(user1Query, dgraphClient);
      expect(r1.q[0].username).toEqual('user1');

      const user2Query = `{
        q(func: uid(${user2uid})) {
          username
        }
      }`;
      const r2 = await xQueryTxn(user2Query, dgraphClient);
      expect(r2.q[0].username).toEqual('user2');
    });
  });

  describe("xQueryWithVarsTxn", () => {
    // without vars
    it("queries dgraph and return the result of .getJson() without vars", async() => {
      const user1Query = `{
        q(func: uid(${user1uid})) {
          username
        }
      }`;

      const r1 = await xQueryWithVarsTxn({query: user1Query}, dgraphClient);
      expect(r1.q[0].username).toEqual('user1');

      const user2Query = `{
        q(func: uid(${user2uid})) {
          username
        }
      }`;
      const r2 = await xQueryWithVarsTxn({query: user2Query}, dgraphClient);
      expect(r2.q[0].username).toEqual('user2');
    });

    // with vars
    it("queries dgraph and returns the result og .getJson() with vars", async() => {
      const query = `query q($userUid: string) {
        q(func: uid($userUid)) {
          username
        }
      }`;

      const r1 = await xQueryWithVarsTxn({query, vars: {$userUid: user1uid}}, dgraphClient);
      expect(r1.q[0].username).toEqual('user1');

      const r2 = await xQueryWithVarsTxn({query, vars: {$userUid: user2uid}}, dgraphClient);
      expect(r2.q[0].username).toEqual('user2');
    });
  })
});
