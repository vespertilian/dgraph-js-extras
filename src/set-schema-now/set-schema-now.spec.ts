import {xSetSchemaNow} from './set-schema-now';
import {xSetupForTestNow} from '../test-helpers/setup';
import {xGetSchemaMapNow} from '../get-schema-map-now/get-schema-map-now';

describe('SetSchema', () => {
    it('should allow you to set the schema with only one command', async() => {
        const {dgraphClient} = await xSetupForTestNow();

        const schema = `
            name: string @index(fulltext) .
            email: string @index(exact) .
            friend: uid .
        `;

        await xSetSchemaNow(schema, dgraphClient);
        const schemaMap = await xGetSchemaMapNow(dgraphClient);

        expect(schemaMap.name.getType()).toEqual('string');
        expect(schemaMap.email.getType()).toEqual('string');
        expect(schemaMap.friend.getType()).toEqual('uid');
        expect(Object.keys(schemaMap).length).toBe(3)
    })
});