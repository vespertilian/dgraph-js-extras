import {setup} from '../../test-helpers/setup';
import {XSetSchemaNow} from '../set-schema-now/set-schema-now';
import {XSetJs, XSetJSCommitNow} from './js-set';

describe('XSetJs', () => {
  it('should add new data when no uid id set', async() => {
      const {dgraphClient} = await setup();
      const schema = `
            name: string @index(fulltext) .
            age: int .
        `;

      await XSetSchemaNow(schema, dgraphClient);


      const data =[
          { name: 'Cameron', age: 35 },
          { name: 'Helena', age: 31 }
      ];

      const setObject = XSetJs(data);

      const trx =  dgraphClient.newTxn();
      await trx.mutate(setObject);
      await trx.commit();

      const predicateNameQuery = `{
            q(func: has(name)) {
                name
                age
            }
        }`;

      const queryRes = await dgraphClient.newTxn().query(predicateNameQuery);
      expect(queryRes.getJson().q).toEqual(data)
  });

    it('should overwrite data when a uid is passed in', async() => {
        const {dgraphClient} = await setup();
        const schema = `
            name: string @index(fulltext) .
            age: int .
        `;

        await XSetSchemaNow(schema, dgraphClient);


        const setHelena = XSetJs([
            { name: 'Helena', age: 31 }
        ]);

        const trx =  dgraphClient.newTxn();
        const result = await trx.mutate(setHelena);
        await trx.commit();


        const helenaUid = result.getUidsMap().get('blank-0');

        const cameron = { uid: helenaUid, name: 'Cameron', age: 35 }
        const setCameron = XSetJs(cameron);

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

describe('XSetJSCommitNow', () => {
    it('should add new data and commit the mutation as soon as it is called', async() => {
        const {dgraphClient} = await setup();
        const schema = `
            name: string @index(fulltext) .
            age: int .
        `;

        await XSetSchemaNow(schema, dgraphClient);
        const data = { name: 'Cameron', age: 35 };

        const setObject = XSetJSCommitNow(data);

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
    })
});