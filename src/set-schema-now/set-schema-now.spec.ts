import {XSetSchemaNow} from './set-schema-now';
import {setup} from '../../test-helpers/setup';
import {XGetSchemaMapNow} from '../get-schema-map-now/get-schema-map-now';

describe('SetSchema', () => {
    it('should allow you to set the schema with only one command', async() => {
        const {dgraphClient} = await setup();

        const schema = `
            name: string @index(fulltext) .
            email: string @index(exact) .
            friend: uid .
        `;

        await XSetSchemaNow(schema, dgraphClient);
        const schemaMap = await XGetSchemaMapNow(dgraphClient);

        expect(schemaMap.name.getType()).toEqual('string');
        expect(schemaMap.email.getType()).toEqual('string');
        expect(schemaMap.friend.getType()).toEqual('uid');
        expect(Object.keys(schemaMap).length).toBe(3)
    })
});