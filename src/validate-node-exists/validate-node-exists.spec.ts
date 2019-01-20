import {xSetupWithSchemaDataNowTxn} from '../test-helpers/setup';
import {xExtractUids}  from '../extract-uids/extract-uids';
import {xValidateNodeExistsTxn} from './validate-node-exists';

const users = [
  { username: 'user1' },
  { username: 'user2' },
];

describe('xValidateNodeExistsTxn', () => {
  let user1uid, user2uid, dgraphClient;
  beforeAll(async(done) => {
    const r = await xSetupWithSchemaDataNowTxn({data: users});
    const uids = await xExtractUids(r.result);

    dgraphClient = r.dgraphClient;
    [user1uid, user2uid] = uids;
    done()
  });

  it('returns true when the node exists', async () => {
    const result = await xValidateNodeExistsTxn(user1uid, dgraphClient);
    expect(result).toEqual(true)
  });

  it('returns false when the node does not exist', async() => {
    const result = await xValidateNodeExistsTxn('0x3543', dgraphClient);
    expect(result).toEqual(false)
  })
});
