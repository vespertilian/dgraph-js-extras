import {xSetupWithSchemaDataNowTxn} from '../test-helpers/setup';
import {xExtractNamedUids} from '../extract-named-uid/extract-named-uids';
import {xQueryWithVarsTxn} from '../query/query';
import {xDeleteJSONNowTxn} from './delete-json';

const schema = `
    name: string @index(exact) .
    street: string @index(exact) .
`;

const sampleData = {
  uid: "_:user",
  name: "cameron",
  addresses: [
    {uid: "_:address1", street: "william", postcode: 2000},
    {uid: "_:address2", street: "george", postcode: 2001},
    {uid: "_:address3", street: "hay", postcode: 2444},
    {uid: "_:address4", street: "short", postcode: 2107}
  ]
};

const queryUsers = (prefix: string) => ` {
  ${prefix}(func: has(name)) {
    uid
    name
    addresses(orderasc: street) {
      uid
      street
    }
  }
}
`;

const queryAddressByUid = (prefix, uid) => `{
  ${prefix}(func: uid(${uid})) {
    uid
    street
    postcode
  }
}`;

const queryAllAddresses = (prefix) => `{
  ${prefix}(func: has(street), orderasc: street) {
    uid,
    street
    postcode
  }
}`;

describe("delete-json", () => {
  it("lets you delete a node (address) and the link that node had to another node (user has addresses - delete link pointing to deleted address)", async() => {
    const {result, dgraphClient} = await xSetupWithSchemaDataNowTxn({schema, data: sampleData});

    const [userUid, address1Uid] = xExtractNamedUids(['user', 'address1', 'address2'],result);

    // one user
    const {u} = await xQueryWithVarsTxn({query: queryUsers('u')}, dgraphClient);
    expect(u.length).toBe(1);
    // with 4 addresses
    expect(u[0].addresses.length).toBe(4);

    // 4 total addresses in db
    const {allA} = await xQueryWithVarsTxn({query: queryAllAddresses('allA')}, dgraphClient);
    expect(allA.length).toBe(4);

    // address1 is william street
    const {a} = await xQueryWithVarsTxn({query: queryAddressByUid('a', address1Uid)}, dgraphClient);
    expect(a[0].street).toEqual('william');

    const delete_json = [
      {
        uid: userUid, // user uid
        addresses: {
          uid: address1Uid // delete link with address
        },
      },
      {
        uid: address1Uid // delete actual address
      }
    ];

    await xDeleteJSONNowTxn(delete_json, dgraphClient);

    // still one user
    const {u2} = await xQueryWithVarsTxn({query: queryUsers('u2')}, dgraphClient);
    expect(u2.length).toBe(1);

    // 3 addresses now
    expect(u2[0].addresses.length).toBe(3);

    // george, hay and short are the addresses we have left
    expect(u2[0].addresses[0].street).toEqual('george');
    expect(u2[0].addresses[1].street).toEqual('hay');
    expect(u2[0].addresses[2].street).toEqual('short');

    // george, hay and short are the addresses we have in the db
    const {allA2} = await xQueryWithVarsTxn({query: queryAllAddresses('allA2')}, dgraphClient);
    expect(allA2.length).toBe(3);
    expect(allA2[0].postcode).toBe(2001);
    expect(allA2[0].street).toBe('george');
    expect(allA2[1].postcode).toBe(2444);
    expect(allA2[2].postcode).toBe(2107);

    // we can no longer query for the old address
    const {a2} = await xQueryWithVarsTxn({query: queryAddressByUid('a2', address1Uid)}, dgraphClient);
    expect(a2[0].street).toBeUndefined();
    expect(a2[0].postcode).toBeUndefined();
  });

  it("lets you delete multiple nodes (2x addresses) and the links that those noes had to another node (user has addresses - delete two links pointing to addresses", async() => {
    const {result, dgraphClient} = await xSetupWithSchemaDataNowTxn({schema, data: sampleData});
    const [userUid, address1Uid, address2Uid] = xExtractNamedUids(['user', 'address1', 'address2', 'address3', 'address4'],result);


    // one user
    const {u} = await xQueryWithVarsTxn({query: queryUsers('u')}, dgraphClient);
    expect(u.length).toBe(1);
    // with 4 addresses
    expect(u[0].addresses.length).toBe(4);

    // 4 total addresses in db
    const {allA} = await xQueryWithVarsTxn({query: queryAllAddresses('allA')}, dgraphClient);
    expect(allA.length).toBe(4);

    // address1 is william street
    const {a} = await xQueryWithVarsTxn({query: queryAddressByUid('a', address1Uid)}, dgraphClient);
    expect(a[0].street).toEqual('william');

    // address2 is george
    const {a2} = await xQueryWithVarsTxn({query: queryAddressByUid('a2', address2Uid)}, dgraphClient);
    expect(a2[0].street).toEqual('george');

    const delete_json = [
      {
        uid: userUid, // user uid
        addresses: [
          { uid: address1Uid }, // delete link with address 1
          { uid: address2Uid }, // delete link with address 2
        ],
      },
      {
        uid: address1Uid // delete actual address 1
      },
      {
        uid: address2Uid // delete actual address 2
      }
    ];

    await xDeleteJSONNowTxn(delete_json, dgraphClient);

    // still one user
    const {u2} = await xQueryWithVarsTxn({query: queryUsers('u2')}, dgraphClient);
    expect(u2.length).toBe(1);

    // 2 addresses now
    expect(u2[0].addresses.length).toBe(2);

    // hay and short are the addresses we have left
    expect(u2[0].addresses[0].street).toEqual('hay');
    expect(u2[0].addresses[1].street).toEqual('short');

    // hay and short are the only addresses we have left in the db
    const {allA2} = await xQueryWithVarsTxn({query: queryAllAddresses('allA2')}, dgraphClient);
    expect(allA2.length).toBe(2);
    expect(allA2[0].postcode).toBe(2444);
    expect(allA2[0].street).toBe('hay');
    expect(allA2[1].postcode).toBe(2107);
    expect(allA2[1].street).toBe('short');

    // we can no longer query for the old address
    const {a3} = await xQueryWithVarsTxn({query: queryAddressByUid('a3', address1Uid)}, dgraphClient);
    expect(a3[0].street).toBeUndefined();
    expect(a3[0].postcode).toBeUndefined();

    const {a4} = await xQueryWithVarsTxn({query: queryAddressByUid('a4', address2Uid)}, dgraphClient);
    expect(a4[0].street).toBeUndefined();
    expect(a4[0].postcode).toBeUndefined();
  })
});
