import {XSetSchema} from '../set-schema/set-schema';
import {setup} from '../test-helpers/setup';
import {XGetSchemaMap} from './get-schema';

describe('XGetSchema', () => {
    it('should return a map of the current schema', async() => {
        const {dgraphClient} = await setup();
        const schema = `
            name: string @index(fulltext) .
            age: int .
            percent: float .
            awesome: bool .
            friend: uid @reverse .
            date: dateTime .
            location: geo .
        `;
        await XSetSchema(schema, dgraphClient);
        const schemaMap = await XGetSchemaMap(dgraphClient);

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
