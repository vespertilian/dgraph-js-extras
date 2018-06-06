import {basicEqualityQueryFn} from './basic-equality-query-fn';

// todo check other query return values
describe('xbasicEqualityQueryFn', () => {
    it('should build a query when matching a single term', () => {
        const searchPredicate = 'name';
        const data = {
            name: 'Cameron',
            age: 35
        };

        const queryFn = basicEqualityQueryFn(searchPredicate);
        const {dgraphQuery} = queryFn(data);

        const expectedQuery = `{
            q(func: eq(name, "Cameron")) {
                uid
            }
        }`;
        expect(dgraphQuery).toEqual(expectedQuery)
    });

    it('should build a query when matching a two terms', () => {
        const searchPredicates = ['name', 'email'];
        const data = {
            name: 'Cameron',
            email: 'cam@gmail.com',
            age: 35
        };

        const queryFn = basicEqualityQueryFn(searchPredicates);
        const {dgraphQuery} = queryFn(data);

        const expectedQuery = `
        {
            q(func: eq(name, "Cameron"))
            @filter(eq(email, "cam@gmail.com"))
            {
                uid
            }
        }`;
        expect(dgraphQuery).toEqual(expectedQuery)
    });

    it('should build a query when matching more than two terms', () => {
        const searchPredicates = ['name', 'email', 'twitter'];
        const data = {
            name: 'Cameron',
            email: 'cam@gmail.com',
            twitter: 'vespertilian',
            age: 35
        };

        const queryFn = basicEqualityQueryFn(searchPredicates);
        const {dgraphQuery} = queryFn(data);

        const expectedQuery = `
        {
            q(func: eq(name, "Cameron"))
            @filter(eq(email, "cam@gmail.com")
                AND eq(twitter, "vespertilian"))
            {
                uid
            }
        }`;
        expect(dgraphQuery).toEqual(expectedQuery)
    });

    it('should throw an error if the key predicate is not present on the object being used for the upsert', async() => {
        const searchPredicates = ['name', 'email'];
        const data = {
            name: 'Cameron',
        };

        const queryFn = basicEqualityQueryFn(searchPredicates);

        expect(() => queryFn(data)).toThrowError(`
        The search predicate/s must be a value on the object you are trying to persist.
        
        "email" does not exist on:
        {"name":"Cameron"}`);
    });
});
