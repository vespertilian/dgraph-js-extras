import {XSetupWithSchemaDataNow} from './setup';
import {XGetSchemaMapNow} from '..';
import {XDropDBNow} from './drob-db';

describe('XDropDBNow', () => {
    it('should drop the db', async() => {
        // setup db
        const schema = `
            name: string @index(hash) .
            email: string @index(hash) .`;

        const {dgraphClient} = await XSetupWithSchemaDataNow({schema});

        const schemaMap = await XGetSchemaMapNow(dgraphClient);
        expect(schemaMap.name.getType()).toBe('string');
        expect(Object.keys(schemaMap).length).toBe(2);

        await XDropDBNow(dgraphClient);
        const secondSchemaMap = await XGetSchemaMapNow(dgraphClient);
        expect(secondSchemaMap.name).toBeUndefined();
        expect(Object.keys(secondSchemaMap).length).toBe(0);

    })
});
