import {XSetupForTestNow} from '../test-helpers/setup';
import {XSetSchemaNow} from '../set-schema-now/set-schema-now';
import {XSetJSONNow} from './set-json-now';

describe('XSetJSONNow', () => {
    it('should instantly persist js object data', async() => {
        const {dgraphClient} = await XSetupForTestNow();

        const schema = `
            name: string @index(fulltext) .
            age: int .
        `;

        await XSetSchemaNow(schema, dgraphClient);
        const data = { name: 'Cameron', age: 35 };

        // set data with one line
        await XSetJSONNow(data, dgraphClient);

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
