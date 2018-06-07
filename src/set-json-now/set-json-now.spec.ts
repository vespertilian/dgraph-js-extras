import {xSetupForTestNow} from '../test-helpers/setup';
import {xSetSchemaNow} from '../set-schema-now/set-schema-now';
import {xSetJSONNow} from './set-json-now';

describe('xSetJSONNow', () => {
    it('should instantly persist js object data', async() => {
        const {dgraphClient} = await xSetupForTestNow();

        const schema = `
            name: string @index(fulltext) .
            age: int .
        `;

        await xSetSchemaNow(schema, dgraphClient);
        const data = { name: 'Cameron', age: 35 };

        // set data with one line
        await xSetJSONNow(data, dgraphClient);

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
