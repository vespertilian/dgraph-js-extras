import {XSetSchemaNow} from '../set-schema-now/set-schema-now';
import {XSetupForTestNow} from '../test-helpers/setup';
import {XGetSchemaMapNow} from './get-schema-map-now';

describe('XGetSchema', () => {
    it('should return a map of the current schema', async() => {
        const {dgraphClient} = await XSetupForTestNow();
        const schema = `
            name: string @index(fulltext) .
            age: int .
            percent: float .
            awesome: bool .
            friend: uid @reverse .
            date: dateTime .
            location: geo .
        `;
        await XSetSchemaNow(schema, dgraphClient);
        const schemaMap = await XGetSchemaMapNow(dgraphClient);

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
