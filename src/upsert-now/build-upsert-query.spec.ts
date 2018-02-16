import {buildUpsertQuery} from './upsert-now';

describe('buildUpsertQuery', () => {
    it('should build a query when matching a single term', () => {
        const searchPredicate = 'name';
        const data = {
            name: 'Cameron',
            age: 35
        };
        const {query} = buildUpsertQuery(searchPredicate, data);

        const expectedQuery = `{
            q(func: eq(name, "Cameron")) {
                uid
            }
        }`;
        expect(query).toEqual(expectedQuery)
    });

    it('should build a query when matching a two terms', () => {
        const searchPredicates = ['name', 'email'];
        const data = {
            name: 'Cameron',
            email: 'cam@gmail.com',
            age: 35
        };
        const {query} = buildUpsertQuery(searchPredicates, data);

        const expectedQuery = `
        {
            q(func: eq(name, "Cameron"))
            @filter(eq(email, "cam@gmail.com"))
            {
                uid
            }
        }`;
        expect(query).toEqual(expectedQuery)
    });

    it('should build a query when matching more than two terms', () => {
        const searchPredicates = ['name', 'email', 'twitter'];
        const data = {
            name: 'Cameron',
            email: 'cam@gmail.com',
            twitter: 'vespertilian',
            age: 35
        };
        const {query} = buildUpsertQuery(searchPredicates, data);

        const expectedQuery = `
        {
            q(func: eq(name, "Cameron"))
            @filter(eq(email, "cam@gmail.com")
                AND eq(twitter, "vespertilian"))
            {
                uid
            }
        }`;
        expect(query).toEqual(expectedQuery)
    })

});
