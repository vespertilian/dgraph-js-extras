import {xSetupWithSchemaDataCommitTxn} from '../test-helpers/setup';
import {xGetSchemaMapTxn} from '..';
import {xDropDBAlt} from './drob-db';

describe('xDropDBAlt', () => {
    it('drops the db', async() => {
        // setup db
        const schema = `
            name: string @index(hash) .
            email: string @index(hash) .`;

        const {dgraphClient} = await xSetupWithSchemaDataCommitTxn({schema});

        const schemaMap = await xGetSchemaMapTxn(dgraphClient);
        expect(schemaMap.name.getType()).toBe('string');
        expect(Object.keys(schemaMap).length).toBe(2);

        await xDropDBAlt(dgraphClient);
        const secondSchemaMap = await xGetSchemaMapTxn(dgraphClient);
        expect(secondSchemaMap.name).toBeUndefined();
        expect(Object.keys(secondSchemaMap).length).toBe(0);

    }, 10000)
});
