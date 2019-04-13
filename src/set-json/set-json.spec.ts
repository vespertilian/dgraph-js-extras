import {xSetupForTest} from '../test-helpers/setup';
import {xSetSchemaAlt} from '../set-schema/set-schema';
import {xSetJSON, xSetJSONCommit, xSetJSONCommitTxn} from './set-json';
import { xExtractFirstUid } from '../extract-uids/extract-uids';
import { xQueryTxn } from '../query/query';

describe('xSetJSON', () => {
  it('adds new data when no uid id set', async() => {
      const {dgraphClient} = await xSetupForTest();
      const schema = `
            name: string @index(fulltext) .
            age: int .
        `;

      await xSetSchemaAlt(schema, dgraphClient);


      const data =[
          { name: 'Cameron', age: 35 },
          { name: 'Helena', age: 31 }
      ];

      const setObject = xSetJSON(data);

      const trx =  dgraphClient.newTxn();
      await trx.mutate(setObject);
      await trx.commit();

      const predicateNameQuery = `{
            q(func: has(name), orderasc: name) {
                name
                age
            }
        }`;

      const queryRes = await dgraphClient.newTxn().query(predicateNameQuery);
      expect(queryRes.getJson().q).toEqual(data)
  });

    it('overwrites data when a uid is passed in', async() => {
        const {dgraphClient} = await xSetupForTest();
        const schema = `
            name: string @index(fulltext) .
            age: int .
        `;

        await xSetSchemaAlt(schema, dgraphClient);


        const setHelena = xSetJSON([
            { name: 'Helena', age: 31 }
        ]);

        const trx =  dgraphClient.newTxn();
        const result = await trx.mutate(setHelena);
        await trx.commit();


        const helenaUid = result.getUidsMap().get('blank-0');

        const cameron = { uid: helenaUid, name: 'Cameron', age: 35 }
        const setCameron = xSetJSON(cameron);

        const trx2 =  dgraphClient.newTxn();
        await trx2.mutate(setCameron);
        await trx2.commit();

        const predicateNameQuery = `{
            q(func: has(name)) {
                uid
                name
                age
            }
        }`;

        const queryRes = await dgraphClient.newTxn().query(predicateNameQuery);
        expect(queryRes.getJson().q).toEqual([cameron])
    });
});

describe('xSetJSONCommitNow', () => {
    it('adds new data and commit the mutation as soon as it is called', async() => {
        const {dgraphClient} = await xSetupForTest();
        const schema = `
            name: string @index(fulltext) .
            age: int .
        `;

        await xSetSchemaAlt(schema, dgraphClient);
        const data = { name: 'Cameron', age: 35 };

        const setObject = xSetJSONCommit(data);

        expect(setObject.getCommitNow()).toBe(true);

        const trx = dgraphClient.newTxn();
        await trx.mutate(setObject);

        const predicateNameQuery = `{
            q(func: has(name)) {
                name
                age
            }
        }`;

        const queryRes = await dgraphClient.newTxn().query(predicateNameQuery);
        expect(queryRes.getJson().q).toEqual([data])
    });

});

describe('xSetJSONCommit', () => {
  it('instantly persists js object data', async() => {
    const {dgraphClient} = await xSetupForTest();

    const schema = `
            name: string @index(fulltext) .
            age: int .
        `;

    await xSetSchemaAlt(schema, dgraphClient);
    const data = { name: 'Cameron', age: 35 };

    // set data with one line
    await xSetJSONCommitTxn(data, dgraphClient);

    const predicateNameQuery = `{
            q(func: has(name)) {
                name
                age
            }
        }`;

    const queryRes = await dgraphClient.newTxn().query(predicateNameQuery);
    expect(queryRes.getJson().q).toEqual([data])
  });

  it('lets you set nested objects', async() => {
    const {dgraphClient} = await xSetupForTest();

    const person = {
      name: "Alice",
      age: 26,
      loc: "Riley Street",
      married: true,
      schools: [
        {
          name: "Crown Public School",
        },
      ],
      friends: [
        {
          name: "Bob",
          age: 24,
        },
        {
          name: "Charlie",
          age: 29,
        },
      ],
    };

    const person2 = {
      name: "Bob",
      age: 24,
      loc: "Riley Street",
      married: true,
      schools: [
        {
          name: "Crown Public School",
        },
      ],
      friends: [
        {
          name: "Alice",
          age: 26,
        },
        {
          name: "Charlie",
          age: 29,
        },
      ],
    };

    const uid = await xExtractFirstUid(xSetJSONCommitTxn([person, person2], dgraphClient));

    const personQuery = `{
            q(func: uid(${uid})) {
                uid
                name
                age
                loc
                married
                friends {
                    uid
                    name
                    age
                }
                schools {
                    uid
                    name
                }
            }
        }`;

    const result = await xQueryTxn(personQuery, dgraphClient);
  })
});
