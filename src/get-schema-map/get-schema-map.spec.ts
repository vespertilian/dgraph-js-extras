import {xSetSchemaAlt} from '../set-schema/set-schema';
import {xSetupForTest} from '../test-helpers/setup';
import {xGetSchemaMapTxn} from './get-schema-map';

describe('xGetSchemaMapTxn', () => {
    it('returns a map of the current schema', async() => {
        const {dgraphClient} = await xSetupForTest();
        const schema = `
            name: string @index(fulltext) .
            age: int .
            percent: float .
            awesome: bool .
            friend: uid @reverse .
            date: dateTime .
            location: geo .
        `;
        await xSetSchemaAlt(schema, dgraphClient);
        const schemaMap = await xGetSchemaMapTxn(dgraphClient);

        // check that all valid dgraph types work
        expect(schemaMap.name.getType()).toBe('string');
        expect(schemaMap.age.getType()).toBe('int');
        expect(schemaMap.percent.getType()).toBe('float');
        expect(schemaMap.friend.getType()).toBe('uid');
        expect(schemaMap.date.getType()).toBe('datetime');
        expect(schemaMap.location.getType()).toBe('geo');

        // only return predicates we created
        expect(schemaMap._predicate_).toBeUndefined();
        expect(Object.keys(schemaMap).length).toBe(7)
    })
});
