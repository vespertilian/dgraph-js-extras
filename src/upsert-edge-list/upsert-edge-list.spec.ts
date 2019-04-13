import { xSetupWithSchemaDataCommitTxn } from '../test-helpers/setup';
import { xExtractNamedUids } from '../extract-named-uid/extract-named-uids';
import { basicEqualityUpsertFn, IUpsertFnReturnValues, xQueryTxn } from '..';
import { IUpsertNode, xUpsertEdgeListCommitTxn } from './upsert-edge-list';

const addressesQuery = `{
  q(func: has(postCode), orderasc: streetName) {
    uid
    streetName
    postCode
  }
}`;

const userQuery = (userUid: string) => `{
  q(func: uid(${userUid})) {
    uid
    name
    addresses(orderasc: streetName) {
      streetName
      postCode
    }
  }
}`;

describe('xUpsertEdge', () => {
  it('finds or create new nodes on an edge, replacing the old edge list with the new list', async() => {
    const schema = `
      name: string @index(hash) .
      address: uid .
      streetName: string @index(hash) .
      postCode: int @index(int) .
    `;

    const cameronInitial = {
      uid: '_:cameron',
      name: 'Cameron',
      addresses: [
        {
          streetName: 'Clarence',
          postCode: 2444
        },
        {
          streetName: 'George',
          postCode: 2000
        }
      ]
    };

    const howardInitial = {
      name: 'Howard',
      addresses: {
        streetName: 'William',
        postCode: 2444
      }
    };

    const addresses = [cameronInitial, howardInitial];

    const {dgraphClient, result} = await xSetupWithSchemaDataCommitTxn({schema, data: addresses});
    const [cameronUid] = xExtractNamedUids(['cameron'], result);

    // check cameron has the addresses he should
    const cameronInitialResult = await xQueryTxn(userQuery(cameronUid), dgraphClient);
    const cameronsInitialAddresses = cameronInitialResult.q[0].addresses;

    expect(cameronsInitialAddresses).toEqual([
      {streetName: 'Clarence', postCode: 2444},
      {streetName: 'George', postCode: 2000}
    ]);

    // check the address total
    const allAddressesInitial = await xQueryTxn(addressesQuery, dgraphClient);

    expect(allAddressesInitial.q).toEqual([
      {uid: jasmine.any(String), streetName: 'Clarence', postCode: 2444},
      {uid: jasmine.any(String), streetName: 'George', postCode: 2000},
      {uid: jasmine.any(String), streetName: 'William', postCode: 2444},
    ]);

    // upsert on streetName and postCode
    const addressUpsert = basicEqualityUpsertFn(['streetName', 'postCode']);

    // keep clarence street, add new street, remove george street and add existing street william
    const newAddresses = [
      {
        streetName: 'Clarence',
        postCode: 2444
      },
      {
        streetName: 'New Street',
        postCode: 2444
      },
      {
        streetName: 'William',
        postCode: 2444
      },
    ];

    const upsertNode: IUpsertNode = {
      uid: cameronUid,
      predicate: 'addresses'
    };

    await xUpsertEdgeListCommitTxn(addressUpsert, upsertNode, newAddresses, dgraphClient);

    const cameronFinalResult = await xQueryTxn(userQuery(cameronUid), dgraphClient);
    const allAddressesFinal = await xQueryTxn(addressesQuery, dgraphClient);

    expect(cameronFinalResult.q[0].addresses).toEqual(newAddresses);

    // the address that is no longer associated with cameron is still in the db
    expect(allAddressesFinal.q).toEqual([
      {uid: jasmine.any(String), streetName: 'Clarence', postCode: 2444},
      {uid: jasmine.any(String), streetName: 'George', postCode: 2000},
      {uid: jasmine.any(String), streetName: 'New Street', postCode: 2444 },
      {uid: jasmine.any(String), streetName: 'William', postCode: 2444},
    ])
  });

  describe('errors', () => {

    async function setupErrorsSpec() {
      const schema = `
      name: string @index(hash) .
      address: uid .
      streetName: string @index(hash) .
      postCode: int @index(int) .
    `;

      const cameronInitial = {
        uid: '_:cameron',
        name: 'Cameron',
        addresses: [
          {
            uid: '_:cameron_address',
            streetName: 'Clarence',
            postCode: 2444
          },
          {
            uid: '_:cameron_address_2',
            streetName: 'George',
            postCode: 2000
          }
        ]
      };
      const {dgraphClient, result} = await xSetupWithSchemaDataCommitTxn({schema, data: cameronInitial});
      const [cameronUid] = xExtractNamedUids(['cameron'], result);

      return {dgraphClient, cameronUid}
    }

    it('throws an informative error when passed a bad upsert query', async() => {
      const {dgraphClient, cameronUid} = await setupErrorsSpec();

      const badQuery = (name: string) => (): IUpsertFnReturnValues => {
        // This query is missing parentheses around the name value
        const dgraphQuery = `{
                q(func: eq(name, "${name})) {
                    uid
                }
            }`;

        const nodeFoundFn: any = () => {};
        return {
          dgraphQuery,
          nodeFoundFn
        }
      };

      const upsertNode: IUpsertNode = {
        uid: cameronUid,
        predicate: 'addresses'
      };

      const newAddresses = [
        {
          streetName: 'Clarence',
          postCode: 2444
        },
        {
          streetName: 'New Street',
          postCode: 2444
        }
      ];

      let error = null;

      try {
        await  xUpsertEdgeListCommitTxn(badQuery('streetName'), upsertNode, newAddresses, dgraphClient)
      } catch(e) {
        error = e;
      }

      expect(error.message).toContain('xUpsert DgraphQuery failed, check the query you provided against this error: ');
    });

    it(`throws an informative error when an array of objects is not passed in`, async() => {
      const {dgraphClient, cameronUid} = await setupErrorsSpec();

      const addressUpsert = basicEqualityUpsertFn(['streetName', 'postCode']);

      const newAddresses = {
          streetName: 'Clarence',
          postCode: 2444
      } as any;

      const upsertNode: IUpsertNode = {
        uid: cameronUid,
        predicate: 'addresses'
      };

      let error = null;
      try {
        await xUpsertEdgeListCommitTxn(addressUpsert, upsertNode, newAddresses, dgraphClient);
      } catch(e) {
        error = e;
      }

      expect(error.message).toContain('You must pass nodes as an array of objects');
    });

    it(`throws an informative error when the upsertNodes predicate value is not a string`, async() => {
      const {dgraphClient} = await setupErrorsSpec();

      const addressUpsert = basicEqualityUpsertFn(['streetName', 'postCode']);

      const newAddresses = [
        {
          streetName: 'Clarence',
          postCode: 2444
        },
        {
          streetName: 'New Street',
          postCode: 2444
        }
      ];

      const upsertNode = {
        uid: 'x0dxf',
        predicate: {} // object not string
      } as any;

      let error = null;
      try {
        await xUpsertEdgeListCommitTxn(addressUpsert, upsertNode, newAddresses, dgraphClient);
      } catch(e) {
        error = e;
      }

      expect(error.message).toEqual('You must pass in a predicate string as part of the upsert node');
    });

    it('throws an informative error when the upsertNodes predicate uid is not a valid node', async() => {
      const {dgraphClient} = await setupErrorsSpec();

      const addressUpsert = basicEqualityUpsertFn(['streetName', 'postCode']);

      const upsertNode = {
        uid: '0x4324', // made up uid
        predicate: 'addresses'
      };

      const newAddresses = [
        {
          streetName: 'Clarence',
          postCode: 2444
        },
        {
          streetName: 'New Street',
          postCode: 2444
        }
      ];


      let error = null;
      try {
        await xUpsertEdgeListCommitTxn(addressUpsert, upsertNode, newAddresses, dgraphClient);
      } catch(e) {
        error = e;
      }

      expect(error.message).toContain(`You passed a uid for a node that does not exist`);
    })
  });
});
