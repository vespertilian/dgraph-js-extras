import {xSetupWithSchemaDataCommitTxn} from '../test-helpers/setup';
import {xExtractUids} from '../extract-uids/extract-uids';
import {xValidateNodePredicatesTxn} from './validate-node-predicates';

const users = [
  { username: 'user1', age: 33, street: '123 state'},
  { username: 'user2', age: 35},
  { username: 'user3'}
];

describe('xValidateNodePredicatesTxn', () => {
  let userUids, user1uid, user2uid, user3uid, dgraphClient;

  beforeAll(async(done) => {
    const r = await xSetupWithSchemaDataCommitTxn({data: users});
    const uids = await xExtractUids(r.result);

    dgraphClient = r.dgraphClient;
    userUids = uids;
    [user1uid, user2uid, user3uid] = uids;
    done();
  });

  it('returns true when all nodes have the requested predicate', async() => {
    const result = await xValidateNodePredicatesTxn({
      nodes: userUids,
      predicates: ['username']
    }, dgraphClient);

    expect(result).toEqual(true)
  });

  it('returns true when matching multiple predicates', async() => {
    const result = await xValidateNodePredicatesTxn({
      nodes: [user1uid, user2uid],
      predicates: ['username', 'age']
    }, dgraphClient);

    expect(result).toEqual(true)
  });

  it('returns false when matching multiple predicates and not all nodes match', async() => {
    const result = await xValidateNodePredicatesTxn({
      nodes: userUids,
      predicates: ['username', 'age']
    }, dgraphClient);

    expect(result).toEqual(false)
  });

  it('returns false when nodes are missing the predicate', async() => {
    const result = await xValidateNodePredicatesTxn({
      nodes: userUids,
      predicates: ['foo']
    }, dgraphClient);

    expect(result).toEqual(false)
  });
});
