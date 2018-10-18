import {xValidateNodeLinksTxn} from './validate-node-links';
import {xSetupWithSchemaDataNowTxn} from '../test-helpers/setup';
import {xExtractNamedUids} from '../extract-named-uid/extract-named-uids';

const users = [
  {
    uid: '_:user1',
    username: 'user1',
    addresses: [{
      uid: '_:user1Address1',
      postcode: 2444
    }]
  },
  {
    uid: '_:user2',
    username: 'user2',
    addresses: [
      {
        uid: '_:user2Address1',
        postcode: 2000
      },
      {
        uid: '_:user2Address2',
        postcode: 2000
      }
    ]
  }
];

describe('xValidateNodeLinksTxn', () => {
  let dgraphClient, user1Uid, user2Uid, user1AddressUid, user2AddressUid, user2Address2Uid;

  beforeAll(async(done) => {
    const r = await xSetupWithSchemaDataNowTxn({data: users});
    dgraphClient = r.dgraphClient;

    const idsToExtract = ['user1', 'user2', 'user1Address1', 'user2Address1', 'user2Address2'];
    [user1Uid, user2Uid, user1AddressUid, user2AddressUid, user2Address2Uid]
      = await xExtractNamedUids(idsToExtract, r.result);

    done()
  });

  it('returns true when the linked nodes exists on the edge of the input node', async() => {
    const params = {
      node: user1Uid,
      edgeName: 'addresses',
      linkedNodesUids: [user1AddressUid]
    };

    const result = await xValidateNodeLinksTxn(params, dgraphClient);
    expect(result).toEqual(true)
  });

  it('returns false when the linked node does not exist on the edge of the input node', async() => {
    const params = {
      node: user1Uid,
      edgeName: 'addresses',
      linkedNodesUids: [user2AddressUid]
    };

    const result = await xValidateNodeLinksTxn(params, dgraphClient);
    expect(result).toEqual(false)
  });

  it('returns true when the linked nodes exists on the edge of the input node', async() => {
    const params = {
      node: user2Uid,
      edgeName: 'addresses',
      linkedNodesUids: [user2AddressUid, user2Address2Uid]
    };

    const result = await xValidateNodeLinksTxn(params, dgraphClient);
    expect(result).toEqual(true)
  });

  it('returns false when only one linked node exists on the edge of the input node', async() => {
    const params = {
      node: user2Uid,
      edgeName: 'addresses',
      linkedNodesUids: [user2AddressUid, user1AddressUid]
    };

    const result = await xValidateNodeLinksTxn(params, dgraphClient);
    expect(result).toEqual(false)
  });
});