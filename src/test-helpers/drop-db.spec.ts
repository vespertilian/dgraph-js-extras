import {xSetupWithSchemaDataNow} from './setup';
import {xGetSchemaMapNow} from '..';
import {xDropDBNow} from './drob-db';

describe('xDropDBNow', () => {
    it('should drop the db', async() => {
        // setup db
        const schema = `
            name: string @index(hash) .
            email: string @index(hash) .`;

        const {dgraphClient} = await xSetupWithSchemaDataNow({schema});

        const schemaMap = await xGetSchemaMapNow(dgraphClient);
        expect(schemaMap.name.getType()).toBe('string');
        expect(Object.keys(schemaMap).length).toBe(2);

        await xDropDBNow(dgraphClient);
        const secondSchemaMap = await xGetSchemaMapNow(dgraphClient);
        expect(secondSchemaMap.name).toBeUndefined();
        expect(Object.keys(secondSchemaMap).length).toBe(0);

    }, 10000)
});
