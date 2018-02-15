import {setup} from '../test-helpers/setup';
import {XTrxSetJSNow} from './trx-set-now';
import {XSetSchema} from '../set-schema/set-schema';

describe('XTrxSetJSNow', () => {
    it('should instantly persist js object data', async() => {
        const {dgraphClient} = await setup();

        const schema = `
            name: string @index(fulltext) .
            age: int .
        `;

        await XSetSchema(schema, dgraphClient);
        const data = { name: 'Cameron', age: 35 };

        // set data with one line
        await XTrxSetJSNow(data, dgraphClient);

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
