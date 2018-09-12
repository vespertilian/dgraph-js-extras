import {xSetupWithSchemaDataNow} from '../test-helpers/setup';
import {xExtractNamedUids} from '../extract-named-uid/extract-named-uids';
import {xQueryNow} from '../query-with-vars-now/query-with-vars-now';
import {xDeleteJSONNow} from './delete-json-now';
const schema = `
    name: string @index(exact) .
    street: string @index(exact) .
`;

const sampleData = {
  uid: "_:user",
  name: "cameron",
  addresses: [
    {uid: "_:address1", street: "william", postcode: 2000},
    {uid: "_:address2", street: "george", postcode: 2001}
  ]
};

const queryUsers = (prefix: string) => ` {
  ${prefix}(func: has(name)) {
    uid
    name
    addresses {
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
  ${prefix}(func: has(street)) {
    uid,
    street
    postcode
  }
}`;

describe("delete-json-now node from another node", () => {
  it("lets you delete-json-now on node from another node", async() => {
    const {result, dgraphClient} = await xSetupWithSchemaDataNow({schema, data: sampleData});

    const [userUid, address1Uid, address2Uid] = xExtractNamedUids(['user', 'address1', 'address2'],result);

    const {u} = await xQueryNow({query: queryUsers('u')}, dgraphClient);
    expect(u.length).toBe(1);
    expect(u[0].addresses.length).toBe(2);

    const {allA} = await xQueryNow({query: queryAllAddresses('allA')}, dgraphClient);
    expect(allA.length).toBe(2);

    const {a} = await xQueryNow({query: queryAddressByUid('a', address1Uid)}, dgraphClient);
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

    await xDeleteJSONNow(delete_json, dgraphClient);

    // checks
    const {u2} = await xQueryNow({query: queryUsers('u2')}, dgraphClient);
    expect(u2.length).toBe(1);
    expect(u2[0].addresses.length).toBe(1);

    expect(u2[0].addresses[0].street).toEqual('george');
    expect(u2[0].addresses[0].uid).toEqual(address2Uid);

    const {allA2} = await xQueryNow({query: queryAllAddresses('allA2')}, dgraphClient);
    expect(allA2.length).toBe(1);
    expect(allA2[0].street).toBe('george');
    expect(allA2[0].postcode).toBe(2001);

    const {a2} = await xQueryNow({query: queryAddressByUid('a2', address1Uid)}, dgraphClient);
    expect(a2[0].street).toBeUndefined();
    expect(a2[0].postcode).toBeUndefined();

  })
});
