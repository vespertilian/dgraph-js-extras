import {xSetSchemaAlt} from './set-schema';
import {xSetupForTest} from '../test-helpers/setup';
import {xGetSchemaMapTxn} from '../get-schema-map/get-schema-map';

describe('SetSchemaOp', () => {
    it('should allow you to set the schema with only one command', async() => {
        const {dgraphClient} = await xSetupForTest();

        const schema = `
            name: string @index(fulltext) .
            email: string @index(exact) .
            friend: uid .
        `;

        await xSetSchemaAlt(schema, dgraphClient);
        const schemaMap = await xGetSchemaMapTxn(dgraphClient);

        expect(schemaMap.name.getType()).toEqual('string');
        expect(schemaMap.email.getType()).toEqual('string');
        expect(schemaMap.friend.getType()).toEqual('uid');
        expect(Object.keys(schemaMap).length).toBe(3)
    })
});