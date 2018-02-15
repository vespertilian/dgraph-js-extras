import {XSetSchema} from './set-schema';
import {setup} from '../test-helpers/setup';
import {XGetSchemaMap} from '../get-schema/get-schema';

describe('SetSchema', () => {
    it('should allow you to set the schema with only one command', async() => {
        const {dgraphClient} = await setup();

        const schema = `
            name: string @index(fulltext) .
            email: string @index(exact) .
            friend: uid .
        `;

        await XSetSchema(schema, dgraphClient);
        const schemaMap = await XGetSchemaMap(dgraphClient);

        expect(schemaMap.name.getType()).toEqual('string');
        expect(schemaMap.email.getType()).toEqual('string');
        expect(schemaMap.friend.getType()).toEqual('uid');
        expect(Object.keys(schemaMap).length).toBe(3)
    })
});